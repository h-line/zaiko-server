var mongoose = require("mongoose");
var model = mongoose.model;

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
	done: Boolean
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
	}

};

module.exports = mongoose.model('List', listSchema);
