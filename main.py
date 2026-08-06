"""=============================================================================
Manabi Kōbō v1 — local and Google Cloud Run application entry point
=============================================================================
Purpose:
    Exposes the WSGI application as ``main:app`` for Gunicorn and provides a
    safe local development server that honors Cloud Run's PORT contract.
============================================================================="""

import os

from app import create_app

app = create_app()


if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "false").lower() in {"1", "true", "yes", "on"},
    )
