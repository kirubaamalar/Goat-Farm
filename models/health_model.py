from database.db import get_db_connection

def insert_health(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO health
    (goat_id, issue, medicine, vaccination_date, next_due_date, notes, created_on, updated_on, is_active)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_health():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM health WHERE is_active=1")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


def update_health_by_id(health_id, values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE health 
    SET goat_id=%s, issue=%s, medicine=%s, vaccination_date=%s, next_due_date=%s, notes=%s, updated_on=%s
    WHERE id=%s AND is_active=1
    """

    cursor.execute(query, (*values, health_id))
    conn.commit()

    cursor.close()
    conn.close()


def delete_health_by_id(health_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE health SET is_active=0 WHERE id=%s", (health_id,))
    conn.commit()

    cursor.close()
    conn.close()


# 🔥 IMPORTANT: Vaccination Due
def fetch_vaccination_due():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM health
        WHERE next_due_date <= CURDATE() AND is_active=1
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data