"use strict";

(function () {
    angular
        .module("conpa")
        .controller("Worst", Worst);

    Worst.$inject = ["portfoliosService"];
    function Worst(portfoliosService) {
        var vm = this;

        vm.worstPerformingPortfolios = [];
        vm.highProfileRiskPortfolios = [];
        vm.lowProfileReturnPortfolios = [];

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
