from models.sales_model import insert_sales, fetch_sales, get_total_sales
from datetime import datetime
from utils.logger import log_error

def add_sales(data):
    try:
        now = datetime.now()

        values = (
            int(data.get("goat_id")),
            float(data.get("price")),
            data.get("buyer_name"),
            data.get("date"),
            data.get("notes"),
            now,
            now,
            True
        )

        insert_sales(values)

        return {"message": "Sale recorded"}

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


def get_sales():
    try:
        return fetch_sales()
    except Exception as e:
        log_error(str(e))
        return []