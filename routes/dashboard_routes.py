from flask import Blueprint, jsonify
from services.dashboard_service import get_dashboard

dashboard_bp = Blueprint("dashboard_bp", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
def dashboard():
    return jsonify(get_dashboard())