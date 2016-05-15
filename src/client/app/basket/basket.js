"use strict";


(function () {
    angular
        .module("conpa")
        .component("basket", {
            controller: Basket,
            templateUrl: "app/basket/basket.html"
        });

    Basket.$inject = ["googleService", "basketService", "statsService",
        "infoService", "portfoliosService"];
    function Basket(googleService, basketService, statsService,
            infoService, portfoliosService) {
        var vm = this;

        vm.assets = basketService.getAssets();

        vm.searchText = "";

        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;

        vm.chipOnRemove = chipOnRemove;

        vm.mostUsedAssets = [];
        vm.portfolioCount = "";

        activate();

        function activate() {
            refreshBasketInfoAndStats(getLastSymbol(), vm.assets);
            portfoliosService.getMostUsedAssets().then(function (res) {
                vm.mostUsedAssets = res;
            });
            portfoliosService.getPortfolioCount().then(function (res) {
                vm.portfolioCount = res[0].value;
            });
        }

        function querySearch(query) {
            return googleService.quoteLookup(query);
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
