"use strict";

(function () {
    angular
        .module("conpa")
        .factory("infoService", infoService);

    infoService.$inject = ["$http", "$q", "toastService",
        "portfoliosService", "latestService"];
    function infoService($http, $q, toastService,
            portfoliosService, latestService) {
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
                deferred = $q.defer(),
                lows = [],
                highs = [];

            symbols = symbols.map(function (asset, i) {
                lows[i] = 0;
                highs[i] = -1;

                return asset.symbol;
            });

            if (optimalPortfolio && optimalPortfolio.optim) {
                optimalPortfolio.optim.solution.length = 0;
            }

            if (symbols.length < 3) {
                return deferred.promise;
            }

            refDate = refDate || (new Date()).toString();

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
                    portfoliosService.savePortfolio({
                        "symbols": symbols,
                        "weights": res.data.optim.solution,
                        "ref": refDate,
                        "ret": res.data.optim.pm,
                        "risk": res.data.optim.ps,
                        "perf": res.data.perf,
                        "highs": highs,
                        "lows": lows
                    }).then(function () {
                        latestService.refresh();
                    });

                    angular.merge(optimalPortfolio, res.data);
                    deferred.resolve(res.data);
                }
            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }

}());
