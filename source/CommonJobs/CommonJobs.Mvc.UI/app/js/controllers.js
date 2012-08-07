/// <reference path="../../Scripts/underscore.js" />
/// <reference path="../lib/angular/angular.js" />
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

function EmployeeListItemCtrl($scope, $location) {
    //TODO: esto es feo y raro
    var employee = $scope.item;

    $scope.hasPictureUrl = function () {
        var photo = employee.Photo;
        return photo && ((photo.Thumbnail && photo.Thumbnail.Id) || (photo.Photo && photo.Photo.Id));
    }

    $scope.getPictureUrl = function () {
        var photo = employee.Photo;
        if (photo && photo.Thumbnail && photo.Thumbnail.Id) {
            return "/Attachments/Get/" + photo.Thumbnail.Id;
        } else if (photo && photo.Photo && photo.Photo.Id) {
            return "/Attachments/Get/" + photo.Photo.Id;
        } else {
            return null;
        }
    }

    $scope.hasFullName = function () {
        return employee.LastName || employee.FirstName;
    }

    $scope.getFullName = function () {
        if (employee.LastName && employee.FirstName) {
            return employee.LastName + ", " + employee.FirstName;
        } else if (employee.LastName) {
            return employee.LastName;
        } else if (employee.FirstName) {
            return employee.FirstName;
        } else {
            return null;
        }
    }

    $scope.hasSkills = function () {
        return (_.isString(employee.Skills) && $.trim(employee.Skills).length > 0);
    }

    $scope.getSkills = function () {
        if ($scope.hasSkills(employee)) {
            return _.map(employee.Skills.split(/\-|,/), function (tag) { return $.trim(tag); });
        } else {
            return null;
        }
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
