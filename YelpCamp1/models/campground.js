const mongoose = require('mongoose');

const campsiteSchema = new mongoose.Schema({
	name: String,
	price: String,
	desc: String,
	url: String,
	image: String,
	author: {
		id: {type: mongoose.Schema.Types.ObjectId,
			 ref: "User"
			},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// model name here needs to be singular; will be interpreted as plural on the DB collection
module.exports = mongoose.model("campsite", campsiteSchema);
