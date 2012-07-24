/*jslint unparam:true, nomen:true */
/*global jQuery, _ */

(function ($) {
    "use strict";

    var assetStatsRawTemplate =
            '<dl class="dl-horizontal">' +
            '<% _.each(fields, function (field) { %>' +
                '<dt title="<%= field.inputParams.label %>">' +
                    '<%= field.inputParams.label %></dt>' +
                '<dd><%= field.inputParams.value %></dd>' +
            '<% }) %>' +
            '</dl>',
        assetStatsTemplate = _.template(assetStatsRawTemplate),
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
                var midIndex, secondHalf, firstHalf;

                if (!data.length) {
                    return;
                }

                midIndex = data.length / 2;
                secondHalf = data;
                firstHalf = secondHalf.splice(0, midIndex);

                $assetStatsName.html('Asset Stats for ' + symbol);

                $assetStatsList1.html(assetStatsTemplate({
                    fields: firstHalf
                }));
                $assetStatsList2.html(assetStatsTemplate({
                    fields: secondHalf
                }));
            }
        });
    }

    function handleKeyStatistics(e, symbol) {
        getKeyStatistics(symbol);
    }

    $.subscribe("stats.asset.conpa", handleKeyStatistics);

}(jQuery));

