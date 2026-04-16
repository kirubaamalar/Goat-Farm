from flask import Blueprint, request, jsonify
from services.expense_service import add_expense, get_expense, update_expense, delete_expense

expense_bp = Blueprint("expense_bp", __name__)

@expense_bp.route("/api/expense/add", methods=["POST"])
def add_expense_api():
    return jsonify(add_expense(request.json))


@expense_bp.route("/api/expense/list", methods=["GET"])
def list_expense():
    return jsonify(get_expense())


@expense_bp.route("/api/expense/update/<int:expense_id>", methods=["PUT"])
def update_expense_api(expense_id):
    return jsonify(update_expense(expense_id, request.json))


@expense_bp.route("/api/expense/delete/<int:expense_id>", methods=["DELETE"])
def delete_expense_api(expense_id):
    return jsonify(delete_expense(expense_id))