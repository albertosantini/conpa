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
        $bestPerfomingPortfoliosList = $('#best-performing-portfolios-list');

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

    function getBestPerformingPortfolios() {
        $.ajax({
            url: "/ConPA/getBestPerformingPortfolios",
            success: function (data) {
                $bestPerfomingPortfoliosList.html(
                    otherPortfoliosTemplate({
                        keyName: "Perf",
                        idDesc: "Best Performing",
                        data: data.rows
                    })
                );
            }
        });
    }

    function handleRender() {
        getLastCreatedPortfolios();
        getBestPerformingPortfolios();
    }

    $.subscribe("render.dashboard.conpa", handleRender);

}(jQuery));


