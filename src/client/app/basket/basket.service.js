"use strict";

(function () {
    angular
        .module("conpa")
        .factory("basketService", basketService);

    basketService.$inject = ["localStorageService"];
    function basketService(localStorageService) {
        var assets = [],
            service = {
                getAssets: getAssets,
                addAsset: addAsset,
                saveAssets: saveAssets
            };

        return service;

        function getAssets() {
            if (assets.length === 0) {
                angular.extend(assets,
                    localStorageService.get("assets") || assets);
            }

            return assets;
        }

        function addAsset(item) {
            var isNew;

            if (!item) {
                return;
            }

            isNew = assets.filter(function (asset) {
                return item.symbol === asset.symbol;
            }).length === 0;

            if (isNew) {
                assets.push(item);
            }
        }

        function saveAssets(myAssets) {
            localStorageService.set("assets", myAssets);
        }
    }

}());
