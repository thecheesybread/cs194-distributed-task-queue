setData = false;
data = null;
get_update = function(iteration) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/get_update_data/' + '127.0.0.1' + '/' + iteration, true); //true means async is true
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    if (this.status == 200) {
      var array_buffer = xhr.response;
      if (array_buffer) {
        //https://developer.mozilla.org/en-US/docs/Web/API/Uint32Array
        //console.log("Time to load update:" + ((new Date()).getTime() - window.startUpdate));
        //window.time_to_load_update.push((new Date()).getTime() - window.startUpdate);
        ghostIn = new Float32Array(array_buffer, 0, ghostRowSize * columnSize);
        postMessage(array_buffer);
      }
    }
  }
  xhr.onreadystatechange = function(e) {
    if (this.status != 200 && this.readyState == 4) {
      //console.log("could not load data from server " + this.status);
      get_update(iteration);
    }
  }
  xhr.send();
}

onmessage = function(e) {
  iteration = e.data;
  get_update(iteration);
}
