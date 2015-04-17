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
		location: {
			x: Number,
			y: Number
		}
	}]
});

listSchema.statics = {
	addList: function(client,callback) {
		var listModel = this.model("List");
		var list = new listModel();
		list.client = client,
		list.items = [];
		list.save(callback);
	},

};

module.exports = mongoose.model('List', listSchema);
