from flask import Flask, render_template, request, jsonify
import redis



app = Flask(__name__)
r = redis.Redis(host='localhost', port=6379, db=0)

"""
TODO: TEMPORARY FIX FOR TASKS
"""
r.set(1, "/static/js/add.js")


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/pong")
def pong():
    return "/static/js/pong.js"

@app.route("/add_task")
def add_task():
    #TODO: Need to add task and create identifier for it
    pass

@app.route("/get_tasks")
def get_task():
    #TODO: Find a task to execute and return that js file
    ip = request.remote_addr
    r.set(ip, 1)
    task_info = {
        "task_id": 1,
        "script": r.get(1),
    }
    return jsonify(task_info)

@app.route("/tasks")
def get_all_tasks():
    #TODO: gets all the tasks in the queue right now
    pass

@app.route("/tasks/<task_id>")
def get_task_info(task_id):
    #TODO: return information about the task
    pass

@app.route("/data")
def get_data():
    #TODO: Get the specified chunk of data
    #Need to figure out the best way to get sub-data
    ip = request.remote_addr
    task_id = r.get(ip)
    test_data = {
        "task_id": task_id,
        "data": [2, 3],
    }
    print r.get((task_id, 1))
    print test_data
    return jsonify(test_data)

@app.route("/send_result")
def process_result():
    ip = request.remote_addr
    task_id = r.get(ip)
    #do something with results
    return "Results have been processed"

@app.route("/heart_beat")
def heart_beat():
    ip_addr = request.remote_addr


if __name__ == "__main__":
    app.run()

