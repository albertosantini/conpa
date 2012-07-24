/*global jQuery, localStorage */
/*jslint bitwise: true */

(function ($) {
    "use strict";

    $.rfc4122v4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);

                return v.toString(16);
            });
    };

    $.sync = function (namespace, model) {
        var store;

        if (arguments.length > 1) { // set
            store = localStorage.setItem(namespace, JSON.stringify(model));
        } else { // get
            store = localStorage.getItem(namespace);
            store = (store && JSON.parse(store)) || [];
        }

        return store;
    };

}(jQuery));

