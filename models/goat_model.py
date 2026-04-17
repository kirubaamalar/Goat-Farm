from database.db import get_db_connection

def insert_goat(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO goats 
    (goat_code, name, breed, age, weight, gender, status, photo_url, created_on, updated_on, is_active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_all_goats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM goats WHERE is_active = 1")
    rows = cursor.fetchall()
    
    # Convert rows to dicts
    data = [dict(row) for row in rows] if rows else []

    cursor.close()
    conn.close()

    return data

def update_goat_by_id(goat_id, values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE goats 
    SET name=?, breed=?, age=?, weight=?, gender=?, status=?, updated_on=?
    WHERE id=? AND is_active=1
    """

    cursor.execute(query, (*values, goat_id))
    conn.commit()

    cursor.close()
    conn.close()

def delete_goat_by_id(goat_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "UPDATE goats SET is_active=0 WHERE id=?"

    cursor.execute(query, (goat_id,))
    conn.commit()

    cursor.close()
    conn.close()