/*jslint nomen: true */
/*global jQuery, _ */

(function ($) {
    'use strict';

    var latestPortfoliosRawTemplate =
            '<table class="table table-bordered table-condensed">' +
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
            '<table class="table table-bordered table-condensed">' +
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

    function getLastCreatedPortfolios() {
        $.ajax({
            url: '/ConPA/getLastCreatedPortfolios',
            success: function (data) {
                _.extend(data, $.conpa.helpers);
                $latestPortfoliosList.html(latestPortfoliosTemplate(data));
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
            success: function (data) {
                var model = {},
                    portfolio = JSON.parse(data),
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
        getLastCreatedPortfolios();
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
