"""
Standalone summarization utilities using Hugging Face Inference API.

Provides:
  - summarize_text(): main summarization entrypoint.
        → RETURNS STRING (clean ~8-sentence summary)
  - extractive_summarize(): deterministic offline extractive summarizer.
        → RETURNS STRING

Environment variables:
  - HF_API_TOKEN: required for abstractive summarization via Hugging Face Inference API.
  - HF_SUMMARY_MODEL: optional model ID
  - FORCE_EXTRACTIVE_SUMMARY: if set to "1"/"true" → force extractive
  - DEBUG_SUMMARY: if "1"/"true" → print debug logs
"""

from dotenv import load_dotenv
load_dotenv()

import os
import math
import heapq
import re
from typing import Optional, Any, List

from huggingface_hub import InferenceClient


# -------------------------------------------------------------
# CONFIG
# -------------------------------------------------------------
_STOPWORDS = {
    "the","and","is","in","it","of","to","a","for","on","that","this","with","as","are","was","be",
    "by","or","an","from","at","has","have","which","we","can","not","but","will","their","they",
    "its","these","such","also"
}

_MAX_MODEL_CHARS = 5000
_HF_CLIENT: Optional[InferenceClient] = None
_DEBUG = os.getenv("DEBUG_SUMMARY","").lower() in ("1","true","yes")


# -------------------------------------------------------------
# Helpers
# -------------------------------------------------------------

def _debug(msg: str):
    if _DEBUG:
        print("[DEBUG]", msg)


def _hf_get_model_name() -> str:
    return os.getenv("HF_SUMMARY_MODEL", "sshleifer/distilbart-cnn-12-6").strip()


def _get_hf_client() -> InferenceClient:
    global _HF_CLIENT
    if _HF_CLIENT is None:
        token = os.getenv("HF_API_TOKEN", "") or None
        model = _hf_get_model_name()
        _debug(f"Initializing HF client with model={model}")
        _HF_CLIENT = InferenceClient(model=model, token=token)
    return _HF_CLIENT

def _enforce_sentence_bounds(summary: str, original_text: str, min_sentences: int = 10, max_sentences: int = 12) -> str:
    """
    Ensure summary has between min_sentences and max_sentences.
    If too short → add more extractive sentences from original text.
    If too long → truncate.
    """
    sents = _tokenize_sentences(summary)

    # If already within range → return as-is
    if min_sentences <= len(sents) <= max_sentences:
        return " ".join(sents).strip()

    # If too long → truncate
    if len(sents) > max_sentences:
        return " ".join(sents[:max_sentences]).strip()

    # If too short → pad with extractive sentences from original
    if len(sents) < min_sentences:
        extra = extractive_summarize(original_text, max_sentences=min_sentences)
        extra_sents = _tokenize_sentences(extra)
        
        for s in extra_sents:
            if len(sents) >= min_sentences:
                break
            if s not in sents:
                sents.append(s)

    return " ".join(sents).strip()

