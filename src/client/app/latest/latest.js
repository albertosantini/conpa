"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Latest", Latest);

    Latest.$inject = ["portfoliosService"];
    function Latest(portfoliosService) {
        var vm = this;

        vm.latestPortfolios = [];

        portfoliosService.getLastCreatedPortfolios().then(function (ptfs) {
            angular.merge(vm.latestPortfolios, ptfs);
        });
    }

}());
