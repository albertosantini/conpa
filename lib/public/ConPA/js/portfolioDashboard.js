/*global jQuery, Handlebars */

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
                    '{{#this}}' +
                    '<tr>' +
                        '<td>{{key}}</td>' +
                        '<td>{{value.ref}}</td>' +
                        '<td>{{hyphenFormatter id}}</td>' +
                        '<td>{{percentageFormatter value.perf}}</td>' +
                        '<td>{{percentageFormatter value.risk}}</td>' +
                        '<td>{{percentageFormatter value.ret}}</td>' +
                    '</tr>' +
                    '{{/this}}' +
                '</tbody>' +
            '</table>',
        otherPortfoliosRawTemplate =
            '<table class="table table-bordered table-condensed">' +
                '<thead>' +
                    '<tr>' +
                        '<th>{{keyName}}</th>' +
                        '<th>To Date</th>' +
                        '<th>{{idDesc}}</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '{{#with data}}' +
                    '{{#this}}' +
                    '<tr>' +
                        '<td>{{percentageFormatter key}}</td>' +
                        '<td>{{value.created_at}}</td>' +
                        '<td>{{hyphenFormatter id}}</td>' +
                    '</tr>' +
                    '{{/this}}' +
                    '{{/with}}' +
                '</tbody>' +
            '</table>',
        latestPortfoliosTemplate = Handlebars
                .compile(latestPortfoliosRawTemplate),
        otherPortfoliosTemplate = Handlebars
                .compile(otherPortfoliosRawTemplate),
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
                $latestPortfoliosList.html(
                    latestPortfoliosTemplate(data.rows)
                );
            }
        });
    }

    function getOtherPortfolios(options) {
        $.ajax({
            url: options.url,
            success: function (data) {
                options.node.html(
                    otherPortfoliosTemplate({
                        keyName: options.keyName,
                        idDesc: options.idDesc,
                        data: data.rows
                    })
                );
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


