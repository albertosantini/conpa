"use strict";

(function () {
    angular
        .module("conpa")
        .factory("latestService", latestService);

    latestService.$inject = ["portfoliosService"];
    function latestService(portfoliosService) {
        var latestPortfolios = [],
            service = {
                getLatestPortfolios: getLatestPortfolios,
                refresh: refresh
            };

        return service;

        function getLatestPortfolios() {
            return latestPortfolios;
        }

        function refresh() {
            portfoliosService.getLastCreatedPortfolios().then(function (ptfs) {
                angular.merge(latestPortfolios, ptfs);
            });
        }
    }

}());
