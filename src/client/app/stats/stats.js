"use strict";

(function () {
    angular
        .module("conpa")
        .component("stats", {
            controller: Stats,
            templateUrl: "app/stats/stats.html"
        });

    Stats.$inject = ["statsService"];
    function Stats(statsService) {
        var vm = this;

        vm.assetStats = statsService.getLatestAssetStats();
    }

}());
