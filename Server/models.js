module.exports = (mongoose) => {
	var Schema = mongoose.Schema;

	var Camera = mongoose.model('Camera', {
		hex: String,
		lastup: Date,

	});
	
	return {
		Camera: Camera
	};

};

