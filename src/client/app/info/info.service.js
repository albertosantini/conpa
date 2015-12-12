"use strict";

(function () {
    angular
        .module("conpa")
        .factory("infoService", infoService);

    infoService.$inject = ["$http", "$q", "toastService"];
    function infoService($http, $q, toastService) {
        var optimalPortfolio = {},
            service = {
                getOptimalPortfolio: getOptimalPortfolio,
                calcOptimalPortfolio: calcOptimalPortfolio
            };

        return service;

        function getOptimalPortfolio() {
            return optimalPortfolio;
        }

        function calcOptimalPortfolio(symbols, refDate) {
            var url = "/api/getOptimalPortfolio",
                deferred,
                lows = [],
                highs = [];

            symbols = symbols.map(function (asset, i) {
                lows[i] = 0;
                highs[i] = -1;

                return asset.symbol;
            });

            if (symbols.length < 3) {
                if (optimalPortfolio && optimalPortfolio.optim &&
                        optimalPortfolio.optim.solution.length > 0) {
                    optimalPortfolio.optim.solution.length = 0;
                }
                return optimalPortfolio;
            }

            refDate = refDate || (new Date()).toString();

            deferred = $q.defer();

            $http.post(url, {
                prods: symbols,
                referenceDate: refDate,
                targetReturn: null,
                lows: lows,
                highs: highs
            }).then(function (res) {
                if (res.data.message) {
                    deferred.reject(res.data.message);
                    toastService.show(res.data.message);
                } else {
                    deferred.resolve(res.data);
                    angular.merge(optimalPortfolio, res.data);
                }
            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }

}());
