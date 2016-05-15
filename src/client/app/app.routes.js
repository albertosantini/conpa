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
                        template: "<basket></basket>"
                    },
                    "info": {
                        template: "<info></info>"
                    },
                    "stats": {
                        template: "<stats></stats>"
                    },
                    "latest": {
                        template: "<latest></lastest>"
                    },
                    "other": {
                        template: "<other></other>"
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
