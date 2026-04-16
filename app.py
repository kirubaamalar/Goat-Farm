import os
import sys
import threading
import time
import webbrowser
from pathlib import Path

from flask import Flask, send_from_directory
from flask_cors import CORS

from config import Config
from models.init_db import init_db

from routes.goat_routes import goat_bp
from routes.feeding_routes import feeding_bp
from routes.health_routes import health_bp
from routes.expense_routes import expense_bp
from routes.sales_routes import sales_bp
from routes.dashboard_routes import dashboard_bp
from routes.auth_routes import auth_bp

def get_base_dir():
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent


BASE_DIR = get_base_dir()
STATIC_DIR = BASE_DIR / "static"
FRONTEND_DIR = STATIC_DIR / "frontend"
FRONTEND_INDEX = FRONTEND_DIR / "index.html"
UPLOAD_DIR = STATIC_DIR / "uploads"

app = Flask(
    __name__,
    static_folder=str(STATIC_DIR),
    static_url_path="/static",
)

CORS(app)

app.config["UPLOAD_FOLDER"] = str(UPLOAD_DIR)
app.config["ENV"] = "production"

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Initialize database - create tables if not exist
init_db()

# Register routes
app.register_blueprint(goat_bp)
app.register_blueprint(feeding_bp)
app.register_blueprint(health_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)

@app.route("/favicon.svg")
def serve_favicon():
    favicon_path = FRONTEND_DIR / "favicon.svg"
    if favicon_path.exists():
        return send_from_directory(FRONTEND_DIR, "favicon.svg")
    return ("", 204)


@app.route("/assets/<path:filename>")
def serve_frontend_assets(filename):
    return send_from_directory(FRONTEND_DIR / "assets", filename)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path.startswith("api/"):
        return {"error": "API route not found"}, 404

    if path.startswith("static/"):
        relative_path = path.removeprefix("static/")
        static_file = STATIC_DIR / relative_path
        if static_file.exists() and static_file.is_file():
            return send_from_directory(static_file.parent, static_file.name)
        return {"error": "Static file not found"}, 404

    requested_file = FRONTEND_DIR / path
    if path and requested_file.exists() and requested_file.is_file():
        return send_from_directory(requested_file.parent, requested_file.name)

    if FRONTEND_INDEX.exists():
        return send_from_directory(FRONTEND_DIR, "index.html")

    return {
        "error": "Frontend build not found. Run the frontend build and copy it into static/frontend."
    }, 500


def open_browser():
    time.sleep(1.2)
    webbrowser.open(f"http://localhost:{Config.PORT}")

if __name__ == "__main__":
    if not os.environ.get("WERKZEUG_RUN_MAIN"):
        threading.Thread(target=open_browser, daemon=True).start()

    app.run(debug=False, host="127.0.0.1", port=Config.PORT)