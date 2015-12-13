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
            savePortfolio: savePortfolio
        };

        return service;

        function getPortfolios(url) {
            var deferred = $q.defer();

            $http.get(url).then(function (res) {
                deferred.resolve(res.data.rows);
            }).catch(function (err) {
                deferred.reject(err);
                toastService.show("Error retrieving portfolios.");
            });

            return deferred.promise;
        }

        function getLastCreatedPortfolios() {
            return getPortfolios("/api/getLastCreatedPortfolios");
        }

        function getBestPerformingPortfolios() {
            return getPortfolios("/api/getBestPerformingPortfolios");
        }

        function getLowProfileRiskPortfolios() {
            return getPortfolios("/api/getLowProfileRiskPortfolios");
        }

        function getHighProfileReturnPortfolios() {
            return getPortfolios("/api/getHighProfileReturnPortfolios");
        }

        function getWorstPerformingPortfolios() {
            return getPortfolios("/api/getWorstPerformingPortfolios");
        }

        function getHighProfileRiskPortfolios() {
            return getPortfolios("/api/getHighProfileRiskPortfolios");
        }

        function getLowProfileReturnPortfolios() {
            return getPortfolios("/api/getLowProfileReturnPortfolios");
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
                console.log(res.data);
                deferred.resolve(res.data.rows);
            }).catch(function (err) {
                deferred.reject(err);
                toastService.show("Error saving the portfolio.");
            });

            return deferred.promise;
        }
    }

}());
