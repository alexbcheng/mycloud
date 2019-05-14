const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect('mongodb+srv://ugatdba:ugatdba01@cluster0-qoqcv.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to Database!');
}).catch(err => {
	console.log('Database connection error: ', err.message);
});

const testSchema = new mongoose.Schema({
	title: String,
	description: String,
});

const test = mongoose.model("test", testSchema);

app.get('/', async (req, res) => {
	let post = await test.create({title: 'Test title', description: 'Test description'});
	res.send(post);
});

app.listen(port, () => {
	console.log('server listing on port '+ port);
});
