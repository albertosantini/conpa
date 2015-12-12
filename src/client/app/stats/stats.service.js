"use strict";

(function () {
    angular
        .module("conpa")
        .factory("statsService", statsService);

    statsService.$inject = ["$http", "$q"];
    function statsService($http, $q) {
        var latestAsset = {
                symbol: "",
                stats: []
            },
            service = {
                getLatestAssetStats: getLatestAssetStats,
                getKeyStatistics: getKeyStatistics
            };

        return service;

        function getLatestAssetStats() {
            return latestAsset;
        }

        function getKeyStatistics(symbol) {
            var url = "/api/getKeyStatistics",
                deferred;

            if (!symbol) {
                latestAsset.stats.length = 0;
                latestAsset.symbol = "";
            }

            deferred = $q.defer();

            $http.post(url, {
                symbol: symbol
            }).then(function (res) {
                deferred.resolve(res.data);
                angular.merge(latestAsset.stats, res.data);
                latestAsset.symbol = symbol;

            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }

}());
