import connection_handler
from psycopg2.extensions import AsIs


@connection_handler.connection_handler
def get_user_data_from_db(cursor, username):
    cursor.execute(
        """
        SELECT * FROM users_table
        where user_name = %(username)s;
        """, {"username": username})
    data = cursor.fetchall()
    if len(data) > 0:
        return data[0]
    else:
        return False


@connection_handler.connection_handler
def check_if_username_exists_in_db(cursor, username):
    cursor.execute(
        """
        SELECT * FROM users_table
        where user_name = %(username)s;
        """, {"username": username})
    data = cursor.fetchall()
    if len(data) > 0:
        return True
    else:
        return False


@connection_handler.connection_handler
def add_new_user_to_db(cursor, username, password):
    cursor.execute(
        """
        INSERT INTO users_table
        (user_name, password)
        VALUES
        (%(username)s,%(password)s)
        """, {"username": username, "password": password})
    return True
