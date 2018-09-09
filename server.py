from flask import Flask, render_template, request, redirect, session
import werkzeug
import json
import data_manager

app = Flask(__name__)


@app.route("/")
def mainpage():
    return render_template("main.html")


@app.route('/registration_page')
def parse_register_form():
    return json.dumps(render_template("registration.html"))


@app.route('/login_page')
def parse_login_page():
    return json.dumps(render_template("login.html"))


def login(username):
    session['username'] = username
    return json.dumps('Logged as {}'.format(username))


@app.route('/login/<json_data>')
def check_login(json_data):
    userdata = json.loads(json_data)
    userdata_db = data_manager.get_user_data_from_db(userdata['login'])
    if userdata_db:
        if werkzeug.security.check_password_hash(userdata_db['password'], userdata['password']):
            return json.dumps(login(userdata_db['user_name']))
        else:
            return json.dumps('Error')
    else:
        return json.dumps('Error')


@app.route('/check_username/<username>')
def check_username_in_db(username):
    if data_manager.check_if_username_exists_in_db(username):
        return json.dumps('exists')
    return json.dumps('ok')


@app.route('/register_new_user/<json_object>')
def register_new_user_in_db(json_object):
    userdata = json.loads(json_object)
    username = userdata['userName']
    password = werkzeug.security.generate_password_hash(userdata['password'])
    data_manager.add_new_user_to_db(username, password)
    if (check_username_in_db(username) == json.dumps('exists')):
        return json.dumps('ok')
    else:
        return json.dumps('warning')


# @app.errorhandler(404)
# def page_not_found(e):
#     return render_template('404.html'), 404

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == '__main__':
    app.run(debug=True)
