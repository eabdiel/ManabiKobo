"""MK-LPL parser foundation.

Phase 1 goal:
- recognize project metadata
- identify imports
- prepare syntax tree foundation
"""

def parse_project(source_text):
    lines = source_text.splitlines()
    return {
        "project": "unknown",
        "imports": [],
        "lines": len(lines),
        "source": source_text
    }
