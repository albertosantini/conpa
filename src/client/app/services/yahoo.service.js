"use strict";

var YAHOO = {};

YAHOO.Finance = {};
YAHOO.Finance.SymbolSuggest = {};

(function () {
    angular
        .module("conpa")
        .factory("yahooService", yahooService);

    yahooService.$inject = ["$http", "$q", "$sce"];
    function yahooService($http, $q, $sce) {
        var service = {
            quoteLookup: quoteLookup
        };

        return service;

        function quoteLookup(query) {
            var deferred = $q.defer(),
                url = "https://autoc.finance.yahoo.com/autoc?" +
                    "region=US&lang=en-US";

            YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
                deferred.resolve(data.ResultSet.Result);
            };

            $http.jsonp($sce.trustAsResourceUrl(url), {
                params: {
                    query: query
                }
            }).catch(function () {

                // ignore error
            });

            return deferred.promise;
        }
    }

}());
