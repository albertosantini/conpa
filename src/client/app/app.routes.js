"use strict";

(function () {
    angular
        .module("conpa")
        .config(config)
        .run(setup);

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("default", {
                abstract: true,
                url: "/",
                templateUrl: "app/layout/default.html"
            })
            .state("default.subs", {
                views: {
                    "header": {
                        templateUrl: "app/header/header.html"
                    },
                    "basket": {
                        templateUrl: "app/basket/basket.html",
                        controller: "Basket",
                        controllerAs: "vm"
                    },
                    "info": {
                        templateUrl: "app/info/info.html",
                        controller: "Info",
                        controllerAs: "vm"
                    },
                    "stats": {
                        templateUrl: "app/stats/stats.html",
                        controller: "Stats",
                        controllerAs: "vm"
                    },
                    "latest": {
                        templateUrl: "app/latest/latest.html",
                        controller: "Latest",
                        controllerAs: "vm"
                    },
                    "best": {
                        templateUrl: "app/best/best.html",
                        controller: "Best",
                        controllerAs: "vm"
                    },
                    "worst": {
                        templateUrl: "app/worst/worst.html",
                        controller: "Worst",
                        controllerAs: "vm"
                    }
                }
            });

        $urlRouterProvider.otherwise("/");
    }

    setup.$inject = ["$state"];
    function setup($state) {
        $state.transitionTo("default.subs");
    }

}());
