import os

class Config:
    # Database
    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = "root"
    DB_NAME = "goat_farm_db"

    # App
    PORT = 5000
    DEBUG = True

    # Upload folder
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")