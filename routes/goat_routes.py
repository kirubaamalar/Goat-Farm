from flask import Blueprint, request, jsonify
from services.goat_service import add_goat, get_all_goats
from services.goat_service import update_goat
goat_bp = Blueprint("goat_bp", __name__)
from services.goat_service import delete_goat

@goat_bp.route("/api/goat/add", methods=["POST"])
def create_goat():
    data = request.form
    file = request.files.get("photo")

    result = add_goat(data, file)
    return jsonify(result)


@goat_bp.route("/api/goat/list", methods=["GET"])
def list_goats():
    data = get_all_goats()
    return jsonify(data)



@goat_bp.route("/api/goat/update/<int:goat_id>", methods=["PUT"])
def update_goat_api(goat_id):
    data = request.json
    result = update_goat(goat_id, data)
    return jsonify(result)



@goat_bp.route("/api/goat/delete/<int:goat_id>", methods=["DELETE"])
def delete_goat_api(goat_id):
    result = delete_goat(goat_id)
    return jsonify(result)