var express = require("express");
var expresshbs = require("express-handlebars");
var mongoose = require("mongoose");
var net = require('net');

mongoose.connect('mongodb://phobe:phobe123@localhost/phobe');
var models = require("./models")(mongoose);
var Bot = models.Bot;

var app = express();

app.engine('handlebars', expresshbs({
	defaultLayout: 'main',
	helpers: {

	}
}));

app.set('view engine', 'handlebars');

app.get("/", (req, res) => {
	res.end();
	res.render("botlist", {
		bots: [
			{
				id: ""
				src: 
			}
		]
	});
});

var managementserver = net.createServer((c) => {
	console.log('client connected');
	c.on('end', () => {
		console.log('client disconnected');
	});
	c.on("data", (d) => {
		console.log(d);
		switch (data[0]) {
			case 0x40:
				console.log("online");
				break;
			case 0x41:
				console.log("register");
				var hex = new Buffer([data[1], data[2], data[3], data[4]]);
				console.log(hex);
				Bot.findOne({ hex: hex.toString("hex") }, (err, bot) => {
					bot.update({ $set: { lastup: Date.now() } }, (err, doc) => {
						
					});
				});
				break;
		}
	});
});

app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function () {
	console.log("listening");
});

managementserver.listen(41337, () => {
	console.log("listening");
});
