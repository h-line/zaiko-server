var mongoose = require("mongoose");
var model = mongoose.model;

var employeeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	}
});

employeeSchema.statics = {
	addEmployee: function(name,callback) {
		var employeeModel = this.model("Employee");
		var employee = new employeeModel();
		employee.name = name;
		employee.save(function(err, employee) {
			callback(employee);
		});
	}

};

module.exports = mongoose.model('Employee', employeeSchema);
