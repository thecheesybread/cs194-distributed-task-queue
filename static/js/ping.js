console.log("Hello World");

var url = "/pong"


var request = $.ajax(url, {"async": false}).done(function(msg) {
    console.log("Sucessfully got the javascript url!");
})

var script_loc = request.responseText;
console.log(script_loc);
$.getScript(script_loc)

