// copied from https://github.com/nax3t/webdevbootcamp/blob/master/YelpCamp/v10/middleware/index.js
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("/campgrounds");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
			    req.flash("error","Not authorized.");
				res.redirect("/campgrounds/" + req.params.id);
            }
           }
        });
    } else {
		req.flash("error","Login required.");
        res.redirect("/campgrounds");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("/campgrounds");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
			    req.flash("error","Not authorized.");
                res.redirect("/campgrounds");
            }
           }
        });
    } else {
		req.flash("error","Login required.");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error","Login required.");
    res.redirect("/login");
}

module.exports = middlewareObj;
