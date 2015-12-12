"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Best", Best);

    Best.$inject = ["portfoliosService"];
    function Best(portfoliosService) {
        var vm = this;

        vm.bestPerformingPortfolios = [];
        vm.lowProfileRiskPortfolios = [];
        vm.highProfileReturnPortfolios = [];

        portfoliosService.getBestPerformingPortfolios().then(function (ptfs) {
            angular.merge(vm.bestPerformingPortfolios, ptfs);
        });

        portfoliosService.getLowProfileRiskPortfolios().then(function (ptfs) {
            angular.merge(vm.lowProfileRiskPortfolios, ptfs);
        });

        portfoliosService.getHighProfileReturnPortfolios().then(function (ptfs) {
            angular.merge(vm.highProfileReturnPortfolios, ptfs);
        });
    }

}());
