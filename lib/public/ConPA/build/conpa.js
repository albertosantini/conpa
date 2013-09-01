/*global jQuery, _ */

(function ($, _) {
    'use strict';

    var rawTemplate =
            '<div class="alert alert-block <%= type %>">' +
                '<% if (close) { %>' +
                    '<a class="close" data-dismiss="alert" href="#">×</a>' +
                '<% } %>' +
                '<h4 class="alert-heading"><%= heading %></h4>' +
                '<%= message %>' +
            '</div>',
        template = _.template(rawTemplate),
        $message = $('#message');

    function handleClearMessage() {
        $message.empty();
    }

    function handleErrorMessage(e, header, message) {
        $message.html(template({
            type: 'alert-error',
            heading: header,
            message: message,
            close: false
        }));
    }

    $.subscribe('clear.message.conpa', handleClearMessage);
    $.subscribe('error.message.conpa', handleErrorMessage);

}(jQuery, _));


/*global jQuery, _ */

(function ($) {
    'use strict';

    var latestPortfoliosRawTemplate =
            '<table class="table table-bordered table-condensed table-hover">' +
                '<thead>' +
                    '<tr>' +
                        '<th>To Date</th>' +
                        '<th>Reference Date</th>' +
                        '<th>Last Created</th>' +
                        '<th>Perf</th>' +
                        '<th>Risk</th>' +
                        '<th>Ret</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<% _.each(rows, function (row, key, list) { %>' +
                    '<% if (key > limit) { %>' +
                        '<% return; %>' +
                    '<% } %>' +
                    '<tr data-id=<%= row.id %>>' +
                        '<td><%= row.key %></td>' +
                        '<td><%= row.value.ref %></td>' +
                        '<td title=<%= row.id %>>' +
                            '<%= hyphenFormatter(row.id) %></td>' +
                        '<td><%= percentageFormatter(row.value.perf) %></td>' +
                        '<td><%= percentageFormatter(row.value.risk) %></td>' +
                        '<td><%= percentageFormatter(row.value.ret) %></td>' +
                    '</tr>' +
                    '<% }) %>' +
                '</tbody>' +
            '</table>',
        otherPortfoliosRawTemplate =
            '<table class="table table-bordered table-condensed table-hover">' +
                '<thead>' +
                    '<tr>' +
                        '<th><%= keyName %></th>' +
                        '<th>To Date</th>' +
                        '<th><%= idDesc %></th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<% _.each(rows, function (row, key, list) { %>' +
                    '<tr data-id=<%= row.id %>>' +
                        '<td><%= helpers.percentageFormatter(row.key) %></td>' +
                        '<td><%= row.value.created_at %></td>' +
                        '<td title=<%= row.id %>>' +
                            '<%= helpers.hyphenFormatter(row.id) %></td>' +
                    '</tr>' +
                    '<% }) %>' +
                '</tbody>' +
            '</table>',
        latestPortfoliosTemplate = _.template(latestPortfoliosRawTemplate),
        otherPortfoliosTemplate = _.template(otherPortfoliosRawTemplate),
        $latestPortfoliosList = $('#latest-portfolios-list'),
        $bestPerfomingPortfoliosList =
            $('#best-performing-portfolios-list'),
        $worstPerfomingPortfoliosList =
            $('#worst-performing-portfolios-list'),
        $lowProfileRiskPortfoliosList =
            $('#lowprofile-risk-portfolios-list'),
        $highProfileRiskPortfoliosList =
            $('#highprofile-risk-portfolios-list'),
        $lowProfileReturnPortfoliosList =
            $('#lowprofile-return-portfolios-list'),
        $highProfileReturnPortfoliosList =
            $('#highprofile-return-portfolios-list');

    function getLastCreatedPortfolios(nTotalPtfs, nDisplayPtfs) {
        $.ajax({
            url: '/ConPA/getLastCreatedPortfolios',
            data: {
                limit: nTotalPtfs
            },
            success: function (data) {
                _.extend(data, {limit: nDisplayPtfs - 1}, $.conpa.helpers);
                $latestPortfoliosList.html(latestPortfoliosTemplate(data));

                $.publish('render.latestptfschart.conpa', [data]);
            }
        });
    }

    function getOtherPortfolios(options) {
        $.ajax({
            url: options.url,
            success: function (data) {
                options.node.html(otherPortfoliosTemplate({
                    keyName: options.keyName,
                    idDesc: options.idDesc,
                    rows: data.rows,
                    helpers: $.conpa.helpers
                }));
            }
        });
    }

    function getBestPerformingPortfolios() {
        getOtherPortfolios({
            node: $bestPerfomingPortfoliosList,
            url: '/ConPA/getBestPerformingPortfolios',
            keyName: 'Perf',
            idDesc: 'Best'
        });
    }

    function getWorstPerformingPortfolios() {
        getOtherPortfolios({
            node: $worstPerfomingPortfoliosList,
            url: '/ConPA/getWorstPerformingPortfolios',
            keyName: 'Perf',
            idDesc: 'Worst'
        });
    }

    function getLowProfileRiskPortfolios() {
        getOtherPortfolios({
            node: $lowProfileRiskPortfoliosList,
            url: '/ConPA/getLowProfileRiskPortfolios',
            keyName: 'Risk',
            idDesc: 'Low'
        });
    }

    function getHighProfileRiskPortfolios() {
        getOtherPortfolios({
            node: $highProfileRiskPortfoliosList,
            url: '/ConPA/getHighProfileRiskPortfolios',
            keyName: 'Risk',
            idDesc: 'High'
        });
    }

    function getLowProfileReturnPortfolios() {
        getOtherPortfolios({
            node: $lowProfileReturnPortfoliosList,
            url: '/ConPA/getLowProfileReturnPortfolios',
            keyName: 'Ret',
            idDesc: 'Low'
        });
    }

    function getHighProfileReturnPortfolios() {
        getOtherPortfolios({
            node: $highProfileReturnPortfoliosList,
            url: '/ConPA/getHighProfileReturnPortfolios',
            keyName: 'Ret',
            idDesc: 'High'
        });
    }

    function handleClick(e) {
        var id = $(e.target).parent().data('id');

        if (!id) {
            return false;
        }

        $('html, body').animate({ scrollTop: 0 }, 'slow');

        $.ajax({
            url: '/ConPA/getPortfolio',
            type: 'POST',
            data: {
                id: id
            },
            success: function (portfolio) {
                var model = {},
                    refdate;

                if (portfolio.error) {
                    return;
                }

                model.assets = [];
                _.each(portfolio.assets, function (asset) {
                    model.assets.push({
                        id: $.conpa.utils.rfc4122v4(),
                        symbol: asset
                    });
                });
                refdate = new Date(portfolio.ref);
                if ($.conpa.dates.isToday(refdate)) {
                    model.refdate = $.conpa.dates.yearToDate().toString();
                } else {
                    model.refdate = new Date(portfolio.ref).toString();
                }
                $.sync('conpa', model);

                $.publish('render.app.conpa');
            }
        });
    }

    function handleRender() {
        getLastCreatedPortfolios(100, 12);
        getBestPerformingPortfolios();
        getWorstPerformingPortfolios();
        getLowProfileRiskPortfolios();
        getHighProfileRiskPortfolios();
        getLowProfileReturnPortfolios();
        getHighProfileReturnPortfolios();
    }

    $('body').on('click', '.table tbody tr', handleClick);

    $.subscribe('render.dashboard.conpa', handleRender);

}(jQuery));

