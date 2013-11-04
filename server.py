from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/pong")
def pong():
    return "/static/js/pong.js"

if __name__ == "__main__":
    app.run()

