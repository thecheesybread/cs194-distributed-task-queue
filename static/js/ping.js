
var task_request = $.ajax("/get_tasks", {"async": false}).done(function(task_info) {
    task_id = task_info.task_id;
    task_script = task_info.script;
    console.log("Task ID: " + task_id);
    console.log("Task Script: " + task_script);
})

console.log("Executing script" + task_script);
$.getScript("/static/js/add.js");