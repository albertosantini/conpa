/*global jQuery */

(function ($) {
    'use strict';

    var App = {

        init: function () {
            $('#new-asset').on('selectitem', this.create);

            $.publish('render.dashboard.conpa');
            $.publish('render.app.conpa');
        },

        create: function (e) {
            var assets = $.sync('conpa-assets'),
                $input = $(e.target),
                val = $.trim($input.val());

            assets.push({
                id: $.conpa.utils.rfc4122v4(),
                symbol: val
            });

            $input.val('');

            $.sync('conpa-assets', assets);
            $.publish('render.app.conpa');
        },

        render: function () {
            /*jslint nomen:true */
            /*global _ */
            var assets = $.sync('conpa-assets'),
                lastAsset = _.last(assets);

            $.publish('clear.portfolio.conpa');
            $.publish('clear.message.conpa');

            $.publish('render.assetlist.conpa');

            if (assets.length) {
                $.publish('stats.asset.conpa', [lastAsset.symbol]);
            }

            $.publish('optimize.portfolio.conpa',
                [assets, $.conpa.dates.today().toString()]);
            $.publish('optimize.portfolio.conpa',
                [assets, $.conpa.dates.yearToDate().toString()]);
        }
    };

    $.subscribe('render.app.conpa', App.render);

    App.init();
}(jQuery));
