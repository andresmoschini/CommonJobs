'use strict';

/* Controllers */

function EmployeeListCtrl($scope, Employee, $location) {
    var qParams = {
        term: 'term'
    };

    $scope.term = $location.search()[qParams.term];
    
    $scope.$watch("term", function (newValue) {
        newValue = newValue ? newValue : null;
        $location.search(qParams.term, newValue).replace().preventLocationChangedEvent();
        search();
    });
    

    var OnlyLastCallback = function () {
        var previous = null;

        this.prepare = function (callback) {
            if (previous) {
                previous.callback = function (previous) {
                    previous.callback = null;
                };
            }

            previous = { callback: callback };

            return previous;
        };
    };

    var onlyLastCallback = new OnlyLastCallback();

    function search() {
        var parameters = {};
        if ($scope.term) {
            parameters.Term = $scope.term;
        }

        var prepared = onlyLastCallback.prepare(
            function (results, parameters) {
                $scope.employees = results.Items;
            });

        Employee.query(parameters, function (results) {
            prepared.callback(results, parameters);
        });
    }
}


function EmployeeDetailCtrl($scope, $routeParams, Employee) {
    alert("Hola");
    //$scope.results = Employee.get({ employeeId: $routeParams.employeeId }, function (results) {
    //});


    //$scope.setImage = function (imageUrl) {
    //    $scope.mainImageUrl = imageUrl;
    //};
}
