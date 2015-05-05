var mongoose = require("mongoose");
var model = mongoose.model;
var Employee = require("./employee");

var listSchema = new mongoose.Schema({
	client: String,
	items: [{
		name: String,
		code: String,
		amount: Number,
		weight: Number,
		packageSize: Number,
		price: Number,
		location: String
	}],
	employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee"
	},
	weight: Number,
	revenue: Number,
	done: Boolean,
});

listSchema.statics = {
	addList: function(client,callback) {
		var listModel = this.model("List");
		var list = new listModel();
		list.client = client;
		list.items = [];
		list.done = false;
		list.save(function(err, list){
			callback(list);
		});
	},
	addItem: function(list, item, callback) {
		this.update({_id:list}, {$push: {items: item}}, function(error) {
		  callback();
		});
	},
	setEmployee: function(list, employee, callback) {
		this.update({_id:list}, {$set: {employee: employee}}, function(error) {
		  callback();
		});
	},
	markDone: function(listId, callback) {
		this.findById(listId, function(err, list) {
			var revenue = 0;
			var weight = 0;
			for (var i=0; i<list.items.length;i++) {
				revenue += (list.items[i].price*list.items[i].amount);
				weight += (list.items[i].weight*list.items[i].amount);
			}
			list.revenue = revenue;
			list.weight = weight;
			list.done = true;
			list.save(function(err) {
				Employee.addScores(list.employee, revenue, weight, function() {
					callback(revenue, weight);
				});
				
			});
		});	
	}

};

module.exports = mongoose.model('List', listSchema);
