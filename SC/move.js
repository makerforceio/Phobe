module.exports = () => {

	var serialport = require("serialport");
	var serialPort = new serialport.SerialPort("/dev/ttyACM0", {
		baud_rate: 115200
	});

	serialPort.on("data", (d) => {
		console.log(d);
	});

	var set = (l, r) => {
		var scale = (i) => {
			return Math.max(-400, Math.min(400, i * 400));
		}; 
		var buff = new Buffer(5);
		buff.writeUInt8(0x58);
		buff.writeInt16BE(scale(l), 1);
		buff.writeInt16BE(scale(r), 3);
		console.log(buff);
		serialPort.write(buff);
	};
	
	var enabled = false;

	var enable = (bool) => {
		var buff = new Buffer(1);
		if (bool) {
			enabled = true;
			buff.writeUInt8(0x56);
		}
		else {
			enabled = false;
			buff.writeUInt8(0x57);
		}
		serialPort.write(buff);
	};

	var isEnabled = () => {
		return enabled;
	};

	return {
		set: set,
		enable: enable,
		isEnabled: isEnabled
	};

};
