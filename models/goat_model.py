from database.db import get_db_connection

def insert_goat(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO goats 
    (goat_code, name, breed, age, weight, gender, status, photo_url, created_on, updated_on, is_active)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_all_goats():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM goats WHERE is_active = 1")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

def update_goat_by_id(goat_id, values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE goats 
    SET name=%s, breed=%s, age=%s, weight=%s, gender=%s, status=%s, updated_on=%s
    WHERE id=%s AND is_active=1
    """

    cursor.execute(query, (*values, goat_id))
    conn.commit()

    cursor.close()
    conn.close()

def delete_goat_by_id(goat_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "UPDATE goats SET is_active=0 WHERE id=%s"

    cursor.execute(query, (goat_id,))
    conn.commit()

    cursor.close()
    conn.close()