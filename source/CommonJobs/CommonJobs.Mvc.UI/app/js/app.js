'use strict';

/* App Module */

angular.module('commonjobs', ['commonjobsFilters', 'commonjobsServices'], function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/angulardemo/employees', { templateUrl: '/app/partials/employee-list.html', controller: EmployeeListCtrl })
        .when('/angulardemo/employees/edit/*employeeId', { templateUrl: '/app/partials/employee-detail.html', controller: EmployeeDetailCtrl })
        .otherwise({ redirectTo: '/angulardemo/employees' });
    ;
    $locationProvider.html5Mode(true);
 });
