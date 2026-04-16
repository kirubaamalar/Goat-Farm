from models.feeding_model import insert_feeding, fetch_feeding, update_feeding_by_id, delete_feeding_by_id
from datetime import datetime
from utils.logger import log_error

def add_feeding(data):
    try:
        now = datetime.now()

        values = (
            int(data.get("goat_id")),
            data.get("food_type"),
            float(data.get("quantity")),
            data.get("feeding_date"),
            data.get("notes"),
            now,
            now,
            True
        )

        insert_feeding(values)

        return {"message": "Feeding added successfully"}

    except Exception as e:
        log_error(str(e))
        return {"error": str(e)}


def get_feeding():
    try:
        return fetch_feeding()
    except Exception as e:
        log_error(str(e))
        return []

def update_feeding(feeding_id, data):
    try:
        from datetime import datetime

        values = (
            int(data.get("goat_id")),
            data.get("food_type"),
            float(data.get("quantity")),
            data.get("feeding_date"),
            data.get("notes"),
            datetime.now()
        )

        update_feeding_by_id(feeding_id, values)

        return {"message": "Feeding updated successfully"}

    except Exception as e:
        log_error(str(e))
        return {"error": str(e)}

def delete_feeding(feeding_id):
    try:
        delete_feeding_by_id(feeding_id)
        return {"message": "Feeding deleted successfully"}
    except Exception as e:
        log_error(str(e))
        return {"error": str(e)}