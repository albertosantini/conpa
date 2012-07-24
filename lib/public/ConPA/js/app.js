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
            var assets = $.sync('conpa-assets'),
                $input = $(this),
                val = $.trim($input.val());

            assets.push({
                id: $.rfc4122v4(),
                symbol: val
            });

            $input.val('');

            $.sync('conpa-assets', assets);
            App.render();
        },

        render: function () {
            var assets = $.sync('conpa-assets'),
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
        }
    };

    $.subscribe('render.app.conpa', App.render);

    App.run();
});
