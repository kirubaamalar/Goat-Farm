from flask import Blueprint, request, jsonify
from services.feeding_service import add_feeding, get_feeding ,update_feeding ,delete_feeding

feeding_bp = Blueprint("feeding_bp", __name__)

@feeding_bp.route("/api/feeding/add", methods=["POST"])
def add_feeding_api():
    data = request.json
    result = add_feeding(data)
    return jsonify(result)


@feeding_bp.route("/api/feeding/list", methods=["GET"])
def list_feeding():
    data = get_feeding()
    return jsonify(data)

@feeding_bp.route("/api/feeding/update/<int:feeding_id>", methods=["PUT"])
def update_feeding_api(feeding_id):
    data = request.json
    result = update_feeding(feeding_id, data)
    return jsonify(result)

@feeding_bp.route("/api/feeding/delete/<int:feeding_id>", methods=["DELETE"])
def delete_feeding_api(feeding_id):
    result = delete_feeding(feeding_id)
    return jsonify(result)