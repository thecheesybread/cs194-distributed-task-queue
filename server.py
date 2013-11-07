from flask import Flask, render_template
from flask import request
import redis
import array

app = Flask(__name__)
app.config.from_object(__name__)
app.config['DEBUG'] = True


r = redis.Redis(host='localhost', port=6379, db=0)
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


@app.route("/")
def home():
    return render_template("task.html", context={'task_id':request.remote_addr})

@app.route("/pong")
def pong():
    return "/static/js/pong.js"

# this is a very important function and based off of each task_id we will return the host args that
@app.route("/get_host_args/")
def get_host_args():
    x = array.array('I', [i for i in range(1024 * 1024)]).tostring()
    print 'reached'
    return x


if __name__ == "__main__":
    app.run(host='0.0.0.0') # when we want to test deployment this will make our server externall visible. we have to open up port 5000 though
    #app.run()
