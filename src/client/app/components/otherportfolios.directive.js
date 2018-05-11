"use strict";

(function () {
    var otherPortfoliosOptions = {
        bindings: {
            ptfs: "=",
            metric: "=",
            kind: "="
        },
        templateUrl: "app/components/otherportfolios.html"
    };

    angular
        .module("conpa")
        .component("otherPortfolios", otherPortfoliosOptions);
}());