/*global jQuery */

(function ($) {
    'use strict';

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

    $.subscribe('crm.portfolio.conpa', handlePortfolioCRM);

}(jQuery));

/*global jQuery */

(function ($) {
    'use strict';

    var $basketPieChart = $('#basket-pie-chart'),
        $basketPieRefDateLabel = $('#basket-pie-refdate-label'),
        $basketPieYTDChart = $('#basket-pie-ytd-chart'),
        $basketPerfRefDateLabel = $('#basket-performance-refdate-label'),
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

                return assets[index] + ' ' +
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
                    $basketPieRefDateLabel.html(
                        $.conpa.dates.ymdDate(refDate) + ' Weights'
                    );
                    drawPieChart($basketPieYTDChart,
                        assets, data.optim.solution);

                    $basketPerfRefDateLabel.html(
                        $.conpa.dates.ymdDate(refDate) + ' Performance'
                    );
                    drawPerformanceChart($basketPerfYTDChart,
                        data.perf);
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

    $.subscribe('clear.portfolio.conpa', handleClearPortfolio);
    $.subscribe('optimize.portfolio.conpa', handlePortfolioOptimization);

}(jQuery));



/*global jQuery, google */

(function ($, g) {
    'use strict';

    g.load('visualization', '1', {
        packages: ['corechart'],
        callback: function () {
            var options = {
                    backgroundColor: '#eee',
                    hAxis: {title: 'Risk %'},
                    legend: 'none',
                    title: 'Graph based on the latest 100 portfolios',
                    vAxis: {title: 'Return %'}
                },
                chart = new g.visualization.ScatterChart(
                    $('#efficient-frontier').get()[0]);

            chart.setAction({
                id: "portfolioDetails",
                text: "",
                action: function () {
                    console.log(chart.getSelection());
                }
            });

            function percentageFormatter(number) {
                return (number * 100).toFixed(2) * 1;
            }

            function handleRender(e, data) {
                var dataArray = [
                    ['Risk', 'Return']
                ];

                data.rows.forEach(function (ptf) {
                    dataArray.push([
                        percentageFormatter(parseFloat(ptf.value.risk)),
                        percentageFormatter(parseFloat(ptf.value.ret))
                    ]);
                });

                chart.draw(g.visualization.arrayToDataTable(dataArray),
                    options);
            }

            $.subscribe('render.efficientfrontier.conpa', handleRender);

        }
    });

}(jQuery, google));

