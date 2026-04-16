from database.db import get_db_connection

def insert_user(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO users
    (username, password, created_on, updated_on, is_active)
    VALUES (?,?,?,?,?)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=? AND is_active=1",
        (username,)
    )
    row = cursor.fetchone()
    user = dict(row) if row else None

    cursor.close()
    conn.close()

    return user