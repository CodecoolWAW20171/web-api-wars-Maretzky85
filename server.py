from flask import Flask, render_template, request, redirect, session
import json

app = Flask(__name__)


@app.route("/")
def mainpage():
    return render_template("main.html")


@app.route('/registration')
def register_new_user():
    return json.dumps(render_template("registration.html"))


# @app.errorhandler(404)
# def page_not_found(e):
#     return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True)
