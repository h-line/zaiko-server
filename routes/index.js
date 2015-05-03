var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var List = require("../models/list.js");
var Employee = require("../models/employee.js");

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
	return res.render("add_list");
  })
  .post(function(req,res,next) {
	var client = req.body.client;
	List.addList(client, function(list) {
	  return res.send(list);
	});
  });

router.route("/list/:id")
  .put(function(req,res,next) {
	var item = req.body.item;
	var list = req.params.id;
	List.addItem(list, item, function() {
	  return res.send({"success": "added"});
	});
  })
  .delete(function(req,res,next) {
	List.remove({_id: req.params.id}, function() {
	  return res.send({"success": "removed"});
	});
  });

router.get("/employees", function(req,res,next) {
  Employee.find().exec(function(error, employees) {
	return res.send(employees);
  });
});

router.route("/employee")
  .get(function(req,res,next) {
	return res.render("add_employee");
  })
  .post(function(req,res,next) {
	var name = req.body.name;
	Employee.addEmployee(name, function(employee) {
	  return res.send(employee);
	});
  });

router.route("/employee/:id")
  .delete(function(req,res,next) {
	Employee.remove({_id: req.params.id}, function() {
	  return res.send({"success": "removed"});
	});
  });
module.exports = router;
