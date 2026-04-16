from database.db import get_db_connection

def insert_expense(values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO expense
    (expense_type, amount, date, notes, created_on, updated_on, is_active)
    VALUES (?,?,?,?,?,?,?)
    """

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()


def fetch_expense():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM expense WHERE is_active=1")
    rows = cursor.fetchall()
    data = [dict(row) for row in rows] if rows else []

    cursor.close()
    conn.close()

    return data


def update_expense_by_id(expense_id, values):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE expense 
    SET expense_type=?, amount=?, date=?, notes=?, updated_on=?
    WHERE id=? AND is_active=1
    """

    cursor.execute(query, (*values, expense_id))
    conn.commit()

    cursor.close()
    conn.close()


def delete_expense_by_id(expense_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE expense SET is_active=0 WHERE id=?", (expense_id,))
    conn.commit()

    cursor.close()
    conn.close()


# 🔥 Total Expense
def get_total_expense():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(amount) FROM expense WHERE is_active=1")
    result = cursor.fetchone()
    total = result[0] if result and result[0] else 0

    cursor.close()
    conn.close()

    return total