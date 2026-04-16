from models.user_model import insert_user, get_user_by_username
from datetime import datetime
from utils.logger import log_error

def create_user(data):
    try:
        now = datetime.now()

        values = (
            data.get("username"),
            data.get("password"),
            now,
            now,
            True
        )

        insert_user(values)

        return {"message": "User created"}

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}


def login_user(data):
    try:
        username = data.get("username")
        password = data.get("password")

        user = get_user_by_username(username)

        if not user:
            return {"error": "User not found"}

        if user["password"] != password:
            return {"error": "Invalid password"}

        return {
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "username": user["username"]
            }
        }

    except Exception as e:
        log_error(str(e))
        return {"error": "Something went wrong"}