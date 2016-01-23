var net = require("net");
var fs = require("fs");
var path = require("path");
var cryto = require("crypto");

var filepath = path.join(__dirname, "id.bin");

var socket = net.Socket()

socket.connect((socket) => {
	var id;
	fs.readFile(filepath, (err, data) => {
		if(err){
			id = crypto.randomBytes(4);
		}else{
			id = data;
		}
	});
	socket.write(0x41);
	socket.write(id);
});
socket.data((err, data) => {
	if(data == 0x51){
		setInterval(() -> {
			socket.write(0x40);
		}, 500);
	}
});