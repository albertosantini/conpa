"use strict";

(function () {
    angular
        .module("conpa")
        .config(config);

    config.$inject = ["$httpProvider", "$locationProvider", "$provide",
        "$mdThemingProvider", "localStorageServiceProvider"];
    /*eslint-disable max-len */
    function config($httpProvider, $locationProvider, $provide, $mdThemingProvider, localStorageServiceProvider) {
    /*eslint-enable */
        var interceptors = $httpProvider.interceptors;

        interceptors.push(["$q", "$rootScope", function ($q, $rootScope) {
            var nLoadings = 0;

            return {
                request: function (request) {
                    nLoadings += 1;

                    $rootScope.isLoadingView = true;

                    return request;
                },

                "response": function (response) {
                    nLoadings -= 1;
                    if (nLoadings === 0) {
                        $rootScope.isLoadingView = false;
                    }

                    return response;
                },

                "responseError": function (response) {
                    nLoadings -= 1;
                    if (!nLoadings) {
                        $rootScope.isLoadingView = false;
                    }

                    return $q.reject(response);
                }
            };
        }]);

        $locationProvider.html5Mode(true);

        localStorageServiceProvider.setPrefix("conpa");

        $mdThemingProvider.theme("default")
            .primaryPalette("pink")
            .accentPalette("orange");

        $provide.decorator("$jsonpCallbacks", ["$window",
            function jsonpCallbacksDecorator($window) {
                var callbacks = $window.angular.callbacks;
                var callbackMap = {};

                function createCallback(callbackId) {
                    function callback(data) {
                        callback.data = data;
                        callback.called = true;
                    }
                    callback.id = callbackId;
                    return callback;
                }

                return {
                    createCallback: function () {
                        var callbackId = "_" + (callbacks.$$counter++).toString(36);
                        // var callbackPath = "angular.callbacks." + callbackId;
                        var callbackPath = "YAHOO.Finance.SymbolSuggest.ssCallback";
                        var callback = createCallback(callbackId);
                        callbackMap[callbackPath] = callbacks[callbackId] = callback;
                        return callbackPath;
                    },
                    wasCalled: function (callbackPath) {
                        return callbackMap[callbackPath] &&
                            callbackMap[callbackPath].called;
                    },
                    getResponse: function (callbackPath) {
                        return callbackMap[callbackPath].data;
                    },
                    removeCallback: function (callbackPath) {
                        var callback = callbackMap[callbackPath];
                        if (callback) {
                            delete callbacks[callback.id];
                        }
                        delete callbackMap[callbackPath];
                    }
                };
            }
        ]);
    }

}());
