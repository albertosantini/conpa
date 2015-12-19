"use strict";

(function () {
    angular
        .module("conpa")
        .directive("otherPortfolios", otherPortfolios);

    function otherPortfolios() {
        var directive = {
            restrict: "E",
            scope: {
                ptfs: "=",
                metric: "=",
                kind: "="
            },
            templateUrl: "app/components/otherportfolios.html"
        };

        return directive;
    }

}());
