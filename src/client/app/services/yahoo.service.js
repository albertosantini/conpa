"use strict";

var YAHOO = {};
YAHOO.Finance = {};
YAHOO.Finance.SymbolSuggest = {};

(function () {
    angular
        .module("conpa")
        .factory("yahooService", yahooService);

    yahooService.$inject = ["$http", "$q"];
    function yahooService($http, $q) {
        var service = {
            quoteLookup: quoteLookup
        };

        return service;

        function quoteLookup(query) {
            var deferred = $q.defer(),
                url = "http://autoc.finance.yahoo.com/autoc?" +
                    "region=US&lang=en-US&" +
                    "callback=YAHOO.Finance.SymbolSuggest.ssCallback";

            YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
                deferred.resolve(data.ResultSet.Result);
            };

            $http.jsonp(url, {
                params: {
                    query: query
                }
            });

            return deferred.promise;
        }
    }

}());
