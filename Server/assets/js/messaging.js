function AutoRenderer() {
    var parser = new DOMParser();
    this.handles = [];
    this.context = {};
    function Handle(scriptElement, context) {
        var templateString = scriptElement.innerHTML;
        this.template = Handlebars.compile(templateString);
        this.context = context || {};
        this.element = scriptElement;
    }
    Handle.prototype.update = function (newContext) {
        newContext && (this.context = newContext);
        var rawHTML = this.template(this.context);
        var newElement = document.createElement("div");
        Array.prototype.forEach.call(parser.parseFromString(rawHTML, "text/html").firstChild.childNodes[1].childNodes, function (ele) {
            newElement.appendChild(ele);
        });
        this.element.parentElement.replaceChild(newElement, this.element);
        this.element = newElement;
    };
    var scriptElements = document.querySelectorAll("script[type='text/x-handlebars-template']");
    Array.prototype.forEach.call(scriptElements, function (scriptElement) {
        var handler = new Handle(scriptElement, this.context);
        this.handles.push(handler);
    }.bind(this));
}

AutoRenderer.prototype.update = function (newContext) {
    for (var i = 0; i < this.handles.length; i++) {
        var handle = this.handles[i];
        if (handle.context == this.context) {
            handle.update(newContext);
        }
    }
    this.context = newContext;
}

var a = new AutoRenderer();

var socket = io();

var cont = {
    messages: [],
    to: {},
    me: {}
};

socket.on("badauth", function () {
    window.location = "/login";
});

var getuser = new Promise(function (resolve, reject) {
    socket.emit("getuser", {
        username: decodeURIComponent(window.location.pathname.split("/")[2])
    }, function (data) {
        cont.to = data;
        resolve();
    });
});

var getme = new Promise(function (resolve, reject) {
    socket.emit("getme", null, function (data) {
        resolve();
        cont.me = data;
    });
});


Promise.all([getme, getuser]).then(function () {

    socket.emit("pastmessages", {
        to: cont.to,
    });

    socket.on("message", function (message, fn) {
        console.log(message);
        if (message.isself ? (cont.to._id == message.to) : (cont.to._id == message.owner)) {
            cont.messages.push(message);
            a.update(cont);
            window.scrollTo(0, document.getElementById("messageform").offsetTop);
			fn("success");
        }
		else {
			fn("ignore");
		}
    });

});

document.getElementById("messageform").addEventListener("submit", function (e) {
    e.preventDefault();
    socket.emit("message", {
        text: document.getElementById("message").value,
        to: cont.to
    });
    document.getElementById("message").value = "";
});

