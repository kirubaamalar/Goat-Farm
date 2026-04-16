from flask import Blueprint, request, jsonify
from services.health_service import (
    add_health,
    get_health,
    update_health,
    delete_health,
    get_vaccination_due
)

health_bp = Blueprint("health_bp", __name__)

@health_bp.route("/api/health/add", methods=["POST"])
def add_health_api():
    data = request.json
    return jsonify(add_health(data))


@health_bp.route("/api/health/list", methods=["GET"])
def list_health():
    return jsonify(get_health())


@health_bp.route("/api/health/update/<int:health_id>", methods=["PUT"])
def update_health_api(health_id):
    return jsonify(update_health(health_id, request.json))


@health_bp.route("/api/health/delete/<int:health_id>", methods=["DELETE"])
def delete_health_api(health_id):
    return jsonify(delete_health(health_id))


# 🔥 IMPORTANT API
@health_bp.route("/api/health/vaccination-due", methods=["GET"])
def vaccination_due():
    return jsonify(get_vaccination_due())