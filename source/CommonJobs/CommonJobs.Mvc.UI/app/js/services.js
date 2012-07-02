'use strict';

/* Services */

angular.module('commonjobsServices', ['ngResource']).
    factory('Employee', function ($resource) {
        return $resource('/Employees/:action/:employeeId', {}, {
            query: { method: 'GET', params: { action: 'List' }, isArray: false }
        });
    });