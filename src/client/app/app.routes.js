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
                template: "<default></default>"
            })
            .state("default.subs", {
                views: {
                    "header": {
                        template: "<header></header>"
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
