/*global jQuery, Handlebars */
/*jslint unparam: true */

jQuery(function ($) {
    'use strict';

    Handlebars.registerHelper('percentageFormatter', function (number) {
        return (number * 100).toFixed(2) + "%";
    });

    Handlebars.registerHelper('hyphenFormatter', function (text) {
        return text.substr(0, 5) + "..." + text.substr(text.length - 5, 5);
    });

    var App = {
        run: function () {
            this.init();

            $.publish('render.dashboard.conpa');
            this.render();
        },

        init: function () {
            this.$newAsset = $('#new-asset');
            this.$newAsset.on('selectitem', this.create);
        },

        create: function (e) {
            var assets = $.conpaStore('conpa-assets'),
                $input = $(this),
                val = $.trim($input.val());

            assets.push({
                id: $.conpaUUID(),
                symbol: val
            });

            $input.val('');

            $.conpaStore('conpa-assets', assets);
            App.render();
        },

        render: function () {
            var assets = $.conpaStore('conpa-assets'),
                today = new Date(),
                yearToDate = new Date(today - (1000 * 60 * 60 * 24 * 365)),
                lastAsset;

            $.publish('clear.portfolio.conpa');
            $.publish('clear.message.conpa');

            $.publish('render.assetlist.conpa');

            if (assets.length) {
                lastAsset = assets[assets.length - 1].symbol;
                $.publish('stats.asset.conpa', [lastAsset]);
            }

            $.publish('optimize.portfolio.conpa',
                [assets, today.toString()]);
            $.publish('optimize.portfolio.conpa',
                [assets, yearToDate.toString()]);

            if (assets.length > 2) {
                $.publish('render.dashboard.conpa');
            }
        }
    };

    $.subscribe('render.app.conpa', App.render);

    App.run();
});
