const 	express = require("express"),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require("body-parser"),
		port = 3000;
var rp = require('request-promise');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb+srv://ugatdba:ugatdba01@cluster0-qoqcv.mongodb.net/YelpCamp?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to Database!');
}).catch(err => {
	console.log('Database connection error: ', err.message);
});
const campsiteSchema = new mongoose.Schema({
	name: String,
	url: String,
	image: String
});
// model name here needs to be singular; will be interpreted as plural on the DB collection
const campsite = mongoose.model("campsite", campsiteSchema);

app.get("/", function(req, res) {
	res.render("home", {text: null});
});

app.get("/campgrounds", function(req, res) {
	//res.render("campgrounds", {campsites: campsites1});
	campsite.find({}, function(err, allcampsites) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {campsites: allcampsites});
		}
	});
});
app.post("/campgrounds", function(req, res) {
	//campsites1.push({name: req.body.name, url: req.body.url, image: req.body.image});
	campsite.create({
		name: req.body.name,
		url: req.body.url,
		image: req.body.image
	}, function(err, obj) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
			//console.log(obj);
		}
	});
});
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});
app.get("/campgrounds/:id", function(req, res) {
	campsite.findById(req.params.id, function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {camp : camp});	
		}
	});
});

app.listen(port, () => {
	console.log('server listing on port '+port);
});
