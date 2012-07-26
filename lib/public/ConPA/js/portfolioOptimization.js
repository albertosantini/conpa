/*global jQuery */
/*jslint unparam:true */

(function ($) {
    "use strict";

    var $basketPieChart = $('#basket-pie-chart'),
        $basketPieYTDChart = $('#basket-pie-ytd-chart'),
        $basketPerfYTDChart = $('#basket-performance-ytd-chart');

    function drawPieChart(pieNode, assets, weights) {
        pieNode.sparkline(weights, {
            type: 'pie',
            height: '150',
            offset: 90,
            tooltipFormatter: function (spark, options, field) {
                var index;

                $.grep(weights, function (n, i) {
                    if (n === field.value) {
                        index = i;
                    }
                });

                return assets[index] + " " +
                    $.conpa.helpers.percentageFormatter(field.value);
            }
        });
    }

    function drawPerformanceChart(perfNode, performances) {
        perfNode.sparkline(performances, {
            type: 'bar',
            height: '150',
            barWidth: 2,
            tooltipFormatter: function (spark, options, field) {
                return $.conpa.helpers.percentageFormatter(field[0].value);
            }
        });
    }

    function getOptimalPortfolio(assets, refDate) {
        var lows = [], highs = [];

        assets = $.map(assets, function (asset, i) {
            lows[i] = 0;
            highs[i] = -1;

            return asset.symbol;
        });

        if (assets.length < 3) {
            return;
        }

        refDate = refDate || (new Date()).toString();

        $.ajax({
            url: '/ConPA/getOptimalPortfolio',
            type: 'POST',
            data: {
                prods: assets,
                referenceDate: refDate,
                targetReturn: undefined,
                lows: lows,
                highs: highs
            },
            success: function (data) {
                if (data.message) {
                    $.publish('error.message.conpa',
                        ['Optimization error', data.message]);

                    return;
                }

                $.publish('crm.portfolio.conpa', [
                    assets,
                    data.optim.solution,
                    refDate,
                    data.optim.pm,
                    data.optim.ps,
                    data.perf,
                    highs,
                    lows
                ]);

                if (!data.perf.length) {
                    drawPieChart($basketPieChart, assets, data.optim.solution);
                } else {
                    drawPieChart($basketPieYTDChart, assets, data.optim.solution);
                    drawPerformanceChart($basketPerfYTDChart, data.perf);
                }
            }
        });
    }

    function handleClearPortfolio() {
        $basketPieChart.empty();
        $basketPieYTDChart.empty();
        $basketPerfYTDChart.empty();
    }

    function handlePortfolioOptimization(e, assets, refDate) {
        getOptimalPortfolio(assets, refDate);
    }

    $.subscribe("clear.portfolio.conpa", handleClearPortfolio);
    $.subscribe("optimize.portfolio.conpa", handlePortfolioOptimization);

}(jQuery));


