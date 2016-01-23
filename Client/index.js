var cryto = require("crypto");
var fs = require("fs");
var net = require("net");
var path = require("path");

var serialport = require("serialport")

var serialPort = new serialport.SerialPort("/dev/ttyACM0", {
	baud_rate:115200
});

var filepath = path.join(__dirname, "id.bin");

var socket = net.Socket()

socket.connect({port:41337, address:"makerforce.io"}, (socket) -> {
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
	socket.on("data", (data) => {
		switch(data[0]){
			case 0x51:
				setInterval(() => {
					socket.write(0x40);
				}, 500);
			break;
			case 0x54:
				serialPort.write(data);
			break;
			case 0x58:
				serialPort.write(data);
			break;
			default:
			break;
		}
	});
});
