from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
access_token, uid = None, None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    global access_token, uid
    return render_template("home.html", access_token=access_token, uid=uid)

@app.route("/signin", methods=["POST"])
def signin():
    data = request.data
    data = json.loads(data)

    global access_token
    access_token = data['access_token']

    if access_token:
        return jsonify({}), 200
    return jsonify({}), 400


if __name__ == "__main__":
    app.run()
