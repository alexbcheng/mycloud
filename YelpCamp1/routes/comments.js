var express = require("express");
var router = express.Router({mergeParams: true});
var campsite = require("../models/campground"),
	Comment = require("../models/comment"),
	middleware = require("../middleware");

router.get("/:comment_id", middleware.isLoggedIn, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, entry) {
		if (err) {
			console.log(err);
		} else {
			campsite.findById(req.params.id, function(err, camp) {
				if (err) {
					console.log(err);
				} else {
					res.render("comments/edit", {comment : entry, camp : camp});
				}
			});
		}
	});	
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndDelete(req.params.comment_id, function(err, entry) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, {
		text : req.body.text,
		author : {
			id : req.user._id,
			username : req.user.username
		}
	}, function(err, updatedComment) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res) {
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

module.exports = router;
