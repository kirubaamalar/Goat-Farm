import os
import sys
import threading
import time
import webbrowser
from pathlib import Path
import logging

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

# ============================================================================
# DETERMINE APPLICATION PATHS EARLY
# ============================================================================
# Check if running as PyInstaller EXE or normal Python script
IS_FROZEN = getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS")

# ============================================================================
# SETUP LOGGING (Simple console + file for debugging)
# ============================================================================
log_file = os.path.abspath('goat_farm_debug.log')

# Configure logging with console and file output
log_handler = logging.FileHandler(log_file, mode='w')
log_handler.setLevel(logging.DEBUG)
log_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
log_handler.setFormatter(log_formatter)

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(log_handler)
logger.addHandler(logging.StreamHandler())  # Also print to console

print(f"✓ Logging configured. Debug log: {log_file}")
logger.info(f"Application starting...")

if IS_FROZEN:
    # Running as PyInstaller EXE - use temporary extraction directory
    BASE_DIR = Path(sys._MEIPASS)
    logger.info(f"Running as PyInstaller EXE. BASE_DIR: {BASE_DIR}")
else:
    # Running as normal Python script
    BASE_DIR = Path(__file__).resolve().parent
    logger.info(f"Running as Python script. BASE_DIR: {BASE_DIR}")

STATIC_DIR = BASE_DIR / "static"
FRONTEND_DIR = STATIC_DIR / "frontend"
FRONTEND_INDEX = FRONTEND_DIR / "index.html"
UPLOAD_DIR = STATIC_DIR / "uploads"

# ============================================================================
# DEBUG OUTPUT - VERIFY PATHS EXIST
# ============================================================================
logger.info(f"STATIC_DIR: {STATIC_DIR}")
logger.info(f"STATIC_DIR exists: {STATIC_DIR.exists()}")
logger.info(f"FRONTEND_DIR: {FRONTEND_DIR}")
logger.info(f"FRONTEND_DIR exists: {FRONTEND_DIR.exists()}")
logger.info(f"FRONTEND_INDEX: {FRONTEND_INDEX}")
logger.info(f"FRONTEND_INDEX exists: {FRONTEND_INDEX.exists()}")

if FRONTEND_DIR.exists():
    frontend_files = list(FRONTEND_DIR.glob("*"))
    logger.info(f"Files in {FRONTEND_DIR}: {[f.name for f in frontend_files]}")

# ============================================================================
# INITIALIZE FLASK APP
# ============================================================================
app = Flask(
    __name__,
    static_folder=str(STATIC_DIR),
    static_url_path="/static",
)

CORS(app)

app.config["UPLOAD_FOLDER"] = str(UPLOAD_DIR)
app.config["ENV"] = "production"

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

logger.info(f"Flask app initialized. Upload folder: {app.config['UPLOAD_FOLDER']}")

# Initialize database - create tables if not exist
init_db()
logger.info("Database initialized")

# Register routes
app.register_blueprint(goat_bp)
app.register_blueprint(feeding_bp)
app.register_blueprint(health_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)
logger.info("All blueprints registered")

# ============================================================================
# ROUTE HANDLERS - SPA (Single Page Application) SERVING
# ============================================================================

@app.route("/favicon.svg")
def serve_favicon():
    """Serve favicon"""
    try:
        favicon_path = FRONTEND_DIR / "favicon.svg"
        if favicon_path.exists():
            logger.debug(f"Serving favicon from {favicon_path}")
            return send_from_directory(FRONTEND_DIR, "favicon.svg")
        logger.warning(f"favicon.svg not found at {favicon_path}")
        return ("", 204)  # No content
    except Exception as e:
        logger.error(f"Error serving favicon: {e}")
        return ("", 500)


@app.route("/assets/<path:filename>")
def serve_frontend_assets(filename):
    """Serve React assets (JS, CSS, images from /assets folder)"""
    try:
        assets_path = FRONTEND_DIR / "assets" / filename
        if assets_path.exists():
            logger.debug(f"Serving asset: {filename}")
            return send_from_directory(FRONTEND_DIR / "assets", filename)
        logger.warning(f"Asset not found: {assets_path}")
        return ("Asset not found", 404)
    except Exception as e:
        logger.error(f"Error serving asset {filename}: {e}")
        return ("", 500)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    """
    SPA Catch-all route:
    - API routes (/api/*) that don't match registered routes return 404
    - All other routes return index.html (React Router handles client-side routing)
    """
    try:
        # Skip API routes (Flask will handle them via blueprints)
        if path.startswith("api/"):
            logger.debug(f"API route not found: /{path}")
            return {"error": "API route not found"}, 404

        # Try to serve static files if they exist (e.g., /sitemap.xml, /robots.txt)
        if path != "":
            full_path = FRONTEND_DIR / path
            if full_path.exists() and full_path.is_file():
                logger.debug(f"Serving file: {path}")
                return send_from_directory(FRONTEND_DIR, path)

        # For all other routes, serve React's index.html
        # React Router will handle client-side navigation
        if not FRONTEND_INDEX.exists():
            logger.error(f"CRITICAL: index.html not found at {FRONTEND_INDEX}")
            return f"React app not found. index.html missing at {FRONTEND_INDEX}", 500

        logger.debug(f"Serving React app for path: /{path if path else 'root'}")
        return send_from_directory(FRONTEND_DIR, "index.html")

    except Exception as e:
        logger.error(f"Error serving React app for path '{path}': {e}", exc_info=True)
        return f"Server error: {str(e)}", 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors - serve React app for non-API routes"""
    return serve_react_app("")


# ============================================================================
# BROWSER LAUNCH
# ============================================================================
def open_browser():
    """Open browser after a delay"""
    time.sleep(1.2)
    url = f"http://localhost:{Config.PORT}"
    logger.info(f"Opening browser at {url}")
    try:
        webbrowser.open(url)
    except Exception as e:
        logger.error(f"Failed to open browser: {e}")
        logger.info(f"Open {url} manually in your browser")

if __name__ == "__main__":
    logger.info("="*80)
    logger.info("STARTING GOAT FARM APPLICATION")
    logger.info("="*80)
    logger.info(f"Running in: {'PyInstaller EXE' if IS_FROZEN else 'Python script'} mode")
    logger.info(f"Base directory: {BASE_DIR}")
    logger.info(f"Frontend directory: {FRONTEND_DIR}")
    logger.info(f"Server: http://127.0.0.1:{Config.PORT}")
    logger.info("="*80)

    # Only open browser on the main process (not on Werkzeug reloader)
    if not os.environ.get("WERKZEUG_RUN_MAIN"):
        threading.Thread(target=open_browser, daemon=True).start()

    # Run Flask app
    try:
        app.run(debug=False, host="127.0.0.1", port=Config.PORT)
    except Exception as e:
        logger.error(f"Error running Flask app: {e}", exc_info=True)
        raise