'use strict';

/* App Module */

angular.module('commonjobs', ['commonjobsFilters', 'commonjobsServices']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/employees', { templateUrl: 'partials/employee-list.html', controller: EmployeeListCtrl }).
            when('/employees/:employeeId', { templateUrl: 'partials/employee-detail.html', controller: EmployeeDetailCtrl }).
            otherwise({ redirectTo: '/employees' });
 }]);
