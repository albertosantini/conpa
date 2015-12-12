"use strict";

(function () {
    angular
        .module("conpa")
        .factory("basketService", basketService);

    function basketService() {
        var assets = [],
            service = {
                getAssets: getAssets,
                addAsset: addAsset
            };

        return service;

        function getAssets() {
            return assets;
        }

        function addAsset(item) {
            var isNew;

            if (!item) {
                return;
            }

            isNew = assets.filter(function (asset) {
                if (item.name === asset.name) {
                    return asset;
                }
            }).length === 0;

            if (isNew) {
                assets.push(item);
            }
        }
    }

}());
