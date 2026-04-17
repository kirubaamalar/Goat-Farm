from database.db import get_db_connection

def insert_feeding(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO feeding
    (goat_id, food_type, quantity, feeding_date, notes, created_on, updated_on, is_active)
    VALUES (?,?,?,?,?,?,?,?)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_feeding():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM feeding WHERE is_active=1")
    rows = cursor.fetchall()
    data = [dict(row) for row in rows] if rows else []

    cursor.close()
    conn.close()

    return data

def update_feeding_by_id(feeding_id, values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE feeding 
    SET goat_id=?, food_type=?, quantity=?, feeding_date=?, notes=?, updated_on=?
    WHERE id=? AND is_active=1
    """

    cursor.execute(query, (*values, feeding_id))
    conn.commit()

    cursor.close()
    conn.close()

def delete_feeding_by_id(feeding_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "UPDATE feeding SET is_active=0 WHERE id=?"

    cursor.execute(query, (feeding_id,))
    conn.commit()

    cursor.close()
    conn.close()
