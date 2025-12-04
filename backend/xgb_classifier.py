import re
import numpy as np

def compute_doc_stats(blocks):
    fonts = [b.get("font_size", 10) for b in blocks if b.get("font_size")]
    median_font = float(np.median(fonts)) if fonts else 10.0
    
    # Estimate page dimensions from blocks
    max_x = max((b.get("bbox", [0, 0, 600, 0])[0] + b.get("bbox", [0, 0, 600, 0])[2]) for b in blocks)
    max_y = max((b.get("bbox", [0, 0, 0, 800])[1] + b.get("bbox", [0, 0, 0, 800])[3]) for b in blocks)
    
    return {
        "median_font": median_font,
        "page_width": max_x if max_x > 0 else 600,
        "page_height": max_y if max_y > 0 else 800
    }

# characters to remove / normalize
_INVIS = [
    '\u00A0',  # no-break space
    '\u200B',  # zero width space
    '\u2060',  # word joiner
    '\uFEFF',  # BOM
    '\u00AD',  # soft hyphen
]

def clean_text(s: str) -> str:
    if not s:
        return s
    # Replace invisibles with normal space or remove
    for ch in _INVIS:
        s = s.replace(ch, ' ')
    # collapse many spaces/newlines to single space/newline as appropriate
    s = re.sub(r'[ \t\f\v]+', ' ', s)
    # preserve newline boundaries but remove trailing/leading whitespace
    s = '\n'.join(line.strip() for line in s.splitlines() if line.strip() != '')
    return s.strip()

def extract_first_line(s: str) -> str:
    """Return the first non-empty line (after cleaning)."""
    s = clean_text(s)
    lines = [ln for ln in s.splitlines() if ln.strip()]
    return lines[0] if lines else s

# More tolerant header regexes (operate on the first line only)
RE_H1 = re.compile(r'^\s*(?:(?:\d+\s+)?H1:|(?:\d+\s+)?[A-Z][\w\-]{1,20}:|\d+\s+[A-Z])', re.IGNORECASE)
RE_H2 = re.compile(r'^\s*(?:(?:\d+\.\d+\s+)?H2:|\d+\.\d+\s+[A-Z])', re.IGNORECASE)
RE_H3 = re.compile(r'^\s*(?:(?:\d+\.\d+\.\d+\s+)?H3:|\d+\.\d+\.\d+\s+[A-Z])', re.IGNORECASE)
RE_NUMERIC_PREFIX = re.compile(r'^\s*\d+(?:\.\d+)*\b')

def rule_based_label_block(block, doc_stats):
    """
    Improved rule-based label: inspect only the first line. If header is found and the rest
    of the block contains more words, split externally (see classify_blocks_with_split).
    Returns (label, confidence, should_split_header_bool)
    """
    raw_text = block.get("text", "")
    text = clean_text(raw_text)
    first_line = extract_first_line(text)
    words_first = re.findall(r'\S+', first_line)
    wc_first = len(words_first)

    font_size = block.get("font_size", None)
    rel_font = font_size / doc_stats.get("median_font", 10) if font_size else 1.0

    # strong header signals on the first line
    if RE_H3.match(first_line) or RE_NUMERIC_PREFIX.match(first_line) and first_line.count('.') >= 2:
        return 2, 0.90, True
    if RE_H2.match(first_line) or RE_NUMERIC_PREFIX.match(first_line) and first_line.count('.') == 1:
        return 1, 0.92, True
    # H1 patterns: starts with digit and "H1" OR very short all-title-like line OR large relative font
    if RE_H1.match(first_line) or (wc_first <= 8 and sum(1 for w in words_first if w.istitle())/max(1,wc_first) > 0.6) or rel_font >= 1.25:
        return 0, 0.94, True

    # Fallback: if first line is short but block is long, treat first line as header candidate
    total_words = len(re.findall(r'\S+', text))
    if wc_first <= 8 and total_words > 20:
        # candidate header at top of a long block
        return 0, 0.75, True

    # Otherwise treat as body
    return 3, 0.95, False

def classify_blocks_with_split(blocks):
    """
    Preprocess each block; if rule says split header from body, create two results.
    Returns list of classification dicts similar to your previous outputs.
    """
    if not blocks:
        return []

    doc_stats = compute_doc_stats(blocks)  # reuse your function
    results = []

    for i, block in enumerate(blocks):
        label, conf, should_split = rule_based_label_block(block, doc_stats)
        text_clean = clean_text(block.get("text", ""))

        if should_split:
            # Split first line as header, remainder as body
            first_line = extract_first_line(text_clean)
            remainder = text_clean[len(first_line):].lstrip("\n\r ").strip()
            # header result
            results.append({
                "block_id": block.get("block_id", f"b{i}") + "_hdr",
                "text": first_line,
                "level": label + 1 if label < 3 else None,
                "level_label": ["H1","H2","H3","BODY"][label],
                "confidence": conf,
                "type": "heading" if label < 3 else "paragraph"
            })
            if remainder:
                results.append({
                    "block_id": block.get("block_id", f"b{i}") + "_body",
                    "text": remainder,
                    "level": None,
                    "level_label": "BODY",
                    "confidence": 0.95,
                    "type": "paragraph"
                })
        else:
            # single body block
            results.append({
                "block_id": block.get("block_id", f"b{i}"),
                "text": text_clean,
                "level": None,
                "level_label": "BODY",
                "confidence": conf,
                "type": "paragraph"
            })
    return results
