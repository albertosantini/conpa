(function ($) {
    "use strict";

    var $basketPieChart = $("#basket-pie-chart"),
        $basketPieRefDateLabel = $("#basket-pie-refdate-label"),
        $basketPieYTDChart = $("#basket-pie-ytd-chart"),
        $basketPerfRefDateLabel = $("#basket-performance-refdate-label"),
        $basketPerfYTDChart = $("#basket-performance-ytd-chart");

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
            url: "/ConPA/getOptimalPortfolio",
            type: "POST",
            data: {
                prods: assets,
                referenceDate: refDate,
                targetReturn: null,
                lows: lows,
                highs: highs
            },
            success: function (data) {
                if (data.message) {
                    $.publish("error.message.conpa",
                        ["Optimization error", data.message]);

                    return;
                }

                $.publish("crm.portfolio.conpa", [
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
                    $.publish("render.piechart.conpa", [
                        "#basket-pie-chart",
                        assets,
                        data.optim.solution
                    ]);
                } else {
                    $basketPieRefDateLabel.html(
                        $.conpa.dates.ymdDate(refDate) + " Weights"
                    );
                    $.publish("render.piechart.conpa", [
                        "#basket-pie-ytd-chart",
                        assets,
                        data.optim.solution
                    ]);

                    $basketPerfRefDateLabel.html(
                        $.conpa.dates.ymdDate(refDate) + " Performance"
                    );
                    $.publish("render.perfchart.conpa", [
                        "#basket-performance-ytd-chart",
                        data.perf
                    ]);
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
