"""Local project storage foundation."""

import json
from pathlib import Path

PROJECT_DIR = Path("projects")

def save_project(name, content):
    PROJECT_DIR.mkdir(exist_ok=True)
    path = PROJECT_DIR / f"{name}.mkpl"
    path.write_text(content, encoding="utf-8")
    return str(path)

def load_project(name):
    path = PROJECT_DIR / f"{name}.mkpl"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return ""
