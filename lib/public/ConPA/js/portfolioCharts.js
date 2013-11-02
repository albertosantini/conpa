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
                        backgroundColor: '#eee',
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

            $.subscribe('render.latestptfschart.conpa', handleLatestPtfRender);
        }
    });

}(jQuery, google));
