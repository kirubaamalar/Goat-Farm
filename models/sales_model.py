from database.db import get_db_connection

def insert_sales(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO sales
    (goat_id, price, buyer_name, date, notes, created_on, updated_on, is_active)
    VALUES (?,?,?,?,?,?,?,?)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_sales():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sales WHERE is_active=1")
    rows = cursor.fetchall()
    data = [dict(row) for row in rows] if rows else []

    cursor.close()
    conn.close()

    return data


def get_total_sales():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(price) FROM sales WHERE is_active=1")
    result = cursor.fetchone()
    total = result[0] if result and result[0] else 0

    cursor.close()
    conn.close()

    return total