"""Manabi Kōbō application factory."""

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from app.config import Config
from app.routes.core import core_bp
from app.routes.reports import reports_bp


def create_app(config_object: type[Config] = Config) -> Flask:
    """Create and configure the public Manabi Kōbō Flask application."""
    application = Flask(__name__)
    application.wsgi_app = ProxyFix(
        application.wsgi_app,
        x_for=1,
        x_proto=1,
        x_host=1,
    )
    application.config.from_object(config_object)
    application.register_blueprint(core_bp)
    application.register_blueprint(reports_bp)

    @application.context_processor
    def shared_runtime_settings() -> dict[str, object]:
        return {
            "ai_companion_enabled": application.config.get(
                "AI_COMPANION_ENABLED", False
            ),
            "ai_companion_bot_id": application.config.get(
                "AI_COMPANION_BOT_ID", ""
            ),
        }

    return application
