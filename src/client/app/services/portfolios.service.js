"use strict";

(function () {
    angular
        .module("conpa")
        .factory("portfoliosService", portfoliosService);

    portfoliosService.$inject = ["$http", "$q", "toastService"];
    function portfoliosService($http, $q, toastService) {
        var service = {
            getLastCreatedPortfolios: getLastCreatedPortfolios,
            getBestPerformingPortfolios: getBestPerformingPortfolios,
            getWorstPerformingPortfolios: getWorstPerformingPortfolios,
            getLowProfileRiskPortfolios: getLowProfileRiskPortfolios,
            getHighProfileRiskPortfolios: getHighProfileRiskPortfolios,
            getHighProfileReturnPortfolios: getHighProfileReturnPortfolios,
            getLowProfileReturnPortfolios: getLowProfileReturnPortfolios,
            savePortfolio: savePortfolio,
            getMostUsedAssets: getMostUsedAssets,
            getPortfolioCount: getPortfolioCount
        };

        return service;

        function getCRM(url) {
            var deferred = $q.defer();

            $http.get(url).then(function (res) {
                deferred.resolve(res.data.rows || res.data);
            }).catch(function (err) {
                deferred.reject(err);
                toastService.show("Communication error with CRM database.");
            });

            return deferred.promise;
        }

        function getLastCreatedPortfolios() {
            return getCRM("/api/getLastCreatedPortfolios");
        }

        function getBestPerformingPortfolios() {
            return getCRM("/api/getBestPerformingPortfolios");
        }

        function getLowProfileRiskPortfolios() {
            return getCRM("/api/getLowProfileRiskPortfolios");
        }

        function getHighProfileReturnPortfolios() {
            return getCRM("/api/getHighProfileReturnPortfolios");
        }

        function getWorstPerformingPortfolios() {
            return getCRM("/api/getWorstPerformingPortfolios");
        }

        function getHighProfileRiskPortfolios() {
            return getCRM("/api/getHighProfileRiskPortfolios");
        }

        function getLowProfileReturnPortfolios() {
            return getCRM("/api/getLowProfileReturnPortfolios");
        }

        function savePortfolio(ptf) {
            var deferred = $q.defer(),
                url = "/api/putPortfolioOnCRM";

            $http.post(url, {
                "symbols": ptf.symbols,
                "weights": ptf.weights,
                "ref": ptf.ref,
                "ret": ptf.ret,
                "risk": ptf.risk,
                "perf": ptf.perf,
                "highs": ptf.highs,
                "lows": ptf.lows
            }).then(function (res) {
                deferred.resolve(res.data);
            }).catch(function (err) {
                deferred.reject(err);
                toastService.show("Error saving the portfolio.");
            });

            return deferred.promise;
        }

        function getMostUsedAssets() {
            return getCRM("/api/getMostUsedAssets");
        }

        function getPortfolioCount() {
            return getCRM("/api/getPortfolioCount");
        }
    }

}());
