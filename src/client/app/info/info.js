"use strict";

(function () {
    angular
        .module("conpa")
        .component("info", {
            controller: Info,
            templateUrl: "app/info/info.html"
        });

    Info.$inject = ["$mdDialog", "infoService", "basketService"];
    function Info($mdDialog, infoService, basketService) {
        var vm = this;

        vm.optimalPortfolioToDate = infoService.getOptimalPortfolioToDate();
        vm.optimalPortfolioYearToDate = infoService.getOptimalPortfolioYearToDate();
        vm.assets = basketService.getAssets();

        vm.showToDateRScript = showToDateRScript;
        vm.showYearToDateRScript = showYearToDateRScript;

        function showToDateRScript(ev) {
            showRScript(ev, vm.optimalPortfolioToDate.script);
        }

        function showYearToDateRScript(ev) {
            showRScript(ev, vm.optimalPortfolioYearToDate.script);
        }

        function showRScript(ev, script) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title("Script to check results (copy&paste in R console)")
                    .htmlContent("<pre>" + script + "</pre>")
                    .ok("Got it!")
                    .targetEvent(ev)
            );
        }
    }

}());
