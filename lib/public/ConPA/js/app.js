/*global jQuery, Handlebars, localStorage */
/*jslint bitwise: true, unparam: true */


jQuery(function ($) {
    'use strict';

    var App, Utils, Helpers;

    Helpers = {
        percentageFormatter: function (number) {
            return (number * 100).toFixed(2) + "%";
        }
    };

    Handlebars.registerHelper('percentageFormatter',
        Helpers.percentageFormatter);

    Handlebars.registerHelper('hyphenFormatter', function (text) {
        return text.substr(0, 5) + "..." + text.substr(text.length - 5, 5);
    });


    Utils = {
        uuid: function () {
            var rfc4122v4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

            return rfc4122v4.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);

                return v.toString(16);
            });
        },

        store: function (namespace, data) {
            var store;

            if (arguments.length > 1) {
                store = localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                store = localStorage.getItem(namespace);
                store = (store && JSON.parse(store)) || [];
            }

            return store;
        }
    };

    App = {
        run: function () {
            this.init();

            this.getLastCreatedPortfolios();
            this.getBestPerformingPortfolios();

            this.render();
        },

        init: function () {
            var list;

            this.assets = Utils.store('conpa-assets');

            this.assetTemplate = Handlebars
                    .compile($('#asset-template').html());
            list = this.$assetList = $('#asset-list');
            list.on('click', '.destroy', this.destroy);

            this.$newAsset = $('#new-asset');
            this.$newAsset.on('keyup', this.create);

            this.assetStatsTemplate = Handlebars
                    .compile($('#asset-stats-template').html());
            this.$assetStatsName = $('#asset-stats-name');
            this.$assetStatsList1 = $('#asset-stats-list1');
            this.$assetStatsList2 = $('#asset-stats-list2');

            this.latestPortfoliosTemplate = Handlebars
                    .compile($('#latest-portfolios-template').html());
            this.$latestPortfoliosList = $('#latest-portfolios-list');

            this.otherPortfoliosTemplate = Handlebars
                    .compile($('#other-portfolios-template').html());
            this.$bestPerfomingPortfoliosList = $('#best-performing-portfolios-list');

            this.$basketPieChart = $('#basket-pie-chart');
            this.$basketPieYTDChart = $('#basket-pie-ytd-chart');
            this.$basketPerfYTDChart = $('#basket-performance-ytd-chart');

            this.messageTemplate = Handlebars
                    .compile($('#message-template').html());
            this.$message = $('#message');
        },

        getAsset: function (elem, callback) {
            var id = $(elem).closest('li').data('id');

            $.each(this.assets, function (i, val) {
                if (val.id === id) {
                    callback.apply(App, arguments);
                    return false;
                }
            });
        },

        create: function (e) {
            var $input = $(this),
                val = $.trim($input.val());

            if (e.which !== 13 || !val) {
                return;
            }

            App.assets.push({
                id: Utils.uuid(),
                symbol: val
            });

            $input.val('');

            App.render();
        },

        destroy: function () {
            App.getAsset(this, function (i) {
                this.assets.splice(i, 1);
                this.render();
            });
        },

        getOptimalPortfolio: function (pieNode, perfNode, refDate) {
            var self = this,
                lows = [],
                highs = [],
                assets = $.map(this.assets, function (asset, i) {
                    lows[i] = 0;
                    highs[i] = -1;

                    return asset.symbol;
                });

            if (assets.length < 3) {
                return;
            }

            refDate = refDate || (new Date()).toString();

            $.ajax({
                url: "/ConPA/getOptimalPortfolio",
                type: "POST",
                data: {
                    prods: assets,
                    referenceDate: refDate,
                    targetReturn: undefined,
                    lows: lows,
                    highs: highs
                },
                success: function (data) {
                    if (data.message) {
                        self.$message.html(self.messageTemplate({
                            type: 'alert-error',
                            heading: 'Optimization error',
                            message: data.message
                        }));

                        return;
                    }

                    pieNode.sparkline(data.optim.solution, {
                        type: 'pie',
                        height: '150',
                        offset: 90,
                        tooltipFormatter: function (spark, options, field) {
                            var index;

                            $.grep(data.optim.solution, function (n, i) {
                                if (n === field.value) {
                                    index = i;
                                }
                            });

                            return assets[index] + " " +
                                Helpers.percentageFormatter(field.value);
                        }
                    });

                    if (data.perf.length) {
                        perfNode.sparkline(data.perf, {
                            type: 'bar',
                            height: '150',
                            tooltipFormatter: function (spark, options, field) {
                                return Helpers.percentageFormatter(field[0].value);
                            }
                        });
                    }
                }
            });
        },

        getKeyStatistics: function (symbol) {
            var self = this;

            $.ajax({
                url: "/ConPA/getKeyStatistics",
                type: "POST",
                data: {
                    symbol: symbol
                },
                success: function (data) {
                    var midIndex, secondHalf, firstHalf, firstItem;

                    if (!data.length) {
                        return;
                    }

                    midIndex = data.length / 2;
                    secondHalf = data;
                    firstHalf = secondHalf.splice(0, midIndex);
                    firstItem = firstHalf[0].inputParams.value;

                    App.$assetStatsName.html('Asset Stats for ' + symbol);

                    // ugly hack because the first stat contains an html tag
                    firstHalf[0].inputParams.value = $(firstItem).text();

                    self.$assetStatsList1.html(self
                            .assetStatsTemplate(firstHalf));
                    self.$assetStatsList2.html(self
                            .assetStatsTemplate(secondHalf));
                }
            });
        },

        getLastCreatedPortfolios: function () {
            var self = this;

            $.ajax({
                url: "/ConPA/getLastCreatedPortfolios",
                success: function (data) {
                    self.$latestPortfoliosList.html(self
                        .latestPortfoliosTemplate(data.rows));
                }
            });
        },

        getBestPerformingPortfolios: function () {
            var self = this;

            $.ajax({
                url: "/ConPA/getBestPerformingPortfolios",
                success: function (data) {
                    self.$bestPerfomingPortfoliosList.html(self
                        .otherPortfoliosTemplate({
                            keyName: "Perf",
                            idDesc: "Best Performing",
                            data: data.rows
                        }));
                }
            });
        },

        render: function () {
            var today = new Date(),
                yearToDate = new Date(today - (1000 * 60 * 60 * 24 * 365)),
                lastAsset;

            this.$assetList.html(this.assetTemplate(this.assets));
            Utils.store('conpa-assets', this.assets);

            this.$basketPieChart.empty();
            this.$basketPieYTDChart.empty();
            this.$basketPerfYTDChart.empty();
            this.$message.empty();

            lastAsset = this.assets[this.assets.length - 1].symbol;
            App.getKeyStatistics(lastAsset);

            App.getOptimalPortfolio(App.$basketPieChart,
                null,
                today.toString());
            App.getOptimalPortfolio(App.$basketPieYTDChart,
                App.$basketPerfYTDChart,
                yearToDate.toString());
        }
    };

    App.run();
});
