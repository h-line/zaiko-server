var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var List = require("../models/list.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zaiko' });
});

router.get("/lists/", function(req,res,next) {
  List.find().exec(function(error, lists) {
	return res.send(lists);
  });
});

router.route("/list")
  .get(function(req,res,next) {
	return res.render("new_list");
  })
  .post(function(req,res,next) {
	var client = req.body.client;
	List.addList(client, function() {
	  return res.redirect("/lists");
	});
  });
	


module.exports = router;
