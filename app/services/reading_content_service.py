"""Structured Tsundoku reading-content loader.

Content lives separately from application state so adding or updating a reading
never overwrites user layout/preferences/progress stored in the browser.
"""
from __future__ import annotations

import json
from pathlib import Path

READINGS_ROOT = Path(__file__).resolve().parents[1] / "content" / "readings"
MANIFEST_PATH = READINGS_ROOT / "readings-manifest.json"


def _load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def get_readings_catalog() -> dict:
    """Return the enabled manifest entries plus their structured story data."""
    manifest = _load_json(MANIFEST_PATH)
    stories: list[dict] = []
    for item in manifest.get("readings", []):
        if not item.get("enabled", False):
            continue
        story_path = (READINGS_ROOT / item["file"]).resolve()
        if READINGS_ROOT.resolve() not in story_path.parents:
            continue
        story = _load_json(story_path)
        if story.get("id") != item.get("id"):
            continue
        stories.append(story)
    return {
        "content_version": manifest.get("content_version", ""),
        "stories": stories,
    }
