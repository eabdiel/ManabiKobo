# Manabi Kōbō — How to Use Guides & Reference Hub Update
## 2026-08-08 Midday Baseline Increment

## Summary

This increment replaces the temporary **How to Use the Site** placeholder with a complete bilingual orientation and tutorial experience. The tutorial is split into a landing page plus dedicated **Desktop / Laptop** and **Mobile / Foldable** manuals so the same learning workflow can be explained appropriately for different screen sizes.

The update also revises the Reference Hub creator introduction to use the neutral title **Software and Reliability Engineer**, removes SAP-specific language from the personal introduction, changes the motivation wording to **“I needed a practical workspace”**, and clarifies that Manabi Kōbō is also the creator's personal Japanese study toolkit.

## Tutorial Experience

- SEO-friendly How to Use landing page in English and Spanish.
- Desktop / Laptop manual at `/<lang>/how-to-use/desktop/`.
- Mobile / Foldable manual at `/<lang>/how-to-use/mobile/`.
- Device-specific navigation and layout guidance.
- Guidance for every current learning/application area:
  - 90-Day Tracker
  - Reading Aid
  - Frequency Deck
  - Kana Dojo
  - Memory and Internal Monologue Phrases
  - Tsundoku Reading Nook
  - Kanji Hub
  - Kanji Radicals
  - Sentence Builder
  - Tech & Office Talk
  - Language IDE
  - Audio Course Companion
  - Furigana Games
  - Reference Hub
- Each tool documents:
  - how it aims to help;
  - how to use it;
  - how it can supplement an existing Japanese course or study routine.
- Suggested 20-minute learning workflow.
- Actual desktop and Galaxy Z Fold / Android screenshots supplied from the current site are embedded as contextual guide images.
- Added per-page meta descriptions for tutorial SEO while retaining a site-wide default description.

## Reference Hub Changes

- Creator description changed from SAP-specific wording to **Software and Reliability Engineer**.
- Removed “As a software and SAP professional...” from the project motivation.
- Changed “I wanted a practical workspace” to **“I needed a practical workspace.”**
- Added context that Manabi Kōbō is also the creator's personal Japanese study toolkit.
- Updated older learning-path references from the retired Essential Phrases / Natural Conversation labels to **Memory & Internal Monologue Phrases**.

## Files Modified

- `app/routes/core.py`
- `app/templates/base.html`
- `app/templates/how_to_use.html`
- `app/templates/reference_hub.html`
- `tests/test_app.py`

## Files Added

- `app/templates/how_to_guide.html`
- `app/static/css/how-to-use.css`
- `app/static/assets/tutorial/desktop-home.png`
- `app/static/assets/tutorial/desktop-ide.png`
- `app/static/assets/tutorial/desktop-tsundoku.png`
- `app/static/assets/tutorial/desktop-memory.png`
- `app/static/assets/tutorial/mobile-home.jpg`
- `app/static/assets/tutorial/mobile-ide.jpg`
- `app/static/assets/tutorial/mobile-tsundoku.jpg`
- `app/static/assets/tutorial/mobile-memory.jpg`
- `RELEASE_NOTES_HOW_TO_USE_GUIDES_2026-08-08.md`

## Validation

- Python source compilation completed successfully with `python -m compileall -q app main.py`.
- Jinja syntax parsing completed successfully for the new/modified templates.
- Tutorial screenshot assets were verified in the final package.
- Full pytest execution could not be completed in the artifact sandbox because Flask is not installed in that runtime. The existing GitHub CI pipeline installs `requirements-dev.txt` and will execute the added route/content tests on Python 3.11, 3.12, and 3.13 after push.
