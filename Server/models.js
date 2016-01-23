module.exports = (mongoose) => {
	var Schema = mongoose.Schema;

	var Bot = mongoose.model('Bot', {
		hex: String,
		lastup: Date,

	});
	
	return {
		Bot: Bot
	};

};

