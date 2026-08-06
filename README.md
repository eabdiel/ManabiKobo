# Manabi Kōbō v1.0

**Professional Japanese learning for developers, engineers, and technology professionals.**

Manabi Kōbō is a bilingual English–Japanese and Spanish–Japanese Flask learning hub. It combines foundational language tools with a professional visual system designed for office and technical-learning use.

## v1.0 scope

- Unified Manabi Kōbō branding and professional color system
- English and Spanish routes
- Kana Dojo, Kanji tools, study plan, tracker, phrase decks, reading aid, sentence builder, audio companion, and furigana game resources
- Tech & Office Talk with professional workplace and software-delivery phrases
- Shared draggable, two-dimensionally resizable, minimizable tile framework
- Browser-local layout persistence across supported workbench pages
- Scrollable tile bodies when resized below their content height
- Responsive desktop and mobile application shell

## Quick start

Requirements: Python 3.11 or newer.

```bash
git clone <your-repository-url>
cd manabi-kobo
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

Install and run:

```bash
pip install -r requirements.txt
python main.py
```

Open `http://127.0.0.1:5000/en/` or `http://127.0.0.1:5000/es/`.

## Project structure

```text
app/
  data/                 Bilingual content and navigation registries
  routes/               Flask blueprints
  services/             Shared page and report services
  static/
    assets/              Branding and page media
    css/                 Shared design and workbench styles
    js/                  Shared browser behavior
    legacy/              Preserved source content used by migrated tools
  templates/             Shared Flask templates
.github/workflows/       GitHub Actions validation
content/                 Future data-driven learning content
main.py                  Local and WSGI application entry point
tests/                   Flask smoke tests
```

## Shared design and tile architecture

The site intentionally uses one centrally managed visual and interaction system. Make global changes here rather than implementing page-specific copies:

```text
app/static/css/design-tokens.css
app/static/css/workbench.css
app/static/css/app.css
app/static/js/workbench-core.js
```

This contract keeps tile dragging, resizing, minimization, ordering, and persistence consistent across the application.

## Configuration

Copy `.env.example` values into your local environment or hosting configuration as needed:

- `MK_AI_COMPANION_ENABLED`
- `MK_AI_COMPANION_BOT_ID`
- `PORT`

The application does not automatically load `.env`; set variables through PyCharm, your shell, GitHub, or the hosting platform.

## Tests

```bash
pip install -r requirements-dev.txt
python -m compileall -q app main.py
pytest -q
```

GitHub Actions runs the same validation on Python 3.11, 3.12, and 3.13 for pushes to `main` and pull requests.

## Google Cloud Run deployment

The repository is ready for container-based or source-based Cloud Run deployment. It includes:

```text
Dockerfile                         Production Python 3.12 image
gunicorn.conf.py                  PORT-aware threaded WSGI configuration
deployment/cloud-run/deploy.ps1   Windows/PowerShell deployment helper
deployment/cloud-run/deploy.sh    macOS/Linux deployment helper
/health                           Lightweight readiness endpoint
```

Cloud Run requires the ingress container to listen on `0.0.0.0` using the injected `PORT` value. The production image and local entry point both follow that contract.

Deploy from the repository root with PowerShell:

```powershell
.\deployment\cloud-run\deploy.ps1 -ProjectId "YOUR_PROJECT_ID" -Region "us-east1"
```

Or with Bash:

```bash
export PROJECT_ID="YOUR_PROJECT_ID"
./deployment/cloud-run/deploy.sh
```

You can also deploy directly:

```bash
gcloud run deploy manabi-kobo --source . --region us-east1 --allow-unauthenticated
```

After deployment, validate `/health`, `/en/`, `/es/`, and `/service-worker.js` on the generated service URL before configuring the custom domain. Runtime variables should be configured in Cloud Run rather than committed to Git.

## Repository hygiene

Do not commit virtual environments, IDE metadata, cache files, `.env` files, generated archives, logs, or credentials. The included `.gitignore`, `.gcloudignore`, and `.dockerignore` cover the expected local artifacts.

See `CONTRIBUTING.md`, `SECURITY.md`, and `RELEASE.md` for development standards, security reporting, and release history.

## License

Copyright © 2026 Edwin A. Rodriguez / ProgreTech. All rights reserved. See `LICENSE`.
