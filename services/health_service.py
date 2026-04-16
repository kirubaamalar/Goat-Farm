from models.health_model import (
    insert_health,
    fetch_health,
    update_health_by_id,
    delete_health_by_id,
    fetch_vaccination_due
)
from datetime import datetime
from utils.logger import log_error

def add_health(data):
    try:
        now = datetime.now()

        values = (
            int(data.get("goat_id")),
            data.get("issue"),
            data.get("medicine"),
            data.get("vaccination_date"),
            data.get("next_due_date"),
            data.get("notes"),
            now,
            now,
            True
        )

        insert_health(values)

        return {"message": "Health record added"}

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


def get_health():
    try:
        return fetch_health()
    except Exception as e:
        log_error(str(e))
        return []


def update_health(health_id, data):
    try:
        values = (
            int(data.get("goat_id")),
            data.get("issue"),
            data.get("medicine"),
            data.get("vaccination_date"),
            data.get("next_due_date"),
            data.get("notes"),
            datetime.now()
        )

        update_health_by_id(health_id, values)

        return {"message": "Health updated"}

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


def delete_health(health_id):
    try:
        delete_health_by_id(health_id)
        return {"message": "Health deleted"}
    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


# 🔥 Vaccination Reminder
def get_vaccination_due():
    try:
        return fetch_vaccination_due()
    except Exception as e:
        log_error(str(e))
        return []