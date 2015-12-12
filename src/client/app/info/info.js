"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Info", Info);

    Info.$inject = ["infoService", "basketService"];
    function Info(infoService, basketService) {
        var vm = this;

        vm.optimalPortfolio = infoService.getOptimalPortfolio();
        vm.assets = basketService.getAssets();
    }

}());
