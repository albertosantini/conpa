"use strict";

(function () {
    angular
        .module("conpa")
        .factory("portfoliosService", portfoliosService);

    portfoliosService.$inject = ["$http", "$q"];
    function portfoliosService($http, $q) {
        var service = {
            getLastCreatedPortfolios: getLastCreatedPortfolios,
            getBestPerformingPortfolios: getBestPerformingPortfolios,
            getWorstPerformingPortfolios: getWorstPerformingPortfolios,
            getLowProfileRiskPortfolios: getLowProfileRiskPortfolios,
            getHighProfileRiskPortfolios: getHighProfileRiskPortfolios,
            getHighProfileReturnPortfolios: getHighProfileReturnPortfolios,
            getLowProfileReturnPortfolios: getLowProfileReturnPortfolios
        };

        return service;

        function getPortfolios(url) {
            var deferred = $q.defer();

            $http.get(url).then(function (res) {
                deferred.resolve(res.data.rows);
            }).catch(function (err) {
                deferred.reject(err);
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
    }

}());
