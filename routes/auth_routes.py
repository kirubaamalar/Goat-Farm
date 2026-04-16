from flask import Blueprint, request, jsonify
from services.user_service import create_user, login_user

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/api/user/create", methods=["POST"])
def create_user_api():
    return jsonify(create_user(request.json))


@auth_bp.route("/api/login", methods=["POST"])
def login_api():
    return jsonify(login_user(request.json))