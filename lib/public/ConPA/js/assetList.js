(function ($, _) {
    "use strict";

    var assetRawTemplate =
            "<% _.each(assets, function (asset, key, list) { %>" +
            "<li data-id=\"<%= asset.id %>\">" +
                "<div class=\"well\">" +
                    "<div><%= asset.symbol %></div>" +
                    "<div class=\"destroy\"></div>" +
                "</div>" +
            "</li>" +
            "<% }) %>",
        assetTemplate = _.template(assetRawTemplate),
        $assetList = $("#asset-list");

    function handleRender() {
        $assetList.html(assetTemplate({
            assets: $.sync("conpa").assets
        }));
    }

    function destroy(e) {
        var id = $(e.target).closest("li").data("id"),
            model = $.sync("conpa");

        $.each(model.assets, function (i, asset) {
            if (asset.id === id) {
                model.assets.splice(i, 1);

                if (model.assets.length < 3) {
                    model.refdate = $.conpa.dates.yearToDate().toString();
                }

                $.sync("conpa", model);

                handleRender();

                $.publish("render.app.conpa");

                return false;
            }
        });
    }

    $assetList.on("click", ".destroy", destroy);

    $.subscribe("render.assetlist.conpa", handleRender);

}(jQuery, window._));
