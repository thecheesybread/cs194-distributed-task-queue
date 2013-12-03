setData = false;
data = null;
get_update = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/get_update_data/' + '10.0.0.10'+ '/' + iteration, true); //true means async is true
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    if (this.status == 200) {
      var array_buffer = xhr.response;
      if (array_buffer) {
        //https://developer.mozilla.org/en-US/docs/Web/API/Uint32Array
        //console.log("Time to load update:" + ((new Date()).getTime() - window.startUpdate));
        //window.time_to_load_update.push((new Date()).getTime() - window.startUpdate);
        postMessage(array_buffer);
      }
    }
  }
  xhr.onreadystatechange = function(e) {
    if (this.status != 200 && this.readyState == 4) {
      //console.log("could not load data from server " + this.status);
      setTimeout(get_update, 100);
    }
  }
  xhr.send();
}

onmessage = function(e) {
  iteration = e.data;
  get_update();
}
