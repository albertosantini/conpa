/*global jQuery, Handlebars, localStorage */
/*jslint bitwise: true, unparam: true */


jQuery(function ($) {
    'use strict';

    var App, Utils;

    Handlebars.registerHelper('percentageFormatter', function (number) {
        return (number * 100).toFixed(2) + "%";
    });

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

            this.latestPortfoliosTemplate = Handlebars
                    .compile($('#latest-portfolios-template').html());
            this.$latestPortfoliosList = $('#latest-portfolios-list');

            this.otherPortfoliosTemplate = Handlebars
                    .compile($('#other-portfolios-template').html());
            this.$bestPerfomingPortfoliosList = $('#best-performing-portfolios-list');
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
            this.getLastCreatedPortfolios();
            this.getBestPerformingPortfolios();

            this.$assetList.html(this.assetTemplate(this.assets));

            Utils.store('conpa-assets', this.assets);
        }
    };

    App.run();
});
