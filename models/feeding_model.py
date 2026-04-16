from database.db import get_db_connection

def insert_feeding(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO feeding
    (goat_id, food_type, quantity, feeding_date, notes, created_on, updated_on, is_active)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_feeding():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM feeding WHERE is_active=1")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

def update_feeding_by_id(feeding_id, values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE feeding 
    SET goat_id=%s, food_type=%s, quantity=%s, feeding_date=%s, notes=%s, updated_on=%s
    WHERE id=%s AND is_active=1
    """

    cursor.execute(query, (*values, feeding_id))
    conn.commit()

    cursor.close()
    conn.close()

def delete_feeding_by_id(feeding_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "UPDATE feeding SET is_active=0 WHERE id=%s"

    cursor.execute(query, (feeding_id,))
    conn.commit()

    cursor.close()
    conn.close()
