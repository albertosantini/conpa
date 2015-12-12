"use strict";


(function () {
    angular
        .module("conpa")
        .controller("Basket", Basket);

    Basket.$inject = ["yahooService", "basketService", "statsService", "infoService"];
    function Basket(yahooService, basketService, statsService, infoService) {
        var vm = this;

        vm.assets = basketService.getAssets();

        vm.selectedItem = "";
        vm.searchText = "";

        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;

        vm.chipOnRemove = chipOnRemove;

        function querySearch(query) {
            return yahooService.quoteLookup(query);
        }

        function selectedItemChange(item) {
            if (!item) {
                return;
            }

            basketService.addAsset(item);
            statsService.getKeyStatistics(item.symbol);
            infoService.calcOptimalPortfolio(vm.assets);
        }

        function chipOnRemove() {
            var latestAsset = vm.assets.slice(-1)[0],
                symbol = latestAsset && latestAsset.symbol;

            statsService.getKeyStatistics(symbol);
            infoService.calcOptimalPortfolio(vm.assets);
        }

    }

}());
