const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
var rp = require('request-promise');
var postUrl = 'https://jsonplaceholder.typicode.com/posts';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("home", {text: null});
	console.log("home page accessed!");
});

app.get("/posts", function(req, res) {
	rp(postUrl)
 	  .then((body) => {
		var parsedData = JSON.parse(body);
		res.render("results", {posts: parsedData});
		postUrl = 'https://jsonplaceholder.typicode.com/posts';
	  })
 	  .catch((err) => {
		console.error('error: ', err);
 	});
});

app.post("/filter", function(req, res) {
	postUrl = postUrl+'?userId='+req.body.userid;
	res.redirect("/posts");
});

app.listen(port, () => {
	console.log('server listing on port '+port);
});
