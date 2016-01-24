var cryto = require("crypto");
var fs = require("fs");
var net = require("net");
var path = require("path");
var express = require("express");
var expresshbs = require("express-handlebars");
var bodyparser = require("body-parser");
var methods = require("./methods");

var app = express();

app.engine('handlebars', expresshbs({
	defaultLayout: 'main',
	helpers: {
	}
}));

app.set('view engine', 'handlebars');
app.use(bodyparser.urlencoded());

var idpath = path.join(__dirname, "id.bin");

app.get("/", (req, res) => {
/*	res.render("bots", {
		bots: [{
			_id: "4884a3fb",
			name: "Bot 1",
			stream: "http://192.168.3.31:8081/"
		}]
	});*/
	res.end();
});

app.get("/bot/:id", (req, res) => {
	res.render("control", {
		bot: {
			_id: "4884a3fb",
			name: "Bot 1",
			connected: true,
			stream: "http://192.168.3.42:8081/stream/video.mjpeg"
		}
	});
});

app.unlock("/bot/:id/move", (req, res) => {
	res.end();
	methods.move.enable(true);
});

app.lock("/bot/:id/move", (req, res) => {
	res.end();
	methods.move.enable(false);
});

app.put("/bot/:id/move", (req, res) => {
	res.end();
	methods.move.set(req.body.l * 1, req.body.r * 1);
});

app.get("/bot/:id/pitch", (req, res) => {
	res.write(methods.pitch.get());
	res.end();
});

app.put("/bot/:id/pitch", (req, res) => {
	res.end();
	methods.pitch.set(req.body.angle * 1);
});

app.listen(8080, () => {
	console.log("list");
});
