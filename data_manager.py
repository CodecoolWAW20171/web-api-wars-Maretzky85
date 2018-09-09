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
    if data:
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
    if data:
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


@connection_handler.connection_handler
def check_voted(cursor, planet_id, user_id):
    cursor.execute(
        """
        SELECT * FROM planet_votes
        WHERE planet_id = %(planet_id)s
        AND user_id = %(user_id)s
        """, {'planet_id': planet_id, 'user_id': user_id}
    )
    data = cursor.fetchall()
    if data:
        return data[0]['submission_time']
    else:
        return False


@connection_handler.connection_handler
def add_vote(cursor, planet_id, planet_name, user_id):
    cursor.execute(
        """
        INSERT INTO planet_votes
        (planet_id, planet_name, user_id)
        VALUES (%(planet_id)s, %(planet_name)s, %(user_id)s)
        """, {"planet_id": planet_id, "planet_name": planet_name, "user_id": user_id}
    )