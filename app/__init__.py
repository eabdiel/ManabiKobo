"""Manabi Kobo application factory."""
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from app.routes.core import core_bp
from app.routes.reports import reports_bp
from app.routes.ide_api import ide_api_bp
from app.config import Config
def create_app(config_object: type[Config] = Config) -> Flask:
    application=Flask(__name__)
    application.wsgi_app=ProxyFix(application.wsgi_app,x_for=1,x_proto=1,x_host=1)
    application.config.from_object(config_object)
    application.register_blueprint(core_bp); application.register_blueprint(reports_bp); application.register_blueprint(ide_api_bp)
    @application.context_processor
    def shared_runtime_settings():
        return {"ai_companion_enabled":application.config.get("AI_COMPANION_ENABLED",False),"ai_companion_bot_id":application.config.get("AI_COMPANION_BOT_ID","")}
    return application
