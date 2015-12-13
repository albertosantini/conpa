var YAHOO = {};
YAHOO.Finance = {};
YAHOO.Finance.SymbolSuggest = {};

(function ($) {
    "use strict";

    var assets = {};

    $("input").typeahead({
        items: 10,

        source: function (query, process) {
            jQuery.ajax({
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback: "YAHOO.Finance.SymbolSuggest.ssCallback",
                data: {
                    query: query
                },
                cache: true,
                url: "http://autoc.finance.yahoo.com/autoc"
            });

            YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
                var res;

                res = jQuery.map(data.ResultSet.Result, function (item) {
                    var asset = {
                            symbol: item.symbol,
                            name: item.name,
                            type: item.type,
                            exchDisp: item.exchDisp
                        },
                        key = asset.symbol + " " + asset.name +
                            " (" + asset.type + " - " + asset.exchDisp + ")";

                    assets[key] = asset;

                    return key;
                });

                process(res);
            };
        },

        updater: function (item) {
            return assets[item].symbol;
        }
    });

}(jQuery));
