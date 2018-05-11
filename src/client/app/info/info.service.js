"use strict";

(function () {
    angular
        .module("conpa")
        .factory("infoService", infoService);

    infoService.$inject = ["$http", "$q", "toastService",
        "portfoliosService", "latestService"];
    function infoService($http, $q, toastService, portfoliosService, latestService) {
        var optimalPortfolioToDate = {},
            optimalPortfolioYearToDate = {},
            service = {
                getOptimalPortfolioToDate: getOptimalPortfolioToDate,
                getOptimalPortfolioYearToDate: getOptimalPortfolioYearToDate,
                calcOptimalPortfolioToDate: calcOptimalPortfolioToDate,
                calcOptimalPortfolioYearToDate: calcOptimalPortfolioYearToDate
            };

        return service;

        function getOptimalPortfolioToDate() {
            return optimalPortfolioToDate;
        }

        function getOptimalPortfolioYearToDate() {
            return optimalPortfolioYearToDate;
        }

        function calcOptimalPortfolioToDate(symbols) {
            calcOptimalPortfolio(symbols).then(function (res) {
                angular.merge(optimalPortfolioToDate, res);
            });
        }

        function calcOptimalPortfolioYearToDate(symbols) {
            var refDate = new Date(new Date() - (1000 * 60 * 60 * 24 * 365));

            calcOptimalPortfolio(symbols, refDate).then(function (res) {
                angular.merge(optimalPortfolioYearToDate, res);
            });
        }

        function calcOptimalPortfolio(symbols, refDate) {
            var url = "/api/getOptimalPortfolio",
                deferred = $q.defer(),
                lows = [],
                highs = [],
                ptfParams;

            symbols = symbols.map(function (asset, i) {
                lows[i] = 0;
                highs[i] = -1;

                return asset.symbol;
            });

            resetPortfolioWeightsAndPerf();

            if (symbols.length < 3) {
                return deferred.promise;
            }

            refDate = refDate || (new Date());
            refDate = (new Date(refDate)).toString();

            ptfParams = {
                prods: symbols,
                referenceDate: refDate,
                targetReturn: null,
                lows: lows,
                highs: highs
            };

            $http.post(url, ptfParams).then(function (res) {
                if (res.data.message) {
                    deferred.reject(res.data.message);
                    toastService.show(res.data.message);
                } else {
                    portfoliosService.savePortfolio({
                        symbols: symbols,
                        weights: res.data.optim.solution,
                        ref: refDate,
                        ret: res.data.optim.pm,
                        risk: res.data.optim.ps,
                        perf: res.data.perf,
                        highs: highs,
                        lows: lows
                    }).then(function () {
                        latestService.refresh();
                    });

                    portfoliosService.getScriptOptimalPortfolio(ptfParams)
                        .then(function (script) {
                            res.data.script = script;
                            deferred.resolve(res.data);
                        }).catch(function () {
                            deferred.resolve(res.data);
                        });

                }
            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function resetPortfolioWeightsAndPerf() {
            if (optimalPortfolioToDate &&
                optimalPortfolioToDate.optim) {
                optimalPortfolioToDate.optim.solution.length = 0;
            }
            if (optimalPortfolioYearToDate &&
                optimalPortfolioYearToDate.optim) {
                optimalPortfolioYearToDate.optim.solution.length = 0;
                optimalPortfolioYearToDate.perf.length = 0;
            }
        }
    }

}());
