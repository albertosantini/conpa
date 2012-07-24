/*global jQuery, Handlebars */

(function ($) {
    "use strict";

    var assetRawTemplate =
            '{{#this}}' +
            '<li data-id="{{id}}">' +
                '<div class="well">' +
                    '<div>{{symbol}}</div>' +
                    '<div class="destroy"></div>' +
                '</div>' +
            '</li>' +
            '{{/this}}',
        assetTemplate = Handlebars.compile(assetRawTemplate),
        $assetList = $('#asset-list');

    function handleRender() {
        $assetList.html(assetTemplate($.sync('conpa-assets')));
    }

    function destroy(e) {
        var id = $(e.target).closest('li').data('id'),
            assets = $.sync('conpa-assets');

        $.each(assets, function (i, asset) {
            if (asset.id === id) {
                assets.splice(i, 1);
                $.sync('conpa-assets', assets);

                handleRender();

                $.publish('render.app.conpa');

                return false;
            }
        });
    }

    $assetList.on('click', '.destroy', destroy);

    $.subscribe("render.assetlist.conpa", handleRender);

}(jQuery));


