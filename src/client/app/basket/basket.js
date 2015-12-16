"use strict";


(function () {
    angular
        .module("conpa")
        .controller("Basket", Basket);

    Basket.$inject = ["yahooService", "basketService", "statsService", "infoService"];
    function Basket(yahooService, basketService, statsService, infoService) {
        var vm = this;

        vm.assets = basketService.getAssets();

        vm.searchText = "";

        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;

        vm.chipOnRemove = chipOnRemove;

        activate();

        function activate() {
            refreshBasketInfoAndStats(getLastSymbol(), vm.assets);
        }

        function querySearch(query) {
            return yahooService.quoteLookup(query);
        }

        function selectedItemChange(item) {
            var symbol,
                assets;

            if (!item) {
                return;
            }

            symbol = item.symbol;
            assets = vm.assets;

            basketService.addAsset(item);

            refreshBasketInfoAndStats(symbol, assets);
        }

        function chipOnRemove() {
            refreshBasketInfoAndStats(getLastSymbol(), vm.assets);
        }

        function refreshBasketInfoAndStats(symbol, assets) {
            basketService.saveAssets(assets);

            statsService.getKeyStatistics(symbol);
            infoService.calcOptimalPortfolioToDate(assets);
            infoService.calcOptimalPortfolioYearToDate(assets);
        }

        function getLastSymbol() {
            var lastAsset = vm.assets.slice(-1)[0],
                lastSymbol = lastAsset && lastAsset.symbol;

            return lastSymbol;
        }
    }

}());
