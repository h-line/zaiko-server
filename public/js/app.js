var app = angular.module("zaikoApp", []);

app.service("ajax", function($http) {
	return {
		getLists: function() {
			return $http.get("/lists");
		},
        getAllLists: function() {
            return $http.get("/lists/all");
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
		},
        setEmployee: function(id, employee) {
            return $http.put("/list/"+id+"/employee", {employee:employee});
        },
        markDone: function(id) {
            return $http.put("/list/"+id+"/done");
        },
        highScoreWeek: function() {
            return $http.get("/highscore/week");
        },
        highScoreDay: function() {
            return $http.get("/highscore/day");
        }
		
	};
});

app.controller("mainController", ["$scope", "$interval", "ajax", function($scope, $interval, ajax) {
    function update() {
        ajax.getLists()
        	.success(function(response) {
        		$scope.lists = response;
        		for (var i=0;i<$scope.lists.length; i++) {
        			$scope.lists[i].weight = 0;
        			$scope.lists[i].revenue = 0;
        			for (var j=0; j<$scope.lists[i].items.length; j++) {
        				$scope.lists[i].weight += $scope.lists[i].items[j].amount * $scope.lists[i].items[j].weight;
        				$scope.lists[i].revenue += $scope.lists[i].items[j].amount * $scope.lists[i].items[j].price;
        			}
        			$scope.lists[i].weight = $scope.lists[i].weight.toFixed(2);
        			$scope.lists[i].revenue = $scope.lists[i].revenue.toFixed(2);
        		}
        	});
        ajax.highScoreWeek()
            .success(function(response) {
                $scope.highScoreWeek = response
            });

        ajax.highScoreDay()
            .success(function(response) {
                $scope.highScoreDay = response
            });
    };
    update();
    $interval(update, 5000);

}]);

app.filter('fixedTwo', function() {
  return function(input) {
    return input.toFixed(2);
  };
})
app.directive('myDone', function($document) {
  return {
    scope: {
        list: "=myDone"
    },
    template: '<div ng-class="class">{{done}}</div>',
    link: function(scope, element, attr) {
        scope.$watch("list", function(list, old) {
            scope.class = "";
            if (list.done && list.employee) {
            scope.done = "Done"
            }
            else if(!list.done && list.employee) {
                scope.done = list.employee.name + " is working on it"
                scope.class = "progress";
            }
            else {
                scope.done ="Waiting"
            }
        }, true);
    }
  };
});
app.controller("adminController", ["$scope", "ajax", function($scope, ajax) {
    ajax.getAllLists()
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
        $scope.currentEmployee = ($scope.lists[list].employee) ? $scope.lists[list].employee._id: null;
        $scope.currentDone = $scope.lists[list].done;
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

    $scope.$watch("currentEmployee",function(employee, old) {
        if(employee && employee != old) {
            var listId = $scope.lists[$scope.currentList]._id;
            ajax.setEmployee(listId, employee)
                .success(function(response) {
                    for (var i=0; i<$scope.employees.length;i++) {
                        if($scope.employees[i]._id === employee) {
                            $scope.lists[$scope.currentList].employee = $scope.employees[i];
                            break;
                        }
                    }
                   
                }); 
         }
    });

    $scope.markDone = function() {
        var listId = $scope.lists[$scope.currentList]._id;
        ajax.markDone(listId)
            .success(function(response) {
                $scope.lists[$scope.currentList].done = true;
                $scope.lists[$scope.currentList].revenue = response.revenue;
                $scope.lists[$scope.currentList].weight = response.weight;
            }); 
    };
}]);