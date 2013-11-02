/*global jQuery, google */

(function ($, g) {
    'use strict';

    g.load('visualization', '1', {
        packages: ['corechart'],
        callback: function () {
            function percentageFormatter(number) {
                return (number * 100).toFixed(2) * 1;
            }

            function handleLatestPtfRender(e, data) {
                var options = {
                        backgroundColor: 'transparent',
                        title: 'Graph based on the latest 100 portfolios',
                        hAxis: {title: 'Risk %'},
                        vAxis: {title: 'Return %'},
                        legend: 'none'
                    },
                    dataArray = [],
                    dataTable = new google.visualization.DataTable(),
                    chart = new g.visualization.ScatterChart(
                        $('#efficient-frontier').get()[0]);

                dataTable.addColumn('number', 'Risk');
                dataTable.addColumn('number', 'Return');
                dataTable.addColumn({type: 'string', role: 'tooltip'});

                data.rows.forEach(function (ptf) {
                    var risk = percentageFormatter(parseFloat(ptf.value.risk)),
                        ret = percentageFormatter(parseFloat(ptf.value.ret)),
                        perf = percentageFormatter(parseFloat(ptf.value.perf));

                    dataArray.push([risk, ret,
                        'Risk: ' + risk + '%\n' +
                        'Return: ' + ret + '%\n' +
                        'Performance: ' + (perf ? perf + '%' : 'n.a')
                    ]);
                });
                dataTable.addRows(dataArray);

                chart.draw(dataTable, options);
            }

            function handlePieChartRender(e, selector, assets, weights) {
                var options = {
                        backgroundColor: 'transparent',
                        pieSliceText: 'label',
                        pieHole: 0.2,
                        legend: 'none'
                    },
                    dataArray = [],
                    dataTable = new g.visualization.DataTable(),
                    chart = new g.visualization.PieChart($(selector).get()[0]);

                assets.forEach(function (asset, index) {
                    dataArray.push([asset, weights[index]]);
                });

                dataTable.addColumn('string', 'Asset');
                dataTable.addColumn('number', 'Weight');

                dataTable.addRows(dataArray);

                chart.draw(dataTable, options);
            }

            function handlePerfChartRender(e, selector, performances) {
                var options = {
                        backgroundColor: 'transparent',
                        legend: 'none'
                    },
                    dataArray = [],
                    dataTable = new g.visualization.DataTable(),
                    chart = new g.visualization.ColumnChart(
                        $(selector).get()[0]);

                performances.forEach(function (performance, index) {
                    dataArray.push([index, performance,
                        'Perf: ' + percentageFormatter(performance) + '%'
                    ]);
                });

                dataTable.addColumn('number', 'Week');
                dataTable.addColumn('number', 'Performance');
                dataTable.addColumn({type: 'string', role: 'tooltip'});

                dataTable.addRows(dataArray);

                chart.draw(dataTable, options);
            }

            $.subscribe('render.latestptfschart.conpa', handleLatestPtfRender);
            $.subscribe('render.piechart.conpa', handlePieChartRender);
            $.subscribe('render.perfchart.conpa', handlePerfChartRender);
        }
    });

}(jQuery, google));
