/*global jQuery, google */

(function ($, g) {
    'use strict';

    g.load('visualization', '1', {packages: ['corechart']});

    g.setOnLoadCallback(function () {
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

            chart.draw(g.visualization.arrayToDataTable(dataArray), options);
        }

        $.subscribe('render.efficientfrontier.conpa', handleRender);
    });

}(jQuery, google));
