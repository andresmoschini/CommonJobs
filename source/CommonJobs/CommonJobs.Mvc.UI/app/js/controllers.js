'use strict';

/* Controllers */

function EmployeeListCtrl($scope, Employee) {
    $scope.employees = Employee.query(function (results) {
        $scope.employees = results.Items;
    });

}


function EmployeeDetailCtrl($scope, $routeParams, Employee) {
    //$scope.results = Employee.get({ employeeId: $routeParams.employeeId }, function (results) {
    //});


    //$scope.setImage = function (imageUrl) {
    //    $scope.mainImageUrl = imageUrl;
    //};
}
