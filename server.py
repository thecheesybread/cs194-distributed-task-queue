from flask import Flask, render_template, jsonify, abort
from flask import request
import redis
import array
import json
import random
import time

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
r.rpush('update_data', 0)
r.rpush('update_data', 0)
r.rpush('update_data', 0)
r.rpush('update_data', 0)
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
NUMBER_OF_CLIENTS = 1
NUMBER_OF_GHOST_CELLS = 40
@app.route("/")
def home():
    #return render_template("task.html", context={'task_id':str(request.remote_addr) + '.' + str(int(random.random() * 1000000))})
    return render_template("task.html", context={'task_id':str(request.remote_addr)})


@app.route("/distributed")
def home():
    return render_template("distributed_task.html", context={'task_id':request.remote_addr})


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

@app.route("/send_result/<string:task_id>/<int:iteration>", methods=['POST'])
def store_result(task_id, iteration):
    index = get_client_index(task_id)
    data = request.data
    while iteration * NUMBER_OF_CLIENTS + index > r.llen('update_data') + 1:
        r.rpush('update_data', 0)
    r.lset('update_data', iteration * NUMBER_OF_CLIENTS + index, data)
    return data

def get_client_index(task_id):
    for index in range(NUMBER_OF_CLIENTS):
        if r.lindex('connected_clients', index) == task_id:
            return index


@app.route("/get_update_data/<string:task_id>/<int:iteration>")
def get_update_data(task_id, iteration):
    index = get_client_index(task_id)
    if index == 0:
        data = r.lindex('update_data', iteration * NUMBER_OF_CLIENTS + 1)
    elif index == 1:
        data = r.lindex('update_data', iteration * NUMBER_OF_CLIENTS)
    if data == 0:
        # data is not ready yet and we should wait for the data
        abort(408)
    else:
        return data

@app.route("/heart_beat")
def heart_beat():
    ip_addr = request.remote_addr

# this is a very important function and based off of each task_id we will return the host args that
@app.route("/get_input_data/<string:task_id>")
def get_input_data(task_id):
    index = get_client_index(task_id)
    # starting data is a 1 << 25 BY 1 << 24 array
    # each processor processes 1 << 24 by 1 << 24 array. there will be a left and right processor sharing their data
    if index == 0:
        x = array.array('f', [float(i % (1 << 12)) for i in range(1 << 24)]).tostring()
        ghosts = array.array('f', [float((i % NUMBER_OF_GHOST_CELLS) + (i << 12)) for i in range((1 << 12) * NUMBER_OF_GHOST_CELLS)])
        r.lset('update_data', 0, ghosts)
    elif index == 1 or True:
        x = array.array('f', [float((i % (1 << 12)) + (i << 12)) for i in range(1 << 24)]).tostring()
        ghosts = array.array('f', [float((i << 12) - (i % NUMBER_OF_GHOST_CELLS)) for i in range((1 << 12) * NUMBER_OF_GHOST_CELLS)])
        r.lset('update_data', 1, ghosts)

    #see http://docs.python.org/2/library/array.html
    print 'reached'
    return x

@app.route("/synchronize/<string:task_id>", methods=['GET'])
def synchronize(task_id):
    current_time = time.time() # time in seconds after epoch
    r.zadd('current_clients', task_id,  long(current_time))
    synced_clients = set(r.zrangebyscore('current_clients', long(current_time - 15), long(current_time + 1))) # get clients that have synchronized within last 5 seconds
    if len(synced_clients) == NUMBER_OF_CLIENTS:
        r.rpush('connected_clients', task_id)
        return 'ready'
    else:
        r.delete('connected_clients')
        return 'not ready yet'


if __name__ == "__main__":
    app.run(host="0.0.0.0") # when we want to test deployment this will make our server externall visible. we have to open up port 5000 though
    #app.run()
