from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
access_token = None
uid = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/signin", methods=["POST"])
def signin():
    data = request.data
    data = json.loads(data)

    access_token = data['access_token']
    uid = data['uid']

    if access_token and uid:
        return jsonify({}), 200
    return jsonify({}), 400
    

if __name__ == "__main__":
    app.run()
