/*global jQuery */

(function ($) {
    'use strict';

    var App = {

        init: function () {
            var model = $.sync('conpa');


            model.assets = model.assets || [];
            model.refdate = model.refdate ||
                $.conpa.dates.yearToDate().toString();
            $.sync('conpa', {
                assets: model.assets,
                refdate: model.refdate
            });

            $('#new-asset').on('change', this.create);

            $.publish('render.dashboard.conpa');
            $.publish('render.app.conpa');
        },

        create: function (e) {
            var model = $.sync('conpa'),
                $input = $(e.target),
                val = $.trim($input.val());

            $input.val('');

            if (e.hasOwnProperty('originalEvent')) {
                return;
            }

            model.assets.push({
                id: $.conpa.utils.rfc4122v4(),
                symbol: val
            });

            $.sync('conpa', model);
            $.publish('render.app.conpa');
        },

        render: function () {
            /*jslint nomen:true */
            /*global _ */
            var model = $.sync('conpa'),
                lastAsset = _.last(model.assets);

            $.publish('clear.portfolio.conpa');
            $.publish('clear.message.conpa');

            $.publish('render.assetlist.conpa');

            if (model.assets.length) {
                $.publish('stats.asset.conpa', [lastAsset.symbol]);
            }

            $.publish('optimize.portfolio.conpa',
                [model.assets, $.conpa.dates.today().toString()]);
            $.publish('optimize.portfolio.conpa',
                [model.assets, model.refdate]);
        }
    };

    $.subscribe('render.app.conpa', App.render);

    App.init();
}(jQuery));
