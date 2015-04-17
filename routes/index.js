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

router.post("/githook", function (req,res,next) {
  exec("cd /home/lauri/Code/zaiko-server && git pull", {maxBuffer: 500*1024}, function(error, stdout, stderror){
    return res.send("Out: "+stdout+"\nError: "+stderror);
  });
});

module.exports = router;
