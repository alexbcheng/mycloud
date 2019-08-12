const 	express = require("express"),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require("body-parser"),
		methodOverride = require("method-override"),
	  	expressSanitizer = require("express-sanitizer"),
	  	passport = require("passport"),
	  	LocalStrategy = require("passport-local"),
	  	passportLocalMongoose = require("passport-local-mongoose"),
		port = 3000;
var rp = require('request-promise'),
	campsite = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user')
	;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method")); // what to look for in the URL

app.use(require("express-session")({
	secret : "hakunamatata",
	resave : false,
	saveUninitialized :false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

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
app.post("/campgrounds", isLoggedIn, function(req, res) {
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
app.get("/campgrounds/new", isLoggedIn, function(req, res) {
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

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	campsite.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//Comment.create(req.body.comment, function(err, comment) {
			Comment.create({
				text : req.body.text,
				author : {
					id : req.user._id,
					username : req.user.username
				}
			}, function(err, comment) {
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

//
// - Auth routes
//
app.get("/login", function(req, res) {
	res.render("auth/login");
});
app.post("/register", function(req, res) {
	var newUser = new User({
		username: req.body.username,
		description: req.body.description
	});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("login");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		});
	});
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}), function(req, res) {
	
});
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(port, () => {
	console.log('server started. listening on port '+port);
});
