/*global jQuery, localStorage */
/*jslint bitwise: true */

(function ($) {
    "use strict";

    $.conpaUUID = function () {
        var rfc4122v4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        return rfc4122v4.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    };

    $.conpaStore = function (namespace, data) {
        var store;

        if (arguments.length > 1) {
            store = localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            store = localStorage.getItem(namespace);
            store = (store && JSON.parse(store)) || [];
        }

        return store;
    };

}(jQuery));

