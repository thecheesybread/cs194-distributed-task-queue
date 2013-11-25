from flask import Flask, render_template, jsonify
from flask import request
import redis
import array
import json


"""
FLASK SETTINGS
"""
app = Flask(__name__)
app.config.from_object(__name__)
app.config['DEBUG'] = True

"""
REDIS SETTINGS"
"""

r = redis.Redis(host='localhost', port=6379, db=0)
r.set(1, "/static/js/add.js")
# use as queue
# use to store current clients and extra information (wsgi is multithreaded and is not guaranteed to store state across different threads, so we use redis to store state)

# QUEUEING ELEMENTS (pipeline allows these to atomically execute and also increases speeds by a factor of 4)
# p = r.pipeline()
# p.rpush('queue', data_to_work_with);p.rpush('queue', data_to_work_with);p.rpush('queue', data_to_work_with)
# p.execute()

# POPPING ELEMENTS
# p = r.pipeline()
# p.lpop('queue') - to get single element in the queue to work on
# p.lrange('queue', 0, 10); r.trim(10, -1) - pops the first ten elements off of the queue
# p.execute()

"""
FLASK CODE
"""
@app.route("/")
def home():
    return render_template("task.html", context={'task_id':request.remote_addr})


#@app.route("/distributed")
#def home():
#    return render_template("distributed_task.html", context={'task_id':request.remote_addr})


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

# this is a very important function and based off of each task_id we will return the host args that
@app.route("/get_input_data/")
def get_input_data():
    x = array.array('f', [float(i % (1 << 12)) for i in range(1 << 24)]).tostring()
    #see http://docs.python.org/2/library/array.html
    print 'reached'
    return x


if __name__ == "__main__":
    app.run(host="0.0.0.0") # when we want to test deployment this will make our server externall visible. we have to open up port 5000 though
    #app.run()
