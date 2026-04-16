from flask import Flask
from config import Config
import os
from flask_cors import CORS   # ✅ ADD THIS

from routes.goat_routes import goat_bp
from routes.feeding_routes import feeding_bp
from routes.health_routes import health_bp
from routes.expense_routes import expense_bp
from routes.sales_routes import sales_bp
from routes.dashboard_routes import dashboard_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)

# ✅ ENABLE CORS (THIS FIXES YOUR ERROR)
CORS(app)

# Set upload folder
app.config["UPLOAD_FOLDER"] = Config.UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Register routes
app.register_blueprint(goat_bp)
app.register_blueprint(feeding_bp)
app.register_blueprint(health_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return {"message": "Goat Farm API Running"}

if __name__ == "__main__":
    app.run(debug=Config.DEBUG, port=Config.PORT)