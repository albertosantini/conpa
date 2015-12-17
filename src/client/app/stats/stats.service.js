"use strict";

(function () {
    angular
        .module("conpa")
        .factory("statsService", statsService);

    statsService.$inject = ["$http", "$q", "basketService"];
    function statsService($http, $q, basketService) {
        var latestStats = {
                symbol: "",
                stats: [],
                noAssets: true
            },
            service = {
                getLatestAssetStats: getLatestAssetStats,
                getKeyStatistics: getKeyStatistics
            };

        return service;


        function getLatestAssetStats() {
            return latestStats;
        }

        function getKeyStatistics(symbol) {
            var url = "/api/getKeyStatistics",
                deferred = $q.defer();

            if (!symbol) {
                latestStats.stats.length = 0;
                latestStats.symbol = "";
                latestStats.noAssets = true;

                return deferred.promise;
            }

            $http.post(url, {
                symbol: symbol
            }).then(function (res) {
                deferred.resolve(res.data);
                angular.merge(latestStats.stats, res.data);
                latestStats.symbol = symbol;
                latestStats.noAssets = countAssets() === 0;

            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function countAssets() {
            return basketService.getAssets().length;
        }
    }

}());
