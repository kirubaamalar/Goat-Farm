import sqlite3
from pathlib import Path
from config import Config

def get_db_connection():
    try:
        # Get database path from config
        db_path = Config.DB_PATH
        
        # Create parent directory if not exists
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Enable row factory to return dicts
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        
        return conn
    except Exception as e:
        print("DB Connection Error:", e)
        return None