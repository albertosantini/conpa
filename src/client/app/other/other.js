"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Other", Other);

    Other.$inject = ["portfoliosService"];
    function Other(portfoliosService) {
        var vm = this;

        vm.bestPerformingPortfolios = [];
        vm.lowProfileRiskPortfolios = [];
        vm.highProfileReturnPortfolios = [];
        vm.worstPerformingPortfolios = [];
        vm.highProfileRiskPortfolios = [];
        vm.lowProfileReturnPortfolios = [];

        portfoliosService.getBestPerformingPortfolios().then(function (ptfs) {
            angular.merge(vm.bestPerformingPortfolios, ptfs);
        });

        portfoliosService.getLowProfileRiskPortfolios().then(function (ptfs) {
            angular.merge(vm.lowProfileRiskPortfolios, ptfs);
        });

        portfoliosService.getHighProfileReturnPortfolios().then(function (ptfs) {
            angular.merge(vm.highProfileReturnPortfolios, ptfs);
        });

        portfoliosService.getWorstPerformingPortfolios().then(function (ptfs) {
            angular.merge(vm.worstPerformingPortfolios, ptfs);
        });

        portfoliosService.getHighProfileRiskPortfolios().then(function (ptfs) {
            angular.merge(vm.highProfileRiskPortfolios, ptfs);
        });

        portfoliosService.getLowProfileReturnPortfolios().then(function (ptfs) {
            angular.merge(vm.lowProfileReturnPortfolios, ptfs);
        });
    }

}());
