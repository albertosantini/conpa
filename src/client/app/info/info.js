"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Info", Info);

    Info.$inject = ["infoService", "basketService"];
    function Info(infoService, basketService) {
        var vm = this;

        vm.optimalPortfolioToDate = infoService.getOptimalPortfolioToDate();
        vm.optimalPortfolioYearToDate = infoService.getOptimalPortfolioYearToDate();
        vm.assets = basketService.getAssets();
    }

}());
