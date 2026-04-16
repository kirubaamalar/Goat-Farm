from models.expense_model import (
    insert_expense, fetch_expense,
    update_expense_by_id, delete_expense_by_id,
    get_total_expense
)
from datetime import datetime
from utils.logger import log_error

def add_expense(data):
    try:
        now = datetime.now()

        values = (
            data.get("expense_type"),
            float(data.get("amount")),
            data.get("date"),
            data.get("notes"),
            now,
            now,
            True
        )

        insert_expense(values)

        return {"message": "Expense added"}

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


def get_expense():
    try:
        return fetch_expense()
    except Exception as e:
        log_error(str(e))
        return []


def update_expense(expense_id, data):
    try:
        values = (
            data.get("expense_type"),
            float(data.get("amount")),
            data.get("date"),
            data.get("notes"),
            datetime.now()
        )

        update_expense_by_id(expense_id, values)

        return {"message": "Expense updated"}

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


def delete_expense(expense_id):
    try:
        delete_expense_by_id(expense_id)
        return {"message": "Expense deleted"}
    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}