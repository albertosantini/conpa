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
            this.$newAsset.on('selectitem', this.create);

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

        render: function () {
            var today = new Date(),
                yearToDate = new Date(today - (1000 * 60 * 60 * 24 * 365)),
                lastAsset;

            this.$assetList.html(this.assetTemplate(this.assets));
            Utils.store('conpa-assets', this.assets);

            $.publish('clear.portfolio.conpa');
            $.publish('clear.message.conpa');

            $.publish('render.dashboard.conpa');

            if (this.assets.length) {
                lastAsset = this.assets[this.assets.length - 1].symbol;
                $.publish('stats.asset.conpa', [lastAsset]);
            }

            $.publish('optimize.portfolio.conpa',
                [this.assets, today.toString()]);
            $.publish('optimize.portfolio.conpa',
                [this.assets, yearToDate.toString()]);
        }
    };

    App.run();
});
