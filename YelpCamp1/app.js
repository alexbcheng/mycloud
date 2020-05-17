const 	express = require("express"),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require("body-parser"),
		methodOverride = require("method-override"),
	  	expressSanitizer = require("express-sanitizer"),
	  	passport = require("passport"),
	  	LocalStrategy = require("passport-local"),
	  	passportLocalMongoose = require("passport-local-mongoose"),
	  	flash = require("connect-flash"),
		port = 3000;
var rp = require('request-promise'),
	User = require('./models/user')
	;
var commentRoutes 	 = require("./routes/comments"),
 	campgroundRoutes = require("./routes/campgrounds"),
 	indexRoutes      = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method")); // what to look for in the URL
app.use(flash());

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

mongoose.connect('mongodb+srv://ugatdba:ugatdba01@cluster0-qoqcv.mongodb.net/YelpCamp?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to Database!');
}).catch(err => {
	console.log('Database connection error: ', err.message);
});

app.listen(process.env.PORT || port, () => {
	console.log('server started. listening on port '+port);
});

