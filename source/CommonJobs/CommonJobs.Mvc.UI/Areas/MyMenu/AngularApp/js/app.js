'use strict';


// Declare app level module which depends on filters, and services
angular.module('myMenu', ['myMenu.filters', 'myMenu.services', 'myMenu.directives']).
  config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      //TODO: fix absolute path
      $routeProvider.when('/', { templateUrl: '/Areas/MyMenu/AngularApp/partials/Edit.html', controller: EditCtrl });
      $routeProvider.when('/Edit/:username', { templateUrl: '/Areas/MyMenu/AngularApp/partials/Edit.html', controller: EditCtrl });
      $routeProvider.when('/Admin', { templateUrl: '/Areas/MyMenu/AngularApp/partials/Admin.html', controller: AdminCtrl });
      $routeProvider.when('/Order', { templateUrl: '/Areas/MyMenu/AngularApp/partials/Order.html', controller: OrderCtrl });
      $routeProvider.when('/Order', { templateUrl: '/Areas/MyMenu/AngularApp/partials/Order.html', controller: OrderCtrl });
      $routeProvider.when('/Order/:place', { templateUrl: '/Areas/MyMenu/AngularApp/partials/Order.html', controller: OrderCtrl });
      $routeProvider.otherwise({ redirectTo: '/' });
      //It does not work well because it is assuming that the App is in domain root, 
      //Is there another configuration?
      //$locationProvider.html5Mode(true);
  } ]);