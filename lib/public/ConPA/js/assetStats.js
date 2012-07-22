/*global jQuery, Handlebars */
/*jslint unparam:true */

(function ($) {
    "use strict";

    var assetStatsRawTemplate =
            '<dl class="dl-horizontal">' +
            '{{#this}}' +
                '<dt title="{{inputParams.label}}">{{inputParams.label}}</dt>' +
                '<dd>{{& inputParams.value}}</dd>' +
            '{{/this}}' +
            '</dl>',
        assetStatsTemplate = Handlebars.compile(assetStatsRawTemplate),
        $assetStatsName = $('#asset-stats-name'),
        $assetStatsList1 = $('#asset-stats-list1'),
        $assetStatsList2 = $('#asset-stats-list2');

    function getKeyStatistics(symbol) {
        $.ajax({
            url: "/ConPA/getKeyStatistics",
            type: "POST",
            data: {
                symbol: symbol
            },
            success: function (data) {
                var midIndex, secondHalf, firstHalf, firstItem;

                if (!data.length) {
                    return;
                }

                midIndex = data.length / 2;
                secondHalf = data;
                firstHalf = secondHalf.splice(0, midIndex);
                firstItem = firstHalf[0].inputParams.value;

                $assetStatsName.html('Asset Stats for ' + symbol);

                $assetStatsList1.html(assetStatsTemplate(firstHalf));
                $assetStatsList2.html(assetStatsTemplate(secondHalf));
            }
        });
    }

    function handleKeyStatistics(e, symbol) {
        getKeyStatistics(symbol);
    }

    $.subscribe("stats.asset.conpa", handleKeyStatistics);

}(jQuery));

