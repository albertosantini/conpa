/*jslint unparam:true */
/*global jQuery */

(function ($) {
    "use strict";

    function handlePortfolioCRM(e,
            symbols, weights, ref, ret, risk, perf, highs, lows) {
        $.ajax({
            url: '/ConPA/putPortfolioOnCRM',
            type: 'POST',
            data: {
                'symbols': symbols,
                'weights': weights,
                'ref': ref,
                'ret': ret,
                'risk': risk,
                'perf': perf,
                'highs': highs,
                'lows': lows
            },
            success: function () {
                $.publish('render.dashboard.conpa');
            }
        });
    }

    $.subscribe("crm.portfolio.conpa", handlePortfolioCRM);

}(jQuery));



