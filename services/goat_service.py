from models.goat_model import insert_goat, fetch_all_goats
from utils.logger import log_info, log_error
from datetime import datetime
from config import Config
import os
from models.goat_model import update_goat_by_id
from models.goat_model import delete_goat_by_id

def generate_goat_code():
    data = fetch_all_goats()
    return f"G{str(len(data) + 1).zfill(3)}"


def add_goat(data, file):
    try:
        goat_code = generate_goat_code()

        # Image handling
        photo_path = None
        if file:
            filename = f"{goat_code}_{file.filename.replace(' ', '_')}"
            upload_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            file.save(upload_path)
            photo_path = f"/uploads/{filename}"

        now = datetime.now()

        values = (
            goat_code,
            data.get("name"),
            data.get("breed"),
            int(data.get("age")),
            float(data.get("weight")),
            data.get("gender"),
            data.get("status"),
            photo_path,
            now,
            now,
            True
        )

        insert_goat(values)

        log_info(f"Goat {goat_code} added")

        return {"message": "Goat added successfully", "goat_code": goat_code}

    except Exception as e:
        log_error(str(e))
        return {"error": str(e)}


def get_all_goats():
    try:
        return fetch_all_goats()
    except Exception as e:
        log_error(str(e))
        return []



def update_goat(goat_id, data):
    try:
        from datetime import datetime

        values = (
            data.get("name"),
            data.get("breed"),
            int(data.get("age")),
            float(data.get("weight")),
            data.get("gender"),
            data.get("status"),
            datetime.now()
        )

        update_goat_by_id(goat_id, values)

        return {"message": "Goat updated successfully"}

    except Exception as e:
        log_error(str(e))
        return {"error": str(e)}



def delete_goat(goat_id):
    try:
        delete_goat_by_id(goat_id)
        return {"message": "Goat deleted successfully"}
    except Exception as e:
        log_error(str(e))
        return {"error": str(e)}