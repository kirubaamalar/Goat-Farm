import mysql.connector
from config import Config

def create_database():
    conn = mysql.connector.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD
    )
    cursor = conn.cursor()

    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DB_NAME}")
    print("DB created")

    cursor.close()
    conn.close()


def create_tables():
    conn = mysql.connector.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME
    )
    cursor = conn.cursor()

    # 🐐 GOATS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS goats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        goat_code VARCHAR(20) UNIQUE,
        name VARCHAR(100),
        breed VARCHAR(100),
        age INT,
        weight FLOAT,
        gender VARCHAR(10),
        status VARCHAR(20),
        photo_url TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )
    """)

    # 🌿 FEEDING
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feeding (
        id INT AUTO_INCREMENT PRIMARY KEY,
        goat_id INT,
        food_type VARCHAR(100),
        quantity FLOAT,
        feeding_date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )
    """)

    # 💉 HEALTH
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS health (
        id INT AUTO_INCREMENT PRIMARY KEY,
        goat_id INT,
        issue VARCHAR(255),
        medicine VARCHAR(255),
        vaccination_date DATE,
        next_due_date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )
    """)

    # 💰 EXPENSE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expense (
        id INT AUTO_INCREMENT PRIMARY KEY,
        expense_type VARCHAR(50),
        amount FLOAT,
        date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )
    """)

    # 💵 SALES
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        goat_id INT,
        price FLOAT,
        buyer_name VARCHAR(100),
        date DATE,
        notes TEXT,
        created_on DATETIME,
        updated_on DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )
    """)

    # 🔐 USERS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50),
        created_on DATETIME,
        updated_on DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )
    """)

    conn.commit()
    cursor.close()
    conn.close()

    print("✅ All tables created successfully")

if __name__ == "__main__":
    create_database()
    create_tables()