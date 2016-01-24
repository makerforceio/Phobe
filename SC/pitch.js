module.exports = () => {

	var rpio = require("rpio");
	rpio.open(12, rpio.PWM);
	rpio.pwmSetClockDivider(64);
	rpio.pwmSetRange(12, 1024);

	var angle = 700;
	rpio.pwmSetData(12, angle);

	var set = (ang) => {
		var scale = (i) => {
			return Math.max(600, Math.min(750, i * 100 * 1.5 + 600));
		};
		angle = scale(ang);
		rpio.pwmSetData(12, angle);
	};

	var get = () => {
		return (angle - 600) / 100 / 1.5;
	}; 

	return {
		set: set,
		get: get
	};

};
