"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Stats", Stats);

    Stats.$inject = ["statsService"];
    function Stats(statsService) {
        var vm = this;

        vm.assetStats = statsService.getLatestAssetStats();
    }

}());
