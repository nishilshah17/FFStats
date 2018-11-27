from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
access_token, uid = None, None

@app.route("/")
def index():
    '''
    Render index page
    '''
    return render_template("index.html")

@app.route("/home")
def home():
    '''
    Render FFStats home page after user sign in
    '''
    global access_token, uid
    return render_template("home.html", access_token=access_token, uid=uid)

@app.route("/home/league/<league_id>")
def league(league_id):
    '''
    Render league home page
    '''
    global access_token, uid
    return render_template("league.html", access_token=access_token, uid=uid, league_id=league_id)

@app.route("/signin", methods=["POST"])
def signin():
    '''
    Handle google sign in with Firebase Authentication
    '''
    data = request.data
    data = json.loads(data)

    global access_token, uid
    access_token = data['access_token']
    uid = data['uid']

    if access_token:
        return jsonify({}), 200
    return jsonify({}), 400


if __name__ == "__main__":
    app.run()
