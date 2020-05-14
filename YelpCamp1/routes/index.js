var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res) {
	res.render("home", {text: null});
});
router.get("/login", function(req, res) {
	res.render("auth/login");
});
router.post("/register", function(req, res) {
	var newUser = new User({
		username: req.body.username,
		description: req.body.description
	});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash("error", err.message);
			//console.log(err);
			//return res.render("auth/login");
			res.redirect("/login");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			console.log("Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
	}), function(req, res) {
		
});
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged out.");
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("auth/login");
}

module.exports = router;
