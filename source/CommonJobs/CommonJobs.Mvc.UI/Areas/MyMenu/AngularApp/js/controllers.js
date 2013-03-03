'use strict';

/* Controllers */


function EditCtrl() { }
EditCtrl.$inject = ['$scope'];


function AdminCtrl() {
}
AdminCtrl.$inject = ['$scope'];


function OrderCtrl($scope) {
    //TODO: angularize it
    $scope.onAjaxCall = false;
    $scope.orderDate = moment();
    $scope.isOrdered = false;
    $scope.isProcessButtonVisible = false;
    //TODO: load from server
    $scope.hasGenerateOrderPermission = true;
    //TODO: load from server
    var viewData = {
        "now": "2013-03-02T16:58:12",
        "order": {
            "Id": "Menu/DefaultMenu/2013-03-02",
            "Date": "2013-03-02T00:00:00",
            "MenuId": "Menu/DefaultMenu",
            "WeekIdx": 4,
            "DayIdx": 6,
            "PlacesByKey": {
                "place_larioja": "La Rioja",
                "place_garay": "Garay"
            },
            "OptionsByKey": {
                "menu_comun": "Calórico",
                "menu_light": "Light",
                "menu_vegetariano": "Vegetariano"
            },
            "FoodsByOption": {},
            "QuantityByOptionByPlace": {},
            "DetailByUserName": {},
            "IsOrdered": true
        },
        "baseLink": "/MyMenu/Edit"
    };
    var order = viewData.order;
    $scope.isOrdered = order.IsOrdered;
    $scope.orderDate = moment(order.Date);
    $scope.placeSummaries = _.sortBy(_.map(order.PlacesByKey, function (placeName, placeKey) {
        return ({
            placeKey: placeKey,
            placeName: placeName,
            optionSummaries: _.map(order.OptionsByKey, function (optionName, optionKey) {
                return ({
                    optionKey: optionKey,
                    optionName: optionName,
                    food: order.FoodsByOption[optionKey],
                    quantity: order.QuantityByOptionByPlace[placeKey] && order.QuantityByOptionByPlace[placeKey][optionKey] || 0
                });
            })
        });
    }), "placeKey");
    console.log($scope.placeSummaries);
    $scope.detail = _.sortBy(_.map(order.DetailByUserName, function (element, key) {
        return ({
            userName: key,
            url: viewData.baseLink + "/" + key,
            employeeName: element.EmployeeName,
            placeKey: element.PlaceKey,
            placeName: element.PlaceKey && order.PlacesByKey[element.PlaceKey] || " - ",
            optionKey: element.OptionKey,
            optionName: element.OptionKey && order.OptionsByKey[element.OptionKey] || " - ",
            food: element.PlaceKey && element.OptionKey && order.FoodsByOption[element.OptionKey] || "No come aquí",
            comment: element.Comment || " - "
        });
    }), "employeeName");

    $scope.toggleProcessButton = function () {
        $scope.isProcessButtonVisible = !$scope.isProcessButtonVisible;
    };
}
OrderCtrl.$inject = ['$scope'];