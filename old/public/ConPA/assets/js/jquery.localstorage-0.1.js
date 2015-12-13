/*global jQuery, localStorage */

(function ($) {
    'use strict';

    $.sync = function (namespace, model) {
        var store;

        if (arguments.length > 1) { // set
            store = localStorage.setItem(namespace, JSON.stringify(model));
        } else { // get
            store = localStorage.getItem(namespace);
            store = (store && JSON.parse(store)) || {};
        }

        return store;
    };

}(jQuery));

