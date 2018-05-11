"use strict";

(function () {
    angular
        .module("conpa")
        .component("latest", {
            controller: Latest,
            templateUrl: "app/latest/latest.html"
        });

    Latest.$inject = ["latestService"];
    function Latest(latestService) {
        var vm = this;

        vm.latestPortfolios = latestService.getLatestPortfolios();
        latestService.refresh();
    }

}());
