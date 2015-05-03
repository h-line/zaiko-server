var app = angular.module("zaikoApp", []);

app.service("ajax", function($http) {
	return {
		getLists: function() {
			return $http.get("/lists");
		},

		addList: function(client) {
			return $http.post("/list", {client:client});
		},
		removeList: function(id) {
			return $http.delete("/list/"+id);
		},
		getEmployees: function() {
			return $http.get("/employees");
		},
		addEmployee: function(name) {
			return $http.post("/employee", {name:name});
		},
		removeEmployee: function(id) {
			return $http.delete("/employee/"+id);
		},
		addItem: function(id, item) {
			return $http.put("/list/"+id, {item:item});
		}
		
	};
});

app.controller("mainController", ["$scope", "ajax", function($scope, ajax) {
    ajax.getLists()
    	.success(function(response) {
    		$scope.lists = response;
    		for (var i=0;i<$scope.lists.length; i++) {
    			$scope.lists[i].weight = 0;
    			$scope.lists[i].revenue = 0;
    			for (var j=0; j<$scope.lists[i].items.length; j++) {
    				console.log("whasdf");
    				$scope.lists[i].weight += $scope.lists[i].items[j].amount * $scope.lists[i].items[j].weight;
    				$scope.lists[i].revenue += $scope.lists[i].items[j].amount * $scope.lists[i].items[j].price;
    			}
    			$scope.lists[i].weight = $scope.lists[i].weight.toFixed(2);
    			$scope.lists[i].revenue = $scope.lists[i].revenue.toFixed(2);
    		}
    	});
}]);

app.controller("adminController", ["$scope", "ajax", function($scope, ajax) {
    ajax.getLists()
    	.success(function(response) {
    		$scope.lists = response;
    	});
    ajax.getEmployees()
    	.success(function(response) {
    		$scope.employees = response;
    	});
    $scope.showModal = false;
    $scope.currentList = 0;
    initItem();
    function initItem() {
    	$scope.newItem = {
	    	name:"",
			code: "",
			amount: 0,
			weight: 0,
			packageSize: 0,
			price: 0,
			location: ""
	    };
	}

    $scope.addList = function() {
    	ajax.addList($scope.newListClient)
    		.success(function(response) {
	    		$scope.lists.push(response);
	    		$scope.newListClient = "";
	    	}); 
    };

    $scope.removeList = function(id, index) {
  		ajax.removeList(id)
  			.success(function(response) {
  				$scope.lists.splice(index, 1);
  			});
    };

    $scope.addEmployee = function() {
    	ajax.addEmployee($scope.newEmployee)
    		.success(function(response) {
	    		$scope.employees.push(response);
	    		$scope.newEmployee = "";
	    	}); 
    };

 	$scope.removeEmployee = function(id, index) {
  		ajax.removeEmployee(id)
  			.success(function(response) {
  				$scope.employees.splice(index, 1);
  			});
    };
    $scope.showItems = function(list) {
    	$scope.currentList = list;
    	$scope.showModal=true;
    };

    $scope.addItem = function() {
    	var listId = $scope.lists[$scope.currentList]._id;
    	ajax.addItem(listId, $scope.newItem)
    		.success(function(response) {
	    		$scope.lists[$scope.currentList].items.push($scope.newItem);
	    		initItem();
	    	}); 
    };

}]);