from database.db import get_db_connection

def insert_sales(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO sales
    (goat_id, price, buyer_name, date, notes, created_on, updated_on, is_active)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_sales():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM sales WHERE is_active=1")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


def get_total_sales():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(price) FROM sales WHERE is_active=1")
    total = cursor.fetchone()[0] or 0

    cursor.close()
    conn.close()

    return total