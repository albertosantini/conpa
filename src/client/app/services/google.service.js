"use strict";

(function () {
    angular
        .module("conpa")
        .factory("googleService", googleService);

    googleService.$inject = ["$http"];
    function googleService($http) {
        var service = {
            quoteLookup: quoteLookup
        };

        return service;

        function quoteLookup(query) {
            var url = "http://www.google.com/finance/match?" +
                    "matchtype=matchall";

            return $http.get(url, {
                params: {
                    q: query
                }
            }).then(function (res) {
                return res.data.matches.map(function (quote) {
                    return {
                        symbol: quote.t,
                        name: quote.n,
                        exchDisp: quote.e,
                        type: quote.id
                    };
                });
            });
        }
    }

}());
