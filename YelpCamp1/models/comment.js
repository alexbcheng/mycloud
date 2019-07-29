const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: String,
	author: String
});

// model name here needs to be singular; will be interpreted as plural on the DB collection
module.exports = mongoose.model("Comment", commentSchema);
