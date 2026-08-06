from flask import Blueprint, render_template

ide_bp = Blueprint("ide", __name__, url_prefix="/ide")

@ide_bp.route("/")
def workspace():
    return render_template("ide/workspace.html")