/*global jQuery, _ */

(function ($, _) {
    'use strict';

    var assetStatsRawTemplate =
            '<dl class="dl-horizontal">' +
            '<% _.each(fields, function (field) { %>' +
                '<dt title="<%= field.label %>">' +
                    '<%= field.label %></dt>' +
                '<dd><%= field.value %></dd>' +
            '<% }) %>' +
            '</dl>',
        assetStatsTemplate = _.template(assetStatsRawTemplate),
        $assetStatsName = $('#asset-stats-name'),
        $assetStatsList1 = $('#asset-stats-list1'),
        $assetStatsList2 = $('#asset-stats-list2');

    function getKeyStatistics(symbol) {
        $.ajax({
            url: '/ConPA/getKeyStatistics',
            type: 'POST',
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

    $.subscribe('stats.asset.conpa', handleKeyStatistics);

}(jQuery, _));


/*jslint nomen: true */
/*global jQuery, _ */

(function ($) {
    'use strict';

    var assetRawTemplate =
            '<% _.each(assets, function (asset, key, list) { %>' +
            '<li data-id="<%= asset.id %>">' +
                '<div class="well">' +
                    '<div><%= asset.symbol %></div>' +
                    '<div class="destroy"></div>' +
                '</div>' +
            '</li>' +
            '<% }) %>',
        assetTemplate = _.template(assetRawTemplate),
        $assetList = $('#asset-list');

    function handleRender() {
        $assetList.html(assetTemplate({
            assets: $.sync('conpa').assets
        }));
    }

    function destroy(e) {
        var id = $(e.target).closest('li').data('id'),
            model = $.sync('conpa');

        $.each(model.assets, function (i, asset) {
            if (asset.id === id) {
                model.assets.splice(i, 1);

                if (model.assets.length < 3) {
                    model.refdate = $.conpa.dates.yearToDate().toString();
                }

                $.sync('conpa', model);

                handleRender();

                $.publish('render.app.conpa');

                return false;
            }
        });
    }

    $assetList.on('click', '.destroy', destroy);

    $.subscribe('render.assetlist.conpa', handleRender);

}(jQuery));

/*global jQuery, YAHOO:true */

var YAHOO = {};
YAHOO.Finance = {};
YAHOO.Finance.SymbolSuggest = {};

(function ($) {
    'use strict';

    var assets = {};

    $('input').typeahead({
        items: 10,

        source: function (query, process) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'YAHOO.Finance.SymbolSuggest.ssCallback',
                data: {
                    query: query
                },
                cache: true,
                url: 'http://autoc.finance.yahoo.com/autoc'
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
                        key = asset.symbol + ' ' + asset.name +
                            ' (' + asset.type + ' - ' + asset.exchDisp + ')';

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

/*jslint bitwise: true */
/*global jQuery */

(function ($) {
    'use strict';

    $.conpa = {
        utils: {
            rfc4122v4: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                    function (c) {
                        var r = Math.random() * 16 | 0,
                            v = c === 'x' ? r : (r & 0x3 | 0x8);

                        return v.toString(16);
                    });
            }
        },

        helpers: {
            percentageFormatter: function (number) {
                return (number * 100).toFixed(2) + '%';
            },

            hyphenFormatter: function (text) {
                return text.substr(0, 5) + '...' +
                    text.substr(text.length - 5, 5);
            }
        },

        dates: {
            today: function () {
                return new Date();
            },

            isToday: function (date) {
                var today = $.conpa.dates.today(),
                    d1 = today.getDate(),
                    m1 = today.getMonth(),
                    y1 = today.getFullYear(),
                    d2 = date.getDate(),
                    m2 = date.getMonth(),
                    y2 = date.getFullYear();

                return (d1 === d2) && (m1 === m2) && (y1 === y2);
            },

            yearToDate: function () {
                return new Date($.conpa.dates.today() -
                    (1000 * 60 * 60 * 24 * 365)); // 1 year
            },
            ymdDate: function (date) {
                var d = new Date(date),
                    day = d.getDate(),
                    month = d.getMonth() + 1,
                    year = d.getFullYear();

                return year + '/' +
                    (month < 10 ? '0' + month : month) + '/' +
                    (day < 10 ? '0' + day : day);
            }
        }
    };

}(jQuery));

/*global jQuery */

(function ($) {
    'use strict';

    var App = {

        init: function () {
            var model = $.sync('conpa');


            model.assets = model.assets || [];
            model.refdate = model.refdate ||
                $.conpa.dates.yearToDate().toString();
            $.sync('conpa', {
                assets: model.assets,
                refdate: model.refdate
            });

            $('#new-asset').on('change', this.create);

            $.publish('render.dashboard.conpa');
            $.publish('render.app.conpa');
        },

        create: function (e) {
            var model = $.sync('conpa'),
                $input = $(e.target),
                val = $.trim($input.val());

            $input.val('');

            if (e.hasOwnProperty('originalEvent')) {
                return;
            }

            model.assets.push({
                id: $.conpa.utils.rfc4122v4(),
                symbol: val
            });

            $.sync('conpa', model);
            $.publish('render.app.conpa');
        },

        render: function () {
            /*jslint nomen:true */
            /*global _ */
            var model = $.sync('conpa'),
                lastAsset = _.last(model.assets);

            $.publish('clear.portfolio.conpa');
            $.publish('clear.message.conpa');

            $.publish('render.assetlist.conpa');

            if (model.assets.length) {
                $.publish('stats.asset.conpa', [lastAsset.symbol]);
            }

            $.publish('optimize.portfolio.conpa',
                [model.assets, $.conpa.dates.today().toString()]);
            $.publish('optimize.portfolio.conpa',
                [model.assets, model.refdate]);
        }
    };

    $.subscribe('render.app.conpa', App.render);

    App.init();
}(jQuery));
