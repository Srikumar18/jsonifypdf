export const mockData = {
    "file": "uploads/Assignment-1-1135.pdf",
    "metadata": {
        "total_pages": 5,
        "total_images": 2,
        "total_tables": 1,
        "ocr_engine": "Tesseract",
        "ocr_version": "5.3.0",
        "avg_ocr_confidence": 0.92,
        "generated_at": "2025-12-04T06:30:00+05:30",
        "pipeline": ["pdfplumber_v0.8", "tesseract_5.3.0", "layoutlmv3_classifer_v1", "sbert-all-MiniLM-L6-v2"]
    },
    "pages": [
        {
            "page": 1,
            "width": 595,
            "height": 842,
            "raw_ocr_text": "UCS2502 – Microprocessors, Microcontrollers, and Interfacing Assignment – 1 Name: V. Srikumar ... Characteristics of Mode 0: • In this mode, ports act as straightforward input or output lines. • No strobe controls are required. • Output data is stored (latched) until it is updated again. • Input data is read directly from the pins, without being latched. • Ideal for basic input/output operations in control systems.",
            "text_blocks": [
                {
                    "block_id": "p1_b1",
                    "text": "UCS2502 – Microprocessors, Microcontrollers, and Interfacing Assignment – 1 Name: V. Srikumar Section: CSE – C Reg no: 3122235001135",
                    "bbox": [40, 60, 515, 25],
                    "type": "header",
                    "ocr_confidence": 0.95
                },
                {
                    "block_id": "p1_b2",
                    "text": "The objective of this system is to design and implement an 8086 microprocessor-based control unit using the 8255 Programmable Peripheral Interface (PPI) to manage eight electric home appliances.",
                    "bbox": [40, 100, 515, 60],
                    "type": "paragraph",
                    "ocr_confidence": 0.92
                },
                {
                    "block_id": "p1_b3",
                    "text": "Port Configuration: 8255 is connected in Mode 0 (simple I/O). Port A (PA): Output - Controls 8 appliances (ON/OFF). Port B (PB): Input - Reads signals from 8 manual control switches. Port C (PC): Output — Controls 8 LEDs representing the ON/OFF status of appliances.",
                    "bbox": [40, 180, 515, 120],
                    "type": "list",
                    "ocr_confidence": 0.90
                }
            ],
            "tables": [],
            "images": []
        },
        {
            "page": 2,
            "width": 595,
            "height": 842,
            "raw_ocr_text": "Relevance of Mode 0 for Appliance control: Easy Appliance Control: Appliances only require simple ON/OFF commands. No Synchronization Needed: Since no timing is required, control is direct.",
            "text_blocks": [
                {
                    "block_id": "p2_b1",
                    "text": "Relevance of Mode 0 for Appliance control:",
                    "bbox": [40, 60, 515, 20],
                    "type": "heading",
                    "ocr_confidence": 0.93
                },
                {
                    "block_id": "p2_b2",
                    "text": "Easy Appliance Control: Appliances only require simple ON/OFF commands. No Synchronization Needed: Since no timing is required, control is direct.",
                    "bbox": [40, 90, 515, 140],
                    "type": "paragraph",
                    "ocr_confidence": 0.89
                }
            ],
            "tables": [],
            "images": ["page_2_img_0.png"]
        },
        {
            "page": 3,
            "width": 595,
            "height": 842,
            "raw_ocr_text": "Memory Mapped I/O: 2. 8086 ALP for I/O mapped I/O and memory mapped I/O interfacing: I/O Mapped I/O: • The IN and OUT instructions are used. • Each port and control register has an 8-bit port address.",
            "text_blocks": [
                {
                    "block_id": "p3_b1",
                    "text": "Memory Mapped I/O:",
                    "bbox": [40, 60, 515, 18],
                    "type": "heading",
                    "ocr_confidence": 0.91
                },
                {
                    "block_id": "p3_b2",
                    "text": "I/O Mapped I/O: • The IN and OUT instructions are used. • Each port and control register has an 8-bit port address.",
                    "bbox": [40, 90, 515, 120],
                    "type": "paragraph",
                    "ocr_confidence": 0.88
                }
            ],
            "tables": [],
            "images": ["page_3_img_0.png"]
        },
        {
            "page": 4,
            "width": 595,
            "height": 842,
            "raw_ocr_text": "Program: ; (Initialize 8255) MOV AL, 80AH ; Control Word: PA=Out, PB=In, PC=Out MOV Dx, 83H OUT Dx, AL ; (Turn OFF all appliances and LEDs initially) ...",
            "text_blocks": [
                {
                    "block_id": "p4_b1",
                    "text": "Program: ; (Initialize 8255) MOV AL, 80AH ; Control Word: PA=Out, PB=In, PC=Out MOV DX, 83H OUT DX, AL ; ...",
                    "bbox": [40, 60, 515, 340],
                    "type": "code",
                    "ocr_confidence": 0.87
                }
            ],
            "tables": [],
            "images": []
        },
        {
            "page": 5,
            "width": 595,
            "height": 842,
            "raw_ocr_text": "Aspect | Memory Mapped I/O | I/O Mapped I/O ...",
            "text_blocks": [
                {
                    "block_id": "p5_b1",
                    "text": "Aspect Memory Mapped I/O I/O Mapped I/O",
                    "bbox": [40, 60, 515, 18],
                    "type": "heading",
                    "ocr_confidence": 0.90
                }
            ],
            "tables": [
                {
                    "table_id": "t1",
                    "bbox": [40, 90, 515, 300],
                    "rows": [
                        ["Aspect", "Memory Mapped I/O", "I/O Mapped I/O"],
                        ["Address Space", "Uses locations in the memory address space (e.g., F000:0000H–F000:0003H).", "Uses separate I/O port addresses (e.g., 60H–63H)."],
                        ["Address Length", "Requires full 20-bit decoding.", "Only 16-bit addressing is required."],
                        ["Instruction Usage", "Uses standard memory instructions like MOV, INC, DEC.", "Uses IN and OUT to control/read appliances"],
                        ["Address Decoding", "Decoder activates the device during memory cycles.", "Decoder activates the I/O device only during I/O cycles using the M/IO̅ signal."],
                        ["Memory Space Impact", "I/O device occupies part of the memory space.", "Occupies I/O address space, leaving memory free for program/data."],
                        ["Hardware Complexity", "Slightly more complex hardware because of additional address decoding.", "Simpler hardware design due to fewer address lines being decoded."]
                    ],
                    "headers": ["Aspect", "Memory Mapped I/O", "I/O Mapped I/O"],
                    "extracted_by": "camelot",
                    "confidence": 0.89
                }
            ],
            "images": []
        }
    ],
    "structure": {
        "id": "root_1",
        "type": "document",
        "text": "UCS2502 – Microprocessors, Microcontrollers, and Interfacing Assignment – 1",
        "normalized_text": "ucs2502 microprocessors microcontrollers and interfacing assignment 1",
        "level": 0,
        "page_refs": [{ "page": 1, "block_id": "p1_b1" }],
        "confidence": 0.98,
        "children": [
            {
                "id": "n1",
                "type": "heading",
                "text": "Objective / Abstract",
                "normalized_text": "objective of this system is to design and implement an 8086 microprocessor based control unit using the 8255 programmable peripheral interface ppi to manage eight electric home appliances",
                "level": 1,
                "page_refs": [{ "page": 1, "block_id": "p1_b2" }],
                "confidence": 0.97,
                "explain": { "font_size_ratio": 1.25, "is_bold": false, "model_prob": 0.95 },
                "children": [
                    {
                        "id": "n1_1",
                        "type": "paragraph",
                        "text": "The appliances can be switched ON/OFF through software instructions, their status can be monitored through LEDs and user inputs can be taken through switches. The design demonstrates both I/O mapped I/O and memory mapped I/O interfacing techniques.",
                        "level": 0,
                        "page_refs": [{ "page": 1, "block_id": "p1_b2" }],
                        "confidence": 0.94,
                        "explain": { "reason": "follow-on paragraph after heading" }
                    }
                ]
            },
            {
                "id": "n2",
                "type": "heading",
                "text": "Port Configuration",
                "normalized_text": "port configuration",
                "level": 1,
                "page_refs": [{ "page": 1, "block_id": "p1_b3" }],
                "confidence": 0.96,
                "explain": { "font_size_ratio": 1.1, "token_features": { "contains": "Port A" } },
                "children": [
                    {
                        "id": "n2_1",
                        "type": "list",
                        "text": "Port A (PA): Output - Controls 8 appliances (ON/OFF). Port B (PB): Input - Reads signals from 8 manual control switches. Port C (PC): Output — Controls 8 LEDs.",
                        "level": 0,
                        "page_refs": [{ "page": 1, "block_id": "p1_b3" }],
                        "confidence": 0.9
                    }
                ]
            },
            {
                "id": "n3",
                "type": "heading",
                "text": "Relevance of Mode 0 for Appliance control",
                "normalized_text": "relevance of mode 0 for appliance control",
                "level": 2,
                "page_refs": [{ "page": 2, "block_id": "p2_b1" }],
                "confidence": 0.95,
                "children": [
                    {
                        "id": "n3_1",
                        "type": "paragraph",
                        "text": "Easy Appliance Control: Appliances only require simple ON/OFF commands. No Synchronization Needed: Since no timing is required, control is direct. Instant Response: Switch inputs are read immediately by the microprocessor.",
                        "level": 0,
                        "page_refs": [{ "page": 2, "block_id": "p2_b2" }],
                        "confidence": 0.88
                    }
                ]
            },
            {
                "id": "n4",
                "type": "heading",
                "text": "Memory Mapped I/O / I/O Mapped I/O",
                "normalized_text": "memory mapped i o i o mapped i o",
                "level": 1,
                "page_refs": [{ "page": 3, "block_id": "p3_b1" }],
                "confidence": 0.95,
                "children": [
                    {
                        "id": "n4_1",
                        "type": "paragraph",
                        "text": "I/O Mapped I/O: The IN and OUT instructions are used. Assumptions: Port A = 80H Port B = 81H Port C = 82H Control = 83H",
                        "level": 0,
                        "page_refs": [{ "page": 3, "block_id": "p3_b2" }],
                        "confidence": 0.9
                    },
                    {
                        "id": "n4_2",
                        "type": "code",
                        "text": "; (Initialize 8255) MOV AL, 80AH ; Control Word: PA=Out, PB=In, PC=Out MOV DX, 83H OUT DX, AL ; (Turn OFF all appliances and LEDs initially) ...",
                        "level": 0,
                        "page_refs": [{ "page": 4, "block_id": "p4_b1" }],
                        "confidence": 0.87
                    },
                    {
                        "id": "n4_3",
                        "type": "table",
                        "text": "Comparison table: Memory Mapped vs I/O Mapped",
                        "level": 0,
                        "page_refs": [{ "page": 5, "table_id": "t1" }],
                        "confidence": 0.9
                    }
                ]
            }
        ]
    },
    "tables": [
        {
            "table_id": "t1",
            "page": 5,
            "bbox": [40, 90, 515, 300],
            "headers": ["Aspect", "Memory Mapped I/O", "I/O Mapped I/O"],
            "rows": [
                ["Address Space", "Uses locations in the memory address space (e.g., F000:0000H–F000:0003H).", "Uses separate I/O port addresses (e.g., 60H–63H)."],
                ["Address Length", "Requires full 20-bit decoding.", "Only 16-bit addressing is required."],
                ["Instruction Usage", "Uses standard memory instructions like MOV, INC, DEC, AND, OR etc.", "Uses IN and OUT to control/read appliances"],
                ["Address Decoding", "Decoder activates the device during memory cycles.", "Decoder activates the I/O device only during I/O cycles using the M/IO̅ signal."],
                ["Memory Space Impact", "I/O device occupies part of the memory space.", "Occupies I/O address space, leaving memory free for program/data."],
                ["Hardware Complexity", "Slightly more complex hardware because of additional address decoding.", "Simpler hardware design due to fewer address lines being decoded."]
            ],
            "extracted_by": "camelot",
            "confidence": 0.89
        }
    ],
    "entities": [
        { "text": "8086", "type": "TECH", "page_refs": [{ "page": 1, "block_id": "p1_b2" }], "confidence": 0.98 },
        { "text": "8255", "type": "HW", "page_refs": [{ "page": 1, "block_id": "p1_b2" }], "confidence": 0.98 },
        { "text": "PA", "type": "FIELD", "page_refs": [{ "page": 1, "block_id": "p1_b3" }], "confidence": 0.9 }
    ],
    "summary": {
        "auto_summary": "This assignment describes a control unit design using an Intel 8086 microprocessor with 8255 PPI to manage eight home appliances. It covers port configuration in Mode 0, I/O-mapped and memory-mapped interfacing, example assembly programs, and a comparison table between memory-mapped and I/O-mapped I/O.",
        "keywords": ["8086", "8255", "Mode 0", "I/O mapped I/O", "Memory mapped I/O", "Port A", "Port B", "Port C"]
    },
    "evaluation": {
        "run_id": "eval_2025_12_04_0630",
        "heading_f1": 0.97,
        "parent_child_f1": 0.95,
        "normalized_ted": 0.92,
        "semantic_sim_mean": 0.93,
        "notes": "Metrics computed against held-out annotated set (50 docs)."
    },
    "provenance": {
        "steps": [
            { "step": "pdf_extract", "tool": "pdfplumber_v0.8", "ts": "2025-12-04T06:28:00+05:30" },
            { "step": "ocr", "tool": "tesseract_5.3.0", "ts": "2025-12-04T06:29:10+05:30" },
            { "step": "layout_classification", "tool": "layoutlmv3_v1", "ts": "2025-12-04T06:29:35+05:30" },
            { "step": "hierarchy_builder", "tool": "custom_rules+gnn_v1", "ts": "2025-12-04T06:30:00+05:30" }
        ]
    }
}
