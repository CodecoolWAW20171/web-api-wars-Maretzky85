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

@app.route('/login')
def check_login():
    return

@app.route('/check_username/<username>')
def check_username_in_db(username):
    if len(data_manager.check_if_username_exists_in_db(username)) > 0:
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


if __name__ == '__main__':
    app.run(debug=True)
