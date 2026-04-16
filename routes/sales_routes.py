from flask import Blueprint, request, jsonify
from services.sales_service import add_sales, get_sales

sales_bp = Blueprint("sales_bp", __name__)

@sales_bp.route("/api/sales/add", methods=["POST"])
def add_sales_api():
    return jsonify(add_sales(request.json))


@sales_bp.route("/api/sales/list", methods=["GET"])
def list_sales():
    return jsonify(get_sales())