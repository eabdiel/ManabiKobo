"""Core public-page blueprint."""
from pathlib import Path
from flask import Blueprint, abort, current_app, jsonify, redirect, render_template, request, send_from_directory, url_for
from app.data.kana_dojo import get_kana_dojo_content
from app.data.tracker import get_tracker_content
from app.data.phrases import get_phrase_deck
from app.data.study_tools import get_study_tool
from app.data.native_tools import get_native_tool
from app.services.page_service import get_legacy_filename, get_page, is_valid_language, navigation_pages

core_bp = Blueprint("core", __name__)

@core_bp.app_context_processor
def shared_context(): return {"pages": navigation_pages()}

@core_bp.get("/")
def root():
    return redirect(url_for("core.home", lang="es" if request.args.get("lang")=="es" else "en"))

@core_bp.get("/<lang>/")
def home(lang):
    if not is_valid_language(lang): abort(404)
    return render_template("home.html",lang=lang,current=get_page("home"))

@core_bp.get("/<lang>/<slug>/")
def tool_page(lang,slug):
    if not is_valid_language(lang): abort(404)
    page=get_page(slug)
    if not page or slug=="home": abort(404)
    template_name={"language-ide":"ide/workspace.html","kana-dojo":"kana_dojo.html","tracker":"tracker.html","phrases-1":"phrases.html","phrases-2":"phrases.html","tech-office-talk":"phrases.html","reading-aid":"study_tool.html","frequency-deck":"study_tool.html","kanji-hub":"native_tool.html","radicals":"native_tool.html","sentence-builder":"native_tool.html","audio-companion":"native_tool.html","furigana-games":"native_tool.html","reference-hub":"reference_hub.html"}.get(slug,"tool.html")
    context={"lang":lang,"current":page,"legacy_file":get_legacy_filename(page,lang)}
    if slug=="kana-dojo": context["kana"]=get_kana_dojo_content(lang)
    elif slug=="tracker": context["tracker"]=get_tracker_content(lang)
    elif slug in {"phrases-1","phrases-2","tech-office-talk"}: context["deck"]=get_phrase_deck(slug,lang)
    elif slug in {"reading-aid","frequency-deck"}: context["study"]=get_study_tool(slug,lang)
    elif slug in {"kanji-hub","radicals","sentence-builder","audio-companion","furigana-games"}: context["native"]=get_native_tool(slug,lang)
    return render_template(template_name,**context)

@core_bp.get("/legacy/<path:filename>")
def legacy(filename): return send_from_directory(Path(current_app.config["LEGACY_DIR"]),filename)
@core_bp.get("/service-worker.js")
def service_worker():
    response=send_from_directory(current_app.static_folder,"service-worker.js");response.headers["Cache-Control"]="no-cache";response.headers["Service-Worker-Allowed"]="/";return response
@core_bp.get("/health")
def health(): return jsonify(status="ok",pages=len(navigation_pages()),application="Manabi Kobo v1.0")
@core_bp.app_errorhandler(404)
def not_found(_error):
    language="es" if request.path.startswith("/es/") else "en"
    return render_template("404.html",lang=language,current=None),404
