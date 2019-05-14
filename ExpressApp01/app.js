const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var posts = [
	{name: "Alex", tag: "Dad"},
	{name: "Vena", tag: "Mom"},
	{name: "Andre", tag: "Son 1"},
	{name: "Enzo", tag: "Son 2"}
];

app.get("/", function(req, res) {
	res.render("home", {text: null});
	console.log("home page accessed!");
});

app.get("/about", function(req, res) {
	res.send("About us!");
	console.log("about page accessed!");
});

app.get("/posts", function(req, res) {
	
	res.render("posts", {posts: posts});
});

app.get("/:level1", function(req, res) {
	var route1 = req.params.level1;
	res.render("home", {text: route1});
	//res.send("Welcome to "+ route1.toUpperCase());
});

app.get("/repeat/:word/:times", function(req, res) {
	var word = req.params.word;
	var times = parseInt(req.params.times);
	var fulltext = "";
	for (var i=0; i < times; i++) {
		fulltext += word +" ";
	}
	res.send(fulltext);
});

app.get("*", function(req, res) {
	res.send("page not found baby!");
	console.log("non-existent page accessed!");
});

app.post("/addPerson", function(req, res) {
	posts.push(req.body);
	res.redirect("/posts");
});

app.listen(port, () => {
	console.log('server listing on port '+port);
});
