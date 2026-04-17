import os
from pathlib import Path

class Config:
    # Database - SQLite
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(BASE_DIR, "goatfarm.db")

    # App
    PORT = 5000
    DEBUG = True

    # Upload folder
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")