def _prepare_for_model(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > _MAX_MODEL_CHARS:
        text = text[:_MAX_MODEL_CHARS]
    return text


def _parse_hf_output(out: Any) -> str:
    if isinstance(out, str):
        return out.strip()

    if isinstance(out, (list, tuple)) and out:
        first = out[0]
        if isinstance(first, str):
            return first.strip()
        if isinstance(first, dict):
            for k in ("summary_text","generated_text","text","content"):
                if k in first and isinstance(first[k], str):
                    return first[k].strip()

    if isinstance(out, dict):
        for k in ("summary_text","generated_text","text","content"):
            if k in out and isinstance(out[k], str):
                return out[k].strip()

    for k in ("summary_text","generated_text","text","content"):
        if hasattr(out, k):
            v = getattr(out, k)
            if isinstance(v, str):
                return v.strip()

    return str(out).strip()


def _tokenize_sentences(text: str) -> List[str]:
    if not text:
        return []
    text = text.replace("\n"," ").replace("\r"," ")
    sentences = re.split(r"(?<=[\.\?\!])\s+", text.strip())
    return [s.strip() for s in sentences if s.strip()]


def _tokenize_words(sentence: str) -> List[str]:
    return re.findall(r"[A-Za-z][A-Za-z0-9']*", sentence.lower())


def _normalize_summary_sentences(summary: str, target: int = 12) -> str:
    sents = _tokenize_sentences(summary)
    if len(sents) > target:
        sents = sents[:target]
    return " ".join(sents).strip()


# -------------------------------------------------------------
# Extractive Summarizer (IMPROVED)
# -------------------------------------------------------------

def extractive_summarize(text: str, max_sentences: int = 12) -> str:
    """
    Clean, deterministic extractive summarizer.
    RETURNS STRING.
    """
    _debug("extractive_summarize() called")

    if not text or not text.strip():
        return ""

    sentences = _tokenize_sentences(text)
    n = len(sentences)
    if n <= max_sentences:
        return " ".join(sentences)

    # Build word frequency table
    words = []
    for s in sentences:
        words.extend(_tokenize_words(s))

    freq = {}
    for w in words:
        if w not in _STOPWORDS and len(w) > 2:
            freq[w] = freq.get(w, 0) + 1

    if not freq:
        return " ".join(sentences[:max_sentences])

    maxf = max(freq.values())
    for k in freq:
        freq[k] /= maxf

    # Score sentences
    scored = []
    for i, s in enumerate(sentences):
        tokens = _tokenize_words(s)
        if len(tokens) < 3:
            continue

        score = sum(freq.get(w, 0.0) for w in tokens)
        score = score / len(tokens)

        # Position weighting - boost first and last sentences
        if i == 0:
            pos_weight = 1.3
        elif i >= n - 2:
            pos_weight = 1.15
        else:
            pos_weight = 1.0 + 0.1 * (1.0 - i / max(1, n-1))
        final = score * pos_weight

        scored.append((i, final))

    if not scored:
        return " ".join(sentences[:max_sentences])

    top = heapq.nlargest(max_sentences, scored, key=lambda t: t[1])
    top_idx = sorted([i for i,_ in top])

    return " ".join(sentences[i] for i in top_idx)


# -------------------------------------------------------------
# HF Abstractive Helper
# -------------------------------------------------------------

def _hf_summarize_chunk(chunk: str, token: str, min_len: int, max_len: int) -> str:
    client = _get_hf_client()
    chunk = _prepare_for_model(chunk)
    if not chunk:
        return ""

    _debug(f"HF abstractive on chunk of {len(chunk)} chars")

    out = client.summarization(chunk)
    return _parse_hf_output(out)


def _hf_abstractive_summarize_long(text: str, token: str, max_chunk: int, min_len: int, max_len: int) -> str:
    text = text.strip()
    L = len(text)

    if L > 20000:
        _debug("Precompressing huge text (extractive 18)")
        pre = extractive_summarize(text, 18)
        return _hf_summarize_chunk(pre, token, min_len, max_len)

    if L > 8000:
        _debug("Precompressing medium text (extractive 15)")
        pre = extractive_summarize(text, 15)
        return _hf_summarize_chunk(pre, token, min_len, max_len)

    _debug("Direct HF summarization")
    return _hf_summarize_chunk(text, token, min_len, max_len)


# -------------------------------------------------------------
# summarize_text (MAIN ENTRYPOINT)
# -------------------------------------------------------------

def summarize_text(
    text: str,
    max_chunk_chars: int = 1200,
    min_length: int = 150,
    max_length: int = 400,
    abstractive: bool = True,
) -> str:
    """
    Main summarization API.

    RETURNS STRING (~12 sentences).
    """
    if not text or not text.strip():
        return ""

    # 1) If HF is disabled or we are forced extractive or abstractive=False
    if not abstractive:
        _debug("summarize_text → extractive (HF disabled/forced/abstractive=False)")
        out = extractive_summarize(text, max_sentences=12)
        return _normalize_summary_sentences(out)

    # 2) Try HF abstractive
    token = os.getenv("HF_API_TOKEN","").strip()
    if not token:
        print("[summarizer] HF_API_TOKEN missing → using extractive fallback")
        _debug("summarize_text → extractive (no HF token)")
        out = extractive_summarize(text, 12)
        return _normalize_summary_sentences(out)

    try:
        _debug("summarize_text → HF abstractive path")
        raw = _hf_abstractive_summarize_long(text, token, max_chunk_chars, min_length, max_length)
        summary = _parse_hf_output(raw)
    except Exception as e:
        print(f"[summarizer] HF summarization failed: {e}")
        _debug("summarize_text → extractive fallback after HF error")
        summary = extractive_summarize(text, 12)

    return _enforce_sentence_bounds(summary, text, min_sentences=10, max_sentences=12)

__all__ = ["summarize_text", "extractive_summarize"]
