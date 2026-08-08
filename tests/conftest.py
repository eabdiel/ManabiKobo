"""Shared pytest fixtures for Manabi Kōbō.

Keeping the Flask application/client fixtures here prevents individual tests from
quietly depending on an undeclared fixture and gives future feature tests one
consistent way to exercise routes and static assets in CI.
"""
from pathlib import Path
import sys

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app import create_app  # noqa: E402


@pytest.fixture()
def app():
    application = create_app()
    application.config.update(TESTING=True)
    return application


@pytest.fixture()
def client(app):
    return app.test_client()
