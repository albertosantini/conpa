"use strict";

(function () {
    angular
        .module("conpa")
        .component("header", {
            controller: Header,
            templateUrl: "app/header/header.html"
        });

    Header.$inject = ["$rootScope"];
    function Header($rootScope) {
        var vm = this;

        $rootScope.$watch("isLoadingView", function () {
            vm.isLoadingView = $rootScope.isLoadingView;
        });
    }

}());
