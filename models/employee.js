var mongoose = require("mongoose");
var model = mongoose.model;

var employeeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	lists: [{
		revenue: Number,
		weight: Number,
		doneAt: Date,
	}]
});

employeeSchema.statics = {
	addEmployee: function(name,callback) {
		var employeeModel = this.model("Employee");
		var employee = new employeeModel();
		employee.name = name;
		employee.save(function(err, employee) {
			callback(employee);
		});
	},
	addScores: function(id, revenue, weight, callback) {
		this.findById(id, function(err, employee) {
			var list = {
				revenue: revenue,
				weight: weight,
				doneAt: Date.now()
			}
			employee.lists.push(list);
			employee.save(callback);
		});
	},
	highScore: function(time, callback) {
		var date = Date.now() - time;
		this.find({"lists.doneAt": {$gt: date}}).exec(function(err, employees) {

			var scores = [];
			var score;
			for (var i=0; i<employees.length;i++) {
				score = {};
				score.name = employees[i].name;
				score.weight = 0;
				score.revenue = 0;
				for(var j=0; j<employees[i].lists.length; j++) {
					if (employees[i].lists[j].doneAt >= date) {
						score.weight += employees[i].lists[j].weight;
						score.revenue += employees[i].lists[j].revenue;
					}
				}
				scores.push(score);
				
			}
			console.log(scores)
			callback(scores)
		});
	}

};

module.exports = mongoose.model('Employee', employeeSchema);
