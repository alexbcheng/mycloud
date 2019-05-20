const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const bodyParser = require("body-parser");
var rp = require('request-promise');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// mongoose.connect('mongodb+srv://ugatdba:ugatdba01@cluster0-qoqcv.mongodb.net/test?retryWrites=true', {
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log('Connected to Database!');
// }).catch(err => {
// 	console.log('Database connection error: ', err.message);
// });
// const campsiteSchema = new mongoose.Schema({
// 	name: String,
// 	url: String,
// 	image: String
// });
// const campsites = mongoose.model("YelpCamp", campsiteSchema);

var campsites1 = [
	{name: "Liberty Harbor", url: "www.libertyharborrv.com", image: "http://www.libertyharborrv.com/uploads/tentSite.jpg"	},
	{name: "Sandy Hook", url: "www.recreation.gov", image: "https://cdn.recreation.gov/public/2018/08/02/15/02/073debbe-e376-41b8-80aa-3e62f6839cd4_1600.jpg" }
];

app.get("/", function(req, res) {
	res.render("home", {text: null});
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds", {campsites: campsites1});
});
app.post("/campgrounds", function(req, res) {
	campsites1.push({name: req.body.name, url: req.body.url, image: req.body.image});
	res.redirect("/campgrounds");
});
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.listen(port, () => {
	console.log('server listing on port '+port);
});
