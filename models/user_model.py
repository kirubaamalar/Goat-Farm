from database.db import get_db_connection

def insert_user(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO users
    (username, password, created_on, updated_on, is_active)
    VALUES (%s,%s,%s,%s,%s)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username=%s AND is_active=1",
        (username,)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user