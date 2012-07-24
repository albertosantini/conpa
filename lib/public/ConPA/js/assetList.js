/*jslint nomen: true */
/*global jQuery, _ */

(function ($) {
    "use strict";

    var assetRawTemplate =
            '<% _.each(assets, function (asset, key, list) { %>' +
            '<li data-id="<%= asset.id %>">' +
                '<div class="well">' +
                    '<div><%= asset.symbol %></div>' +
                    '<div class="destroy"></div>' +
                '</div>' +
            '</li>' +
            '<% }) %>',
        assetTemplate = _.template(assetRawTemplate),
        $assetList = $('#asset-list');

    function handleRender() {
        $assetList.html(assetTemplate({
            assets: $.sync('conpa-assets')
        }));
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


