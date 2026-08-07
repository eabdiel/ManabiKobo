from flask import Blueprint, jsonify, request
from app.data.ide_projects import PROJECTS
from app.services.mkpl_engine import compile_source
ide_api_bp=Blueprint("ide_api",__name__,url_prefix="/api/ide")
@ide_api_bp.get("/projects")
def projects(): return jsonify([{"id":k,"name":v["name"],"title_en":v["title_en"],"title_es":v["title_es"],"files":list(v["files"])} for k,v in PROJECTS.items()])
@ide_api_bp.get("/projects/<project_id>")
def project(project_id):
    item=PROJECTS.get(project_id)
    return (jsonify(item),200) if item else (jsonify({"error":"Project not found"}),404)
@ide_api_bp.post("/compile")
def compile_project():
    payload=request.get_json(silent=True) or {}
    return jsonify(compile_source(str(payload.get("source",""))))
