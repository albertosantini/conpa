"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Latest", Latest);

    Latest.$inject = ["latestService"];
    function Latest(latestService) {
        var vm = this;

        vm.latestPortfolios = latestService.getLatestPortfolios();
        latestService.refresh();
    }

}());
