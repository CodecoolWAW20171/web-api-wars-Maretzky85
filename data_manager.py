import connection_handler
from psycopg2.extensions import AsIs


@connection_handler.connection_handler
def check_if_username_exists_in_db(cursor, username):
    cursor.execute(
        """
        SELECT * FROM users_table
        where user_name = %(username)s;
        """, {"username": username})
    data = cursor.fetchall()
    return data


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
