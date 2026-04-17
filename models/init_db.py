import sqlite3
from pathlib import Path
from config import Config

def create_database():
    """Create SQLite database file if it doesn't exist."""
    db_path = Config.DB_PATH
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    
    # sqlite3 automatically creates the database file
    conn = sqlite3.connect(db_path)
    conn.close()
    print(f"✅ Database created at: {db_path}")


def create_tables():
    """Create all necessary tables in SQLite."""
    conn = sqlite3.connect(Config.DB_PATH)
    cursor = conn.cursor()

    # 🐐 GOATS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS goats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goat_code TEXT UNIQUE,
        name TEXT,
        breed TEXT,
        age INTEGER,
        weight REAL,
        gender TEXT,
        status TEXT,
        photo_url TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active INTEGER DEFAULT 1
    )
    """)

    # 🌿 FEEDING
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feeding (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goat_id INTEGER,
        food_type TEXT,
        quantity REAL,
        feeding_date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active INTEGER DEFAULT 1
    )
    """)

    # 💉 HEALTH
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS health (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goat_id INTEGER,
        issue TEXT,
        medicine TEXT,
        vaccination_date DATE,
        next_due_date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active INTEGER DEFAULT 1
    )
    """)

    # 💰 EXPENSE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expense (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expense_type TEXT,
        amount REAL,
        date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active INTEGER DEFAULT 1
    )
    """)

    # 💵 SALES
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goat_id INTEGER,
        price REAL,
        buyer_name TEXT,
        date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active INTEGER DEFAULT 1
    )
    """)

    # 🔐 USERS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active INTEGER DEFAULT 1
    )
    """)

    conn.commit()
    cursor.close()
    conn.close()

    print("✅ All tables created successfully")

def init_db():
    """Initialize database - create if not exists and create all tables."""
    create_database()
    create_tables()

if __name__ == "__main__":
    init_db()