
function add(x, y) {
    return x + y;
}


function get_data() {
    url = "/data";
    request = $.ajax(url, {"async": false}).done(function(args) {
        results = add.apply(null, args.data);
        send_data(results);
    });
}

function send_data(r) {
    $.ajax("/send_result").done(function(msg) {
        console.log(msg);
    });
}

function main() {
    get_data();
}

main();