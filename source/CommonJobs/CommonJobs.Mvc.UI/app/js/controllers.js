/// <reference path="../../Scripts/underscore.js" />
/// <reference path="../lib/angular/angular.js" />
'use strict';

/* Controllers */

function EmployeeListCtrl($scope, Employee, $location) {
    var qParams = {
        term: 'term',
        searchInNotes: 'SearchInNotes',
        searchInAttachments: 'SearchInAttachments'
    };

    var bunchSize = 128;

    $scope.loading = true;
    $scope.noMoreItems = false;
    $scope.lastParameters = null;
    $scope.resultCount = null;

    function bindQueryStringParameters(mapping) {
        var queryStringValues = $location.search();
        for (var scopeKey in qParams) {
            (function (queryStringValues, scopeKey, queryKey) {
                $scope[scopeKey] = queryStringValues[queryKey];
                $scope.$watch(scopeKey, function (newValue) {
                    newValue = newValue ? newValue : null;
                    $location.search(queryKey, newValue).replace().preventLocationChangedEvent();
                    search();
                });
            }(queryStringValues, scopeKey, qParams[scopeKey]));
        }
    }
    bindQueryStringParameters(qParams);
        
    $scope.noMoreItems = function () {
        return !$scope.employees || $scope.resultCount <= $scope.employees.length;
    };

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

    function query(parameters, clean) {
        var prepared = onlyLastCallback.prepare(
            function (results, parameters) {
                $scope.lastParameters = parameters;
                $scope.loading = false;
                $scope.employees = clean ? results.Items : $scope.employees.concat(results.Items);
                $scope.resultCount = results.TotalResults;
            });
        $scope.loading = true;
        Employee.query(parameters, function (results) {
            prepared.callback(results, parameters);
        });
    }

    $scope.getMore = function () {
        if ($scope.lastParameters) {
            $scope.lastParameters.skip = ($scope.lastParameters.skip || 0) + bunchSize;
            query($scope.lastParameters, false);
        }
    }

    function search() {
        var parameters = {
            Take: bunchSize
        };
        if ($scope.term) {
            parameters.Term = $scope.term;
        }
        if ($scope.searchInNotes) {
            parameters.SearchInNotes = $scope.searchInNotes;
        }
        if ($scope.searchInAttachments) {
            parameters.SearchInAttachments = $scope.searchInAttachments;
        }
        
        query(parameters, true);
    }
}

function EmployeeListItemCtrl($scope, $location) {
    //TODO: esto es feo y raro ya que "item" es un nombre que viene de la vista
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
