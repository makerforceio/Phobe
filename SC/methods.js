module.export = () => {

	var pitch = require("./pitch")();

	var move = require("./move")();

	return {
		pitch: pitch,
		move: move
	};

};
