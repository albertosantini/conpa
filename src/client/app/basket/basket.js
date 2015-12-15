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

            refresh(symbol, assets);
        }

        function chipOnRemove() {
            var latestAsset = vm.assets.slice(-1)[0],
                symbol = latestAsset && latestAsset.symbol,
                assets = vm.assets;

            refresh(symbol, assets);
        }

        function refresh(symbol, assets) {
            statsService.getKeyStatistics(symbol);
            infoService.calcOptimalPortfolioToDate(assets);
            infoService.calcOptimalPortfolioYearToDate(assets);
        }
    }

}());
