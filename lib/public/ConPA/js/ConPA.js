/*jslint unparam: true, sloppy: true */
/*global YUI, YAHOO:true */

YUI({
    'yui2': '2.9.0',
    '2in3': '4',
    'ignore': [
        'yui2-skin-sam-container',
        'yui2-skin-sam-menu',
        'yui2-skin-sam-button',
        'yui2-skin-sam-calendar',
        'yui2-skin-sam-datatable',
        'yui2-skin-sam-layout',
        'yui2-skin-sam-slider',
        'skin-sam-widget-base',
        'skin-sam-tabview',
        'skin-sam-autocomplete-list',
        'skin-sam-datatable-base',
        'skin-sam-widget-stack'
    ],
    'groups': {
        'js': {
            'base': 'js/',
            'modules': {
                'conpa-mostusedsymbols': {
                    path: 'ConPAMostUsedSymbols/ConPAMostUsedSymbols.js'
                },
                'conpa-assetsearch': {
                    path: 'ConPAAssetSearch/ConPAAssetSearch.js',
                    'requires': [
                        'yui2-utilities',
                        'yui2-datasource',
                        'yui2-container',
                        'yui2-menu',
                        'yui2-button',
                        'yui2-calendar',
                        'yui2-json',
                        'yui2-swf',
                        'yui2-charts',
                        'yui2-datatable',
                        'yui2-layout',
                        'yui2-slider',
                        'node-base',
                        'io-base',
                        'querystring-stringify-simple',
                        'get',
                        "tabview",
                        "datasource-get",
                        "datasource-jsonschema",
                        "autocomplete",
                        "datasource-local",
                        "datasource-jsonschema",
                        "datatable-datasource",
                        "charts",
                        "cookie"
                    ]
                }
            }
        }
    }
}).use('conpa-mostusedsymbols', 'conpa-assetsearch', function (Y) {
    YAHOO = Y.YUI2;

    YAHOO.widget.Chart.SWFURL =
        "http://yui.yahooapis.com/2.9.0/build/charts/assets/charts.swf";

    YAHOO.namespace("proplus.conpa");

    YAHOO.proplus.conpa.COOKIE = "proplus.conpa.basket";

    YAHOO.proplus.conpa.init = function () {
        var Dom = YAHOO.util.Dom,
            now,
            tabView_Main,
            myDataTable,
            waitPanel,
            pieChartPanel = null,
            performanceChartPanel = null,
            scriptPanel = null,
            scriptHandle = null,
            pieChart,
            perfDS,
            perfChart,
            assetStatsPanel = null,
            assetStatsLayout = null,
            graphPanel = null,
            oGetOptimalPortfolioButton,
            oReferenceDateButton,
            nTargetReturn,
            lastPortfolioName = "",
            previousPortfolioName = "";

        now = new Date();

        tabView_Main = new Y.TabView({srcNode: '#tab_Main'});
        tabView_Main.render();

        function percentage(n) {
            return YAHOO.util.Number.format(n * 100, {
                prefix: "",
                decimalPlaces: 2,
                decimalSeparator: ".",
                thousandsSeparator: ","
            }) + "%";
        }

        function labelReferenceDateButton(date) {
            return date.getDate() + " " +
                YAHOO.widget.Calendar.DEFAULT_CONFIG.MONTHS_SHORT
                .value[date.getMonth()] + " " +
                date.getFullYear();
        }

        function resetOptimalWeigths(dt) {
            var i, products, nProducts, record, recordData;

            products = dt.getRecordSet();
            nProducts = products.getLength();
            for (i = 0; i < nProducts; i = i + 1) {
                record = products.getRecord(i);
                recordData = record.getData();
                recordData.optimalWeight = 0;
                dt.updateRow(record, recordData);
            }
            if (pieChartPanel !== null) {
                pieChartPanel.hide();
            }
            if (performanceChartPanel !== null) {
                performanceChartPanel.hide();
            }

            if (assetStatsPanel !== null) {
                assetStatsPanel.hide();
            }
            if (scriptPanel !== null) {
                scriptPanel.hide();
            }
            if (scriptHandle !== null) {
                Y.detach(scriptHandle);
            }

            Y.one('#portfolioId').set('innerHTML', "Id: none");
        }

        function initPanels() {
            var panel,
                helpPanel,
                helpHeader = "Help",
                helpBody = "<iframe src='docs/ConPA_help.html' width='100%' height='100%' frameborder='0'/>";

            panel = new YAHOO.widget.SimpleDialog('alert', {
                fixedcenter: true,
                visible: false,
                modal: true,
                width: '256px',
                constraintoviewport: true,
                icon: YAHOO.widget.SimpleDialog.ICON_WARN,
                buttons: [{
                    text: 'OK',
                    handler: function () {
                        panel.hide();
                    },
                    isDefault: true
                }]
            });
            panel.setHeader('Alert');
            panel.setBody('Notta');
            panel.render("body");

            YAHOO.proplus.conpa.alert = function (str) {
                var kl_27 = new YAHOO.util.KeyListener("body", {
                    keys: 27
                }, {
                    fn: panel.hide,
                    scope: panel,
                    correctScope: true
                });
                kl_27.enable();

                panel.setBody(str);
                panel.cfg.setProperty('icon', YAHOO.widget.SimpleDialog.ICON_WARN);
                panel.bringToTop();
                panel.show();
            };

            waitPanel = new YAHOO.widget.Panel("waitPanel", {
                width: "240px",
                fixedcenter: true,
                close: false,
                draggable: false,
                zIndex: 10000,
                modal: true,
                visible: false
            });
            waitPanel.setHeader("Please wait...");
            waitPanel.setBody("<img width= \"220\" height=\"19\" " +
                "src=\"images/rel_interstitial_loading.gif\"/>");
            waitPanel.render("body");

            helpPanel = new YAHOO.widget.Panel("helpPanel", {
                visible: false,
                constraintoviewport: true,
                draggable: true,
                close: true,
                fixedcenter: true,
                width: '400px',
                height: '500px',
                zIndex: 99
            });
            helpPanel.setHeader(helpHeader);
            helpPanel.setBody(helpBody);
            helpPanel.setFooter("");
            helpPanel.render(Dom.get('bd'));

            YAHOO.util.Event.addListener("help", "click", function () {
                helpPanel.setBody(helpBody);
                helpPanel.bringToTop();
                helpPanel.show();
            });

            scriptPanel = new YAHOO.widget.Panel("scriptPanel", {
                visible: false,
                modal: false,
                constraintoviewport: true,
                draggable: true,
                close: true,
                fixedcenter: true,
                width: '512px',
                height: '394px'
            });
            scriptPanel.setHeader("R Script");
            scriptPanel.setBody("");
            scriptPanel.setFooter("");
            scriptPanel.render(Dom.get('bd'));

            Y.on("click", function () {
                var scriptRMsg = "#R Script is empty.<br />" +
                    "#Firstly you should get an optimal portfolio.<br />";

                scriptPanel.setBody(scriptRMsg);
                scriptPanel.bringToTop();
                scriptPanel.show();
            }, "#getRScript");
        }

        function createPieChart() {
            if (pieChartPanel !== null) {
                pieChartPanel.hide();
                pieChartPanel.destroy();
            }

            pieChartPanel = new YAHOO.widget.Panel("pieChartPanel", {
                width: "256px",
                fixedcenter: false,
                x: Dom.getXY('tab_Advisory')[0] + 10 + 450,
                y: 300,
                constraintoviewport: true,
                close: true,
                dragOnly: true,
                modal: false,
                visible: false
            });

            pieChartPanel.setHeader("Optimal Portfolio Pie");
            pieChartPanel.setBody("<div id=\"pieChart\" " +
                    "style=\"height:200px\"></div>");
            pieChartPanel.render("tab_Advisory");
            pieChartPanel.subscribe("hide", function () {
                pieChart.destroy();
            });

            pieChart = new Y.Chart({
                categoryKey: "asset",
                seriesKey: ["weigth"],
                type: "pie",
                dataProvider: [],
                seriesCollection: [
                    {
                        categoryKey: "asset",
                        valueKey: "weigth"
                    }
                ],
                tooltip: {
                    markerLabelFunction: function (cItem, vItem, iItem, s, sI) {
                        return cItem.value + " " + percentage(vItem.value);
                    }
                }
            });
        }

        function createPerformanceChart() {
            var perfSeriesDef, perfTimeAxis;

            if (performanceChartPanel !== null) {
                performanceChartPanel.hide();
                performanceChartPanel.destroy();
            }

            performanceChartPanel = new YAHOO.widget.Panel("performanceChartPanel", {
                width: "400px",
                fixedcenter: false,
                x: Dom.getXY('tab_Advisory')[0] + 10,
                y: 300,
                constraintoviewport: true,
                close: true,
                dragOnly: true,
                modal: false,
                visible: false
            });

            performanceChartPanel.setHeader("Optimal Portfolio Performance");
            performanceChartPanel.setBody("<div id=\"performanceChart\" " +
                    "style=\"height:200px\"></div>");
            performanceChartPanel.render("tab_Advisory");

            perfDS = new YAHOO.util.DataSource([]);
            perfDS.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
            perfDS.dataType = YAHOO.util.DataSource.TYPE_JSARRAY;
            perfDS.responseSchema = {
                fields: ["performance", "week"]
            };

            perfSeriesDef = [{
                displayName: "Performance",
                yField: "performance"
            }];

            YAHOO.proplus.conpa.formatTimeData = function (value, major) {
                var arr = value.toString().split(" ");
                return arr[1];
            };

            perfTimeAxis = new YAHOO.widget.TimeAxis();
            perfTimeAxis.labelFunction = YAHOO.proplus.conpa.formatTimeData;
            perfTimeAxis.majorTimeUnit = "month";

            YAHOO.proplus.conpa.getDataTipTextPerf = function (item, index, series) {
                var toolTipText = labelReferenceDateButton(item.week);

                toolTipText = toolTipText + "\n" +
                    YAHOO.util.Number.format(item[series.yField], {
                        suffix: "%",
                        thousandsSeparator: ",",
                        decimalPlaces: 2
                    });

                return toolTipText;
            };

//             perfChart = new Y.Chart({
//                 categoryKey: "week",
//                 categoryType: "time",
//                 dataProvider: []
//                 tooltip: {
//                     markerLabelFunction: function (cItem, vItem, iItem, s, sI) {
//                         return cItem.value + " " + percentage(vItem.value);
//                     }
//                 }
//             });

            perfChart = new YAHOO.widget.LineChart("performanceChart", perfDS, {
                xField: "week",
                xAxis: perfTimeAxis,
                series: perfSeriesDef,
                dataTipFunction: YAHOO.proplus.conpa.getDataTipTextPerf,
                expressInstall: "assets/expressinstall.swf",
                wmode: "opaque"
            });
        }

        function initBasketDataTable() {
            var myColumnDefs, myDataSource, keyStats = [], volStats = [];

            myColumnDefs = [
                {
                    key: "remove",
                    label: "",
                    formatter: function (el, oRecord, oColumn, oData) {
                        el.innerHTML = "<img width=\"16\" height=\"16\" " +
                            "src=\"images/cancel.png\"/>";

                        el.style.cursor = 'pointer';
                    }
                },
                {
                    key: "symbol",
                    label: "Symbol",
                    formatter: function (el, oRecord, oColumn, oData) {
                        el.innerHTML = oData;
                        el.title = oRecord.getData('name');
                        el.style.cursor = 'pointer';
                    },
                    sortable: true
                },
                {
                    key: "name",
                    label: "Name",
                    width: 256,
                    sortable: true
                },
                {key: "type", label: "T", sortable: true},
                {key: "exchDisp", label: "Market", sortable: true},
                {
                    key: "optimalWeight",
                    label: "O W %",
                    width: 48,
                    formatter: function (el, oRecord, oColumn, oData) {
                        if (!isNaN(oData)) {
                            oData = oData * 100;
                            el.innerHTML = YAHOO.util.Number.format(oData, {
                                prefix: "",
                                decimalPlaces: 2,
                                decimalSeparator: ".",
                                thousandsSeparator: ","
                            });
                            el.align = "right";
                        }
                    },
                    sortable: true
                },
                {
                    key: "min",
                    label: "Min %",
                    width: 48,
                    formatter: function (el, oRecord, oColumn, oData) {
                        if (isNaN(oData) || oData < 0) {
                            oData = 0;
                        }
                        if (oData > 100) {
                            oData = 100;
                        }
                        el.innerHTML = YAHOO.util.Number.format(oData, {
                            prefix: "",
                            decimalPlaces: 2,
                            decimalSeparator: ".",
                            thousandsSeparator: ","
                        });
                        el.align = "right";

                        if (oData > 0) {
                            el.style.backgroundColor = "#FFA0A0";
                        } else {
                            el.style.backgroundColor = "#FFFFFF";
                        }
                    },
                    sortable: true,
                    editor: "textbox",
                    editorOptions: {
                        disableBtns: true,
                        validator: function (newData, oldData) {
                            if (newData !== oldData) {
                                YAHOO.widget.DataTable.validateNumber(newData);
                            }
                            return newData;
                        }
                    }
                },
                {
                    key: "max",
                    label: "Max %",
                    width: 48,
                    formatter: function (el, oRecord, oColumn, oData) {
                        if (isNaN(oData) || oData > 100) {
                            oData = 100;
                        }
                        if (oData < 0) {
                            oData = 0;
                        }
                        el.innerHTML = YAHOO.util.Number.format(oData, {
                            prefix: "",
                            decimalPlaces: 2,
                            decimalSeparator: ".",
                            thousandsSeparator: ","
                        });
                        el.align = "right";
                        if (oData < 100) {
                            el.style.backgroundColor = "#FFA0A0";
                        } else {
                            el.style.backgroundColor = "#FFFFFF";
                        }
                    },
                    sortable: true,
                    editor: "textbox",
                    editorOptions: {
                        disableBtns: true,
                        validator: function (newData, oldData) {
                            if (newData !== oldData) {
                                YAHOO.widget.DataTable.validateNumber(newData);
                            }
                            return newData;
                        }
                    }
                }
            ];

            myDataSource = new YAHOO.util.DataSource([]);
            myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
            myDataSource.responseSchema = {
                fields: ["symbol", "name", "type", "exchDisp"]
            };

            myDataTable = new YAHOO.widget.DataTable("basket",
                myColumnDefs,
                myDataSource,
                {
                    caption: "",
                    selectionMode: "single"
                }
                );

            myDataTable.subscribe("cellMouseoutEvent", function (oArgs) {
                graphPanel.hide();
            });

            myDataTable.subscribe("cellMouseoverEvent", function (oArgs) {
                var column, firstChar, graphUrl, imgTag, record, symbol, target;

                target = oArgs.target;
                column = this.getColumn(target);

                if (column.key === "name") {
                    record = this.getRecord(target);
                    symbol = record.getData("symbol").toLowerCase();
                    graphUrl = "http://chart.finance.yahoo.com/c/bb/";
                    firstChar = symbol.substr(0, 1);
                    if (firstChar === "^") {
                        firstChar = "_";
                    }
                    firstChar.toLowerCase();
                    imgTag = "<img src=\"" + graphUrl + firstChar + "/" +
                        symbol + "\" width=\"192\" height=\"96\" alt=\"" +
                        symbol + "\">";

                    if (graphPanel !== null) {
                        graphPanel.destroy();
                    }

                    graphPanel = new YAHOO.widget.Panel("graphPanel", {
                        context: [this.getTdEl(target), "tl", "br"],
                        fixedcenter: false,
                        close: false,
                        draggable: false,
                        modal: false,
                        visible: false
                    });
                    graphPanel.setBody(imgTag);
                    graphPanel.render("tab_Advisory");
                    graphPanel.show();
                }
            });

            myDataTable.subscribe("cellClickEvent", function (ev) {
                var target, column, symbol, type,
                    callLineDS, callLineChart, callSeriesDef,
                    putLineDS, putLineChart, putSeriesDef;

                target = ev.target;
                column = this.getColumn(target);

                if (column.key === "remove") {
                    if (this.getRecordSet().getLength() > 0) {

                        this.deleteRow(this.getRecord(target));
                        resetOptimalWeigths(this);

                        oReferenceDateButton.set("label",
                            labelReferenceDateButton(now));
                        oReferenceDateButton.date = now;
                    }
                }

                function exitGetKeyStatistics() {
                    var i, stats = "", el;

                    waitPanel.hide();

                    if (keyStats[symbol] !== undefined) {
                        for (i = 0; i < keyStats[symbol].length; i = i + 1) {
                            stats += "<div class=\"label\">" +
                                keyStats[symbol][i].inputParams.label +
                                "<\/div>";
                            stats += "<div class=\"value\">" +
                                keyStats[symbol][i].inputParams.value +
                                "<\/div>";
                        }
                        el = Dom.get('formKeyStatistics');
                        el.innerHTML = stats;
                    } else {
                        el = Dom.get('formKeyStatistics');
                        el.innerHTML = "Key Statistics not available for " + symbol;
                    }

                    function exitGetImpliedVolatility() {
                        var vol = volStats[symbol];

                        callLineDS.liveData = vol.callVolatility;
                        callLineChart.set('dataSource', callLineDS);
                        putLineDS.liveData = vol.putVolatility;
                        putLineChart.set('dataSource', putLineDS);
                        el = Dom.get('impliedVolHeader');
                        el.innerHTML = "<b>Call and Put Implied Volatilty for " +
                            symbol + "<br />" +
                            " strike " + vol.strike + " - " +
                            " riskfree " + vol.riskFree * 100 + "% 3 months - " +
                            " expire at close " + vol.expDate +
                            "</b>";
                        Dom.setStyle('loading', 'display', 'none');
                        Dom.setStyle('putVolChart', 'display', 'block');
                        Dom.setStyle('callVolChart', 'display', 'block');
                    }

                    if (volStats[symbol] === undefined) {
                        Y.io("/ConPA/getImpliedVolatility", {
                            method: "POST",
                            timeout: 10000,
                            data: {
                                "symbol": symbol
                            },
                            on: {
                                success: function (id, o) {
                                    var res = JSON.parse(o.responseText);
                                    volStats[symbol] = res;
                                    if (volStats[symbol].callVolatility.length === 0) {
                                        delete volStats[symbol];
                                        Dom.setStyle('loading', 'display', 'none');
                                        el = Dom.get('callVolChart');
                                        el.innerHTML = "Vol Statistics not available for " + symbol;
                                        el = Dom.get('putVolChart');
                                        el.innerHTML = "Vol Statistics not available for " + symbol;
                                        Dom.setStyle('putVolChart', 'display', 'block');
                                        Dom.setStyle('callVolChart', 'display', 'block');
                                    } else {
                                        exitGetImpliedVolatility();
                                    }
                                }
                            }
                        });
                    } else {
                        exitGetImpliedVolatility();
                    }

                    assetStatsPanel.bringToTop();
                    assetStatsPanel.show();
                }

                if (column.key === "symbol") {
                    symbol = this.getRecord(target).getData("symbol");
                    type = this.getRecord(target).getData("type");

                    if (type !== "S") {
                        YAHOO.proplus.conpa.alert("Key Statistics not available for " + symbol);
                        return;
                    }

                    if (assetStatsPanel !== null) {
                        assetStatsLayout.destroy();
                        assetStatsPanel.destroy();
                    }

                    assetStatsPanel = new YAHOO.widget.Panel('assetStatsPanel', {
                        x: 400,
                        y: 290,
                        width: "825px",
                        height: "460px",
                        constraintoviewport: true,

                        fixedcenter: false,
                        visible: false
                    });
                    assetStatsPanel.setHeader("Key Statistics for " + symbol);
                    assetStatsPanel.setBody("<div id='layoutKeyStatistics'></div>");
                    assetStatsPanel.render("tab_Advisory");

                    assetStatsLayout = new YAHOO.widget.Layout('layoutKeyStatistics', {
                        height: (assetStatsPanel.body.offsetHeight - 20),
                        units: [
                            {
                                position: 'left',
                                width: 290,
                                body: "<div id='formKeyStatistics'></div>",
                                gutter: '1'
                            },
                            {
                                position: 'center',
                                width: 535,
                                body: "<div id=\"impliedVolHeader\"></div>" +
                                    "<div id=\"loading\"><b>Calculating implied volatility...</b><br /><img width= \"220\" height=\"19\" src=\"images/rel_interstitial_loading.gif\" /></div>" +
                                    "<div id=\"callVolChart\" style=\"height:200px\">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can install the latest version at the <a href=\"http://www.adobe.com/go/getflashplayer\">Adobe Flash Player Download Center<\/a>.<\/p><\/div>" +
                                    "<div id=\"putVolChart\" style=\"height:200px\">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can install the latest version at the <a href=\"http://www.adobe.com/go/getflashplayer\">Adobe Flash Player Download Center<\/a>.<\/p><\/div>",
                                gutter: '1'
                            }
                        ]
                    });
                    assetStatsLayout.render();
                    Dom.setStyle('putVolChart', 'display', 'none');
                    Dom.setStyle('callVolChart', 'display', 'none');

                    YAHOO.proplus.conpa.getDataTipTextLine = function (item, index, series) {
                        var toolTipText = "strike: " + item.strike +
                            " - ask: " +
                            (item.ask ? YAHOO.util.Number.format(item.ask, {
                                decimalPlaces: 2
                            }) : "N/A") +
                            " - bid: " +
                            (item.bid ? YAHOO.util.Number.format(item.bid, {
                                decimalPlaces: 2
                            }) : "N/A");

                        return toolTipText;
                    };

                    callLineDS = new YAHOO.util.DataSource([]);
                    callLineDS.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
                    callLineDS.dataType = YAHOO.util.DataSource.TYPE_JSARRAY;
                    callLineDS.responseSchema = {
                        fields: ["strike", "ask", "bid"]
                    };

                    callSeriesDef = [
                        { displayName: "Ask Call Vol", yField: "ask" },
                        { displayName: "Bid Call Vol", yField: "bid" }
                    ];

                    callLineChart = new YAHOO.widget.LineChart("callVolChart", callLineDS, {
                        xField: "strike",
                        series: callSeriesDef,
                        style: {
                            xAxis: {
                                majorTicks: {
                                    display: "inside",
                                    length: 3,
                                    size: 1
                                },
                                minorTicks: {
                                    display: "inside",
                                    length: 2
                                },
                                labelRotation: -45
                            },
                            padding: 20,
                            legend: {
                                display: "right",
                                padding: 10,
                                spacing: 5,
                                font: {
                                    family: "Arial",
                                    size: 9
                                }
                            }
                        },
                        dataTipFunction: YAHOO.proplus.conpa.getDataTipTextLine,
                        expressInstall: "assets/expressinstall.swf",
                        wmode: "opaque"
                    });

                    putLineDS = new YAHOO.util.DataSource([]);
                    putLineDS.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
                    putLineDS.dataType = YAHOO.util.DataSource.TYPE_JSARRAY;
                    putLineDS.responseSchema = {
                        fields: ["strike", "ask", "bid"]
                    };

                    putSeriesDef = [
                        { displayName: "Ask Put Vol", yField: "ask" },
                        { displayName: "Bid Put Vol", yField: "bid" }
                    ];

                    putLineChart = new YAHOO.widget.LineChart("putVolChart", putLineDS, {
                        xField: "strike",
                        series: putSeriesDef,
                        style: {
                            xAxis: {
                                majorTicks: {
                                    display: "inside",
                                    length: 3,
                                    size: 1
                                },
                                minorTicks: {
                                    display: "inside",
                                    length: 2
                                },
                                labelRotation: -45
                            },
                            padding: 20,
                            legend: {
                                display: "right",
                                padding: 10,
                                spacing: 5,
                                font: {
                                    family: "Arial",
                                    size: 9
                                }
                            }
                        },
                        dataTipFunction: YAHOO.proplus.conpa.getDataTipTextLine,
                        expressInstall: "assets/expressinstall.swf",
                        wmode: "opaque"
                    });

                    waitPanel.setHeader("Retrieving Key Statistics...");
                    waitPanel.show();

                    if (keyStats[symbol] === undefined) {
                        Y.io("/ConPA/getKeyStatistics", {
                            method: "POST",
                            timeout: 10000,
                            data: {
                                "symbol": symbol
                            },
                            on: {
                                success: function (id, o) {
                                    var res = JSON.parse(o.responseText);
                                    keyStats[symbol] = res;
                                    if (keyStats[symbol].length === 0) {
                                        delete keyStats[symbol];
                                    }
                                    exitGetKeyStatistics();
                                },
                                failure: function (id, o) {
                                    waitPanel.hide();
                                    Dom.setStyle('loading', 'display', 'none');
                                    YAHOO.proplus.conpa.alert("getKeyStatistics: failed");
                                }
                            }
                        });
                    } else {
                        exitGetKeyStatistics();
                    }
                }
                this.onEventShowCellEditor(ev);
            });

            myDataTable.subscribe("editorSaveEvent", function (oArgs) {
                resetOptimalWeigths(this);
                this.saveCellEditor();
            });
        }

        function getRScriptClick(e, source) {
            var rScript = "# COPY & PASTE IN R CONSOLE<br /><br />" +
                "<pre>" + source + '</pre>';

            scriptPanel.setBody(rScript);
            scriptPanel.render("tab_Advisory");
            scriptPanel.show();
        }

        function initGetOptimalPortfolio() {
            var referenceDate, ptfData;

            oGetOptimalPortfolioButton = new YAHOO.widget.Button("getOptimalPortfolio");

            function onGetOptimalPortfolioClick() {
                var i, products, nProducts, record, recordData,
                    prods = [], lows = [], highs = [],
                    targetReturn, perfData = [], pieData = [];

                products = myDataTable.getRecordSet();
                nProducts = products.getLength();
                if (nProducts < 3) {
                    YAHOO.proplus.conpa.alert('You need at least 3 assets.');
                    return;
                }
                if (nProducts > 10) {
                    YAHOO.proplus.conpa.alert('You can insert maximum 10 assets.');
                    return;
                }

                for (i = 0; i < nProducts; i = i + 1) {
                    prods[i] = products.getRecord(i).getData("symbol");
                    lows[i] = products.getRecord(i).getData("min") / 100;
                    highs[i] = -products.getRecord(i).getData("max") / 100;
                }

                if (nTargetReturn !== 0) { // from annual to weekly
                    targetReturn = Math.pow((nTargetReturn + 1), (1 / 52)) - 1;
                }

                referenceDate = oReferenceDateButton.date;
                referenceDate.setHours(12);
                referenceDate.setMinutes(0);
                referenceDate.setSeconds(0);

                scriptPanel.hide();

                waitPanel.setHeader("Optimizing portfolio...");
                waitPanel.show();
                oGetOptimalPortfolioButton.set("disabled", true);

                function exitGetOptimalPortfolio() {
                    oGetOptimalPortfolioButton.set("disabled", false);
                    waitPanel.hide();
                }

                ptfData = {
                    "prods": prods,
                    "referenceDate": referenceDate.toString(),
                    "targetReturn": targetReturn,
                    "lows": lows,
                    "highs": highs
                };

                Y.io("/ConPA/getScriptOptimalPortfolio", {
                    method: "POST",
                    timeout: 10000,
                    data: ptfData,
                    on: {
                        success: function (id, o) {
                            var source = o.responseText;

                            if (scriptHandle !== null) {
                                Y.detach(scriptHandle);
                            }
                            scriptHandle = Y.on("click", getRScriptClick,
                                "#getRScript",
                                null,
                                source);
                        }
                    }
                });

                Y.io("/ConPA/getOptimalPortfolio", {
                    method: "POST",
                    timeout: 10000,
                    data: ptfData,
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);

                            if (res.message !== "") {
                                YAHOO.proplus.conpa.alert(res.message);
                                exitGetOptimalPortfolio();
                                return;
                            }

                            for (i = 0; i < nProducts; i = i + 1) {
                                record = products.getRecord(i);
                                recordData = record.getData();
                                recordData.optimalWeight = res.optim.solution[i];
                                myDataTable.updateRow(record, recordData);

                                pieData[i] = {
                                    asset: prods[i],
                                    weigth: res.optim.solution[i]
                                };

                                Y.Cookie.setSubs(YAHOO.proplus.conpa.COOKIE + "." +
                                    recordData.symbol, recordData, {
                                        expires: YAHOO.widget.DateMath.add(new Date(),
                                            YAHOO.widget.DateMath.DAY, 30)
                                    });
                            }

                            Y.Cookie.set(YAHOO.proplus.conpa.COOKIE +
                                ".targetReturn", nTargetReturn, {
                                    expires: YAHOO.widget.DateMath.add(new Date(),
                                        YAHOO.widget.DateMath.DAY, 30)
                                });
                            Y.Cookie.set(YAHOO.proplus.conpa.COOKIE +
                                ".referenceDate", referenceDate, {
                                    expires: YAHOO.widget.DateMath.add(new Date(),
                                        YAHOO.widget.DateMath.DAY, 30)
                                });
                            Y.Cookie.set(YAHOO.proplus.conpa.COOKIE, prods, {
                                expires: YAHOO.widget.DateMath.add(new Date(),
                                    YAHOO.widget.DateMath.DAY, 30)
                            });

                            createPieChart();
                            pieChart.set('dataProvider', pieData);
                            pieChart.render('#pieChart');
                            pieChartPanel.show();

                            if (res.perf && res.perf.length > 0) {
                                perfData[0] = {
                                    performance: 0,
                                    week: referenceDate
                                };
                                for (i = 0; i < res.perf.length; i = i + 1) {
                                    perfData[i + 1] = {
                                        performance: res.perf[i] * 100,
                                        week: YAHOO.widget.DateMath.add(referenceDate,
                                                YAHOO.widget.DateMath.WEEK, i + 1)
                                    };
                                }
                                createPerformanceChart();
                                perfDS.liveData = perfData;
    //                             perfChart.set('dataProvider', perfData);
    //                             perfChart.render('#performanceChart');
                                perfChart.set('dataSource', perfDS);
                                performanceChartPanel.show();
                            } else {
                                res.perf = [];
                            }

                            Y.io("/ConPA/putPortfolioOnCRM", {
                                method: "POST",
                                timeout: 10000,
                                data: {
                                    "symbols": prods,
                                    "weights": res.optim.solution,
                                    "ref": referenceDate.toString(),
                                    "ret": res.optim.pm,
                                    "risk": res.optim.ps,
                                    "perf": res.perf,
                                    "highs": highs,
                                    "lows": lows

                                },
                                on: {
                                    success: function (ident, o) {
                                        var stats, id;

                                        id = o.responseText;

                                        if (id !== "") {
                                            previousPortfolioName = lastPortfolioName;
                                            lastPortfolioName = id;
                                            stats = "risk: " +
                                                percentage(res.optim.ps * Math.sqrt(52)) + " " +
                                                "ret: " +
                                                percentage(Math.pow(1 + res.optim.pm, 52) - 1) + " " +
                                                "perf: " +
                                                percentage(res.perf.length > 0 ? res.perf[res.perf.length - 1] : 0);

                                            Y.one('#portfolioId').set('innerHTML',
                                                "Id: <b>" + lastPortfolioName + "</b>")
                                                .set('title', stats);

                                            Y.Cookie.set(YAHOO.proplus.conpa.COOKIE +
                                                ".id", lastPortfolioName, {
                                                    expires: YAHOO.widget.DateMath.add(new Date(),
                                                        YAHOO.widget.DateMath.DAY, 30)
                                                });

                                            Y.Cookie.set(YAHOO.proplus.conpa.COOKIE +
                                                ".stats", stats, {
                                                    expires: YAHOO.widget.DateMath.add(new Date(),
                                                        YAHOO.widget.DateMath.DAY, 30)
                                                });
                                        }
                                    }
                                }
                            });

                            exitGetOptimalPortfolio();
                        }
                    },
                    failure: function (id, o) {
                        exitGetOptimalPortfolio();
                        YAHOO.proplus.conpa.alert("getOptimalPortfolio: failed");
                    }
                });

            }

            oGetOptimalPortfolioButton.on("click", onGetOptimalPortfolioClick);
        }

        function initReferenceDate() {
            var oCalendarMenu = new YAHOO.widget.Overlay("calendarmenu", {
                visible: false,
                zIndex: 4
            });

            oReferenceDateButton = new YAHOO.widget.Button({
                type: "menu",
                id: "calendarpicker",
                label: labelReferenceDateButton(now),
                menu: oCalendarMenu,
                container: "referenceDate"
            });
            oReferenceDateButton.date = now;

            oReferenceDateButton.on("appendTo", function () {
                oCalendarMenu.setBody("&#32;");
                oCalendarMenu.body.id = "calendarcontainer";
                oCalendarMenu.render(this.get("container"));
            });

            function onReferenceDateButtonClick() {
                var maxdate, mindate, oCalendar, sMinDate, sMaxDate;

                oCalendar = new YAHOO.widget.Calendar("buttoncalendar", oCalendarMenu.body.id);

                mindate = YAHOO.widget.DateMath.add(now, YAHOO.widget.DateMath.YEAR, -2);
                maxdate = YAHOO.widget.DateMath.add(now, YAHOO.widget.DateMath.MONTH, 0);
                sMinDate = (mindate.getMonth() + 1) + "/" +
                    mindate.getDate() +
                    "/" +
                    mindate.getFullYear();
                sMaxDate = (maxdate.getMonth() + 1) + "/" +
                    maxdate.getDate() +
                    "/" +
                    maxdate.getFullYear();
                oCalendar.cfg.setProperty("mindate", sMinDate);
                oCalendar.cfg.setProperty("maxdate", sMaxDate);
                oCalendar.cfg.setProperty("navigator", true);

                oCalendar.render();

                oCalendar.selectEvent.subscribe(function (p_sType, p_aArgs) {
                    var aDate, nMonth, nDay, nYear;

                    if (p_aArgs) {
                        resetOptimalWeigths(myDataTable);

                        aDate = p_aArgs[0][0];
                        nMonth = aDate[1] - 1;
                        nDay = aDate[2];
                        nYear = aDate[0];
                        aDate = new Date(nYear, nMonth, nDay);

                        oReferenceDateButton.set("label", labelReferenceDateButton(aDate));
                        oReferenceDateButton.date = aDate;
                    }

                    oCalendarMenu.hide();
                });

                oCalendar.unsubscribe("click", onReferenceDateButtonClick);
            }

            oReferenceDateButton.on("click", onReferenceDateButtonClick);
        }

        function initTargetReturn() {
            var oTargetReturnMenu, oTargetReturnButton,
                oCurrentTargetReturn, oHTMLButton;

            oTargetReturnMenu = new YAHOO.widget.Menu("targetreturnmenu", {
                width: "120px", // 100 + 20
                zIndex: 4
            });

            oTargetReturnButton = new YAHOO.widget.Button({
                type: "menu",
                id: "targetreturnbutton",
                label: "<em id=\"targetreturnbutton-currenttargetreturn\"></em>",
                menu: oTargetReturnMenu,
                container: "targetReturn"
            });

            oTargetReturnButton.on("appendTo", function () {
                oTargetReturnMenu.setBody("<div id=\"slider-bg\" tabindex=\"1\" title=\"Slider\"><div id=\"slider-thumb\"><img width=\"17\" height=\"21\" src=\"images/thumb-n.gif\"></div></div>");
                oTargetReturnMenu.render(this.get("container"));
                oCurrentTargetReturn = Dom.get("targetreturnbutton-currenttargetreturn");
            });

            oHTMLButton = oTargetReturnButton.get("element")
                .getElementsByTagName("button")[0];
            oHTMLButton.id = "targetreturnbutton-button";

            oTargetReturnMenu.subscribe("render", function () {
                var oSlider, oSliderEl;

                oSlider = YAHOO.widget.Slider.getHorizSlider("slider-bg",
                    "slider-thumb", 0, 100, 1);
                if (nTargetReturn === undefined) {
                    nTargetReturn = 0;
                }
                oSlider.setValue(nTargetReturn / 0.01 / 0.15, true);

                oSliderEl = Dom.get("slider-bg");

                oSlider.subscribe("change", function () {
                    var nTargetReturnOld = nTargetReturn * 100 / 100,
                        nValue = Math.round(oSlider.getValue() * 0.15);


                    nTargetReturn = (nValue * 0.01);

                    oSliderEl.title = "Annual Target Return = " + nTargetReturn;
                    oCurrentTargetReturn.innerHTML = "Target Return " +
                        nValue + "%";

                    if (nTargetReturn !== nTargetReturnOld) {
                        resetOptimalWeigths(myDataTable);
                    }
                });
            });
        }

        function restoreBasket() {
            var basketRestored, data, i, lastBasket, referenceDate, id, stats;

            lastBasket = Y.Cookie.get(YAHOO.proplus.conpa.COOKIE);
            if (lastBasket !== null) {
                basketRestored = lastBasket.split(",");
                for (i = 0; i < basketRestored.length; i = i + 1) {
                    data = Y.Cookie.getSubs(YAHOO.proplus.conpa.COOKIE +
                        "." + basketRestored[i]);
                    if (data !== null) {
                        data.symbol = basketRestored[i];
                        myDataTable.addRow(data);
                    }
                }
                referenceDate = new Date(Y.Cookie.get(
                    YAHOO.proplus.conpa.COOKIE + ".referenceDate"
                ));
                if (referenceDate !== null) {
                    oReferenceDateButton.set("label",
                        labelReferenceDateButton(referenceDate));
                    oReferenceDateButton.date = referenceDate;
                }
                nTargetReturn = Y.Cookie.get(
                    YAHOO.proplus.conpa.COOKIE + ".targetReturn"
                );

                id = Y.Cookie.get(YAHOO.proplus.conpa.COOKIE + ".id");

                if (id) {
                    stats = Y.Cookie.get(YAHOO.proplus.conpa.COOKIE + ".stats");
                    Y.one('#portfolioId').set('innerHTML',
                        "Id: <b>" + id + "</b>").set('title', stats);
                }

            }
        }

        function initDashboard() {
            var ptfDS, lastPtfsDT, bestPerfDT, worstPerfDT,
                highRiskDT, lowRiskDT, highRetDT, lowRetDT;

            function percentageFormatter(o) {
                if (!isNaN(o.value)) {
                    return percentage(o.value);
                }
            }

            function hyphenFormatter(o) {
                var assets, weights, lowBounds, highBounds, n, i, title;

                title = o.record.getValue('id') + " \n" +
                    "perf: " + percentage(o.record.getValue('value.perf')) + " " +
                    "risk: " + percentage(o.record.getValue('value.risk')) + " " +
                    "ret: " + percentage(o.record.getValue('value.ret')) + " \n" +
                    "reference date: " + o.record.getValue('value.ref') + " \n";
                assets = o.record.getValue('value.assets');
                weights = o.record.getValue('value.weights');
                lowBounds = o.record.getValue('value.constraints.lowBounds');
                highBounds = o.record.getValue('value.constraints.highBounds');
                n = assets.length;
                for (i = 0; i < n; i += 1) {
                    title += assets[i] + " " + percentage(weights[i]);

                    if (lowBounds !== undefined && highBounds !== undefined) {
                        title += " [" +
                            percentage(lowBounds[i]) + " - " +
                            percentage(highBounds[i] * -1) +
                            "]";
                    }
                    title += " \n";
                }

                this.tdTemplate = '<td title="{title}" headers="{headers}" class="{classnames}"><div class="yui3-datatable-liner">{value}</div></td>';
                o.title = title;

                return o.value.substr(0, 5) + "..." +
                    o.value.substr(o.value.length - 5, 5);
            }

            function updateDataTable(dt, liveData) {
                ptfDS.set("source", liveData);
                dt.datasource.load();
            }

            ptfDS = new Y.DataSource.Local({source: {}});
            ptfDS.plug(Y.Plugin.DataSourceJSONSchema, {
                schema: {
                    resultListLocator: "rows",
                    resultFields: ["key", "id",
                            {key: "value.created_at"},
                            {key: "value.assets"},
                            {key: "value.weights"},
                            {key: "value.ref"},
                            {key: "value.ret"},
                            {key: "value.risk"},
                            {key: "value.perf"},
                            {key: "value.constraints.lowBounds"},
                            {key: "value.constraints.highBounds"}
                        ]
                }
            });

            lastPtfsDT = new Y.DataTable.Base({columnset: [
                { key: "key", label: "To Date" },
                { key: "value.ref", label: "Reference Date" },
                { key: "id", label: "Last Created", formatter: hyphenFormatter
                    },
                { key: "value.perf", label: "Perf",
                    formatter: percentageFormatter, width: 75
                    },
                { key: "value.risk", label: "Risk",
                    formatter: percentageFormatter, width: 75
                    },
                { key: "value.ret", label: "Ret",
                    formatter: percentageFormatter, width: 75
                    }
            ]}).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#lastCreatedPortfolios");

            function getDefs(keyName, idDesc) {
                return [
                    { key: "key", label: keyName,
                        formatter: percentageFormatter, width: 50
                        },
                    { key: "value.created_at", label: "To Date" },
                    { key: "id", label: idDesc, formatter: hyphenFormatter }
                ];
            }

            bestPerfDT = new Y.DataTable.Base({
                columnset: getDefs("Perf", "Best Performing")
            }).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#bestPerformingPortfolios");
            worstPerfDT = new Y.DataTable.Base({
                columnset: getDefs("Perf", "Worst Performing")
            }).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#worstPerformingPortfolios");

            highRiskDT = new Y.DataTable.Base({
                columnset: getDefs("Risk", "High Profile Risk")
            }).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#highProfileRiskPortfolios");
            lowRiskDT = new Y.DataTable.Base({
                columnset: getDefs("Risk", "Low Profile Risk")
            }).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#lowProfileRiskPortfolios");

            highRetDT = new Y.DataTable.Base({
                columnset: getDefs("Ret", "High Profile Return")
            }).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#highProfileReturnPortfolios");
            lowRetDT = new Y.DataTable.Base({
                columnset: getDefs("Ret", "Low Profile Return")
            }).plug(Y.Plugin.DataTableDataSource, {datasource: ptfDS})
                .render("#lowProfileReturnPortfolios");

            tabView_Main.item(1).on('click', function (e) {
                Y.io("/ConPA/getLastCreatedPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(lastPtfsDT, res);
                        }
                    }
                });
                Y.io("/ConPA/getBestPerformingPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(bestPerfDT, res);
                        }
                    }
                });
                Y.io("/ConPA/getWorstPerformingPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(worstPerfDT, res);
                        }
                    }
                });
                Y.io("/ConPA/getHighProfileRiskPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(highRiskDT, res);
                        }
                    }
                });
                Y.io("/ConPA/getLowProfileRiskPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(lowRiskDT, res);
                        }
                    }
                });
                Y.io("/ConPA/getHighProfileReturnPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(highRetDT, res);
                        }
                    }
                });
                Y.io("/ConPA/getLowProfileReturnPortfolios", {
                    on: {
                        success: function (id, o) {
                            var res = JSON.parse(o.responseText);
                            updateDataTable(lowRetDT, res);
                        }
                    }
                });
            });
        }

        initPanels();

        Y.ConPA.MostUsedSymbols.init('#ysearchinput');
        Y.ConPA.AssetSearch.init('#ysearchinput');

        Y.on('ConPA-AssetSearch:select', function (data) {
            myDataTable.addRow(data);

            resetOptimalWeigths(myDataTable);

            oReferenceDateButton.set("label",
                labelReferenceDateButton(now));
            oReferenceDateButton.date = now;
        });

        initBasketDataTable();
        initGetOptimalPortfolio();
        initReferenceDate();
        initTargetReturn();
        restoreBasket();
        initDashboard();
    };

    Y.on("domready", YAHOO.proplus.conpa.init);
});
