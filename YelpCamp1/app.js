const 	express = require("express"),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require("body-parser"),
		port = 3000;
var rp = require('request-promise'),
	campsite = require('./models/campground'),
	Comment = require('./models/comment')
	;


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

app.get("/", function(req, res) {
	res.render("home", {text: null});
});

app.get("/campgrounds", function(req, res) {
	//res.render("campgrounds", {campsites: campsites1});
	campsite.find({}, function(err, allcampsites) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campsites: allcampsites});
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
	res.render("campgrounds/new");
});
app.get("/campgrounds/:id", function(req, res) {
	campsite.findById(req.params.id).populate("comments").exec(function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {camp : camp});	
		}
	});
});

//
// - Comments route
//

app.post("/campgrounds/:id/comments", function(req, res) {
	campsite.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
			
		}
	});
});

app.listen(port, () => {
	console.log('server listing on port '+port);
});
