const 	express = require("express"),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require("body-parser"),
	  	methodOverride = require("method-override"),
		port = 3000;
var rp = require('request-promise');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method")); // what to look for in the URL

mongoose.connect('mongodb+srv://ugatdba:ugatdba01@cluster0-qoqcv.mongodb.net/Blogs?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(() => {
	console.log('Connected to Database!');
}).catch(err => {
	console.log('Database connection error: ', err.message);
});
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
// model name here needs to be singular; will be interpreted as plural on the DB collection
const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
	res.redirect("/blogs");
});

// show all records route
app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, allblogs) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {Blogs: allblogs});
		}
	});
});

// create new record route (POST)
app.post("/blogs", function(req, res) {
	Blog.create(req.body.blog, function(err, obj) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/blogs");
		}
	});
});

// show new record entry form route
app.get("/blogs/new", function(req, res) {
	res.render("new");
});

// show single record route
app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, entry) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {entry : entry});
		}
	});
});

// show form to update single record route
app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err) {
			console.log(err);
		} else {
			res.render("edit", {blog : blog});	
		}
	});	
});

// update single record route (PUT)
app.put("/blogs/:id", function(req, res) {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// delete single record route (DELETE)
app.delete("/blogs/:id", function(req, res) {
	Blog.findByIdAndDelete(req.params.id, function(err, entry) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(port, () => {
	console.log('server listing on port '+port);
});
