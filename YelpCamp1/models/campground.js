const mongoose = require('mongoose');

const campsiteSchema = new mongoose.Schema({
	name: String,
	url: String,
	image: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// model name here needs to be singular; will be interpreted as plural on the DB collection
module.exports = mongoose.model("campsite", campsiteSchema);
