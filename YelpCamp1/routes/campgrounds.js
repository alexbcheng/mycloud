var express = require("express");
var router = express.Router({mergeParams: true});
var campsite = require("../models/campground"),
	middleware = require("../middleware");

router.get("/", function(req, res) {
	//res.render("campgrounds", {campsites: campsites1});
	campsite.find({}, function(err, allcampsites) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campsites: allcampsites});
		}
	});
});
router.post("/", middleware.isLoggedIn, function(req, res) {
	//campsites1.push({name: req.body.name, url: req.body.url, image: req.body.image});
	campsite.create({
		name: req.body.name,
		desc: req.body.desc,
		url: req.body.url,
		image: req.body.image,
		author: {
			id : req.user._id,
			username : req.user.username
		}
	}, function(err, obj) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
			//console.log(obj);
		}
	});
});
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});
router.get("/:id", function(req, res) {
	campsite.findById(req.params.id).populate("comments").exec(function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {camp : camp});	
		}
	});
});
// show edit page route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	campsite.findById(req.params.id, function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {camp : camp});
		}
	});	
});
// update single record route (PUT)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	campsite.findByIdAndUpdate(req.params.id, {
		name: req.body.name,
		desc: req.body.desc,
		url: req.body.url,
		image: req.body.image,
		author: {
			id : req.user._id,
			username : req.user.username
		}
	}, function(err, updatedCampsite) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
// delete single record route (DELETE)
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	campsite.findByIdAndDelete(req.params.id, function(err, entry) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
