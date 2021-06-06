console.log("hello");

var socket = io.connect('http://localhost:6382');

var token = undefined;

var tasks = [];
var taskRunning = false;
var tabId = undefined;

socket.on("connect", function () {
    console.log("connected and sending register");
    socket.emit("register", {
        token: token,
        action: "register",
        name: "TestChrome"
    });
});

socket.on("register", function (data) {
    console.log(data);
});

function reportTaskResult(response) {
    console.log("got reported back");
    var task = tasks.shift();
    if (!task) {
        taskRunning = false;
        return;
    }

    socket.emit("task", {
        token: token,
        result: 0,
        taskId: task.taskId,
        data: response
    });
    taskRunning = false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'ready-send-stockwatchdog-html') {
        chrome.tabs.sendMessage(tabId, { text: 'send-stockwatchdog-html' }, reportTaskResult);
    }
});

socket.on("task", function (data) {
    console.log(data);
    tasks.push(data);
});

function getTabs() {
    chrome.tabs.query({ windowType: 'normal' }, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            console.log(tabs[i].id + ": " + tabs[i].title);
        }
    });
}

function runTaskHandler() {
    if (taskRunning) {
        console.log("task currently running aborting")
        return;
    }

    if (tasks.length == 0) {
        console.log("No tasks pending");
        return;
    }
    taskRunning = true;
    var task = tasks[0];

    chrome.tabs.update(tabId, {
        url: task.url
    });
}
setInterval(runTaskHandler, 1000);