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

module.exports = router;
