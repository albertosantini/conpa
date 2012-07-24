/*jslint nomen: true */
/*global jQuery, _ */

(function ($) {
    "use strict";

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
                    '<tr>' +
                        '<td><%= row.key %></td>' +
                        '<td><%= row.value.ref %></td>' +
                        '<td><%= hyphenFormatter(row.id) %></td>' +
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
                        '<th><% idDesc %></th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<% _.each(rows, function (row, key, list) { %>' +
                    '<tr>' +
                        '<td><%= helpers.percentageFormatter(row.key) %></td>' +
                        '<td><%= row.value.created_at %></td>' +
                        '<td><%= helpers.hyphenFormatter(row.id) %></td>' +
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
            url: "/ConPA/getLastCreatedPortfolios",
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
            url: "/ConPA/getBestPerformingPortfolios",
            keyName: "Perf",
            idDesc: "Best Performing"
        });
    }

    function getWorstPerformingPortfolios() {
        getOtherPortfolios({
            node: $worstPerfomingPortfoliosList,
            url: "/ConPA/getWorstPerformingPortfolios",
            keyName: "Perf",
            idDesc: "Worst Performing"
        });
    }

    function getLowProfileRiskPortfolios() {
        getOtherPortfolios({
            node: $lowProfileRiskPortfoliosList,
            url: "/ConPA/getLowProfileRiskPortfolios",
            keyName: "Risk",
            idDesc: "Low Profile Risk"
        });
    }

    function getHighProfileRiskPortfolios() {
        getOtherPortfolios({
            node: $highProfileRiskPortfoliosList,
            url: "/ConPA/getHighProfileRiskPortfolios",
            keyName: "Risk",
            idDesc: "High Profile Risk"
        });
    }

    function getLowProfileReturnPortfolios() {
        getOtherPortfolios({
            node: $lowProfileReturnPortfoliosList,
            url: "/ConPA/getLowProfileReturnPortfolios",
            keyName: "Ret",
            idDesc: "Low Profile Ret"
        });
    }

    function getHighProfileReturnPortfolios() {
        getOtherPortfolios({
            node: $highProfileReturnPortfoliosList,
            url: "/ConPA/getHighProfileReturnPortfolios",
            keyName: "Ret",
            idDesc: "High Profile Ret"
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

    $.subscribe("render.dashboard.conpa", handleRender);

}(jQuery));


