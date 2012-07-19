'use strict';

/* Controllers */

function EmployeeListCtrl($scope, Employee, $location) {
    $scope.terms = $location.search().term;
    
    $scope.$watch('term', function (value) {
        $location.search("term", value ? value : null).replace().preventLocationChangedEvent();
        search();
    });

    var currentQuery = null;
    function search() {
        //TODO: cancel previous searchs
        var parameters = {};
        if ($scope.term) {
            parameters.Term = $scope.term;
        }
        if (currentQuery) {
            //window.currentQuery = currentQuery;
            //currentQuery.reject();
        }
        window.currentQuery = currentQuery = Employee.query(parameters, function (results) {
            $scope.employees = results.Items; 
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
