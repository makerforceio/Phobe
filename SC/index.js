var cryto = require("crypto");
var fs = require("fs");
var net = require("net");
var path = require("path");
var express = require("express");
var expresshandlebars = require("express-handlebars");
var bodyparser = require("body-parser");
var serialport = require("serialport");
var rpio = require("rpio");

var serialPort = new serialport.SerialPort("/dev/ttyACM0", {
	baud_rate: 115200
});
rpio.open(12, rpio.PWM);
rpio.pwmSetClockDivider(64);
rpio.pwmSetRange(12, 1024);

var app = express();

var idpath = path.join(__dirname, "id.bin");
var angle = 512;
rpio.pwmSetData(12, angle);

app.get("/", (req, res) => {
	res.render("bots", {
		bots: [{
			_id: "4884a3fb",
			name: "Bot 1",
			stream: "http://192.168.3.32:8081/"
		}]
	});
});

app.get("/bot/:id", (req, res) => {
	res.render("bot", {
		bot: {
			_id: "4884a3fb",
			name: "Bot 1",
			stream: "http://192.168.3.32:8081/"
		}
	});
});

app.get("/bot/:id/pitch", (req, res) => {
	res.write(angle);
	res.end();
});

app.put("/bot/:id/pitch", (req, res) => {
	res.end();
	var a = req.body.angle * 1;
	if (a > 0 && a < 1024) {
		angle = a;
	}
	rpio.pwmSetData(12, angle);
});

app.listen(8080);
