/*jslint bitwise: true */
/*global jQuery */

(function ($) {
    "use strict";

    $.conpa = {
        utils: {
            rfc4122v4: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                    function (c) {
                        var r = Math.random() * 16 | 0,
                            v = c === 'x' ? r : (r & 0x3 | 0x8);

                        return v.toString(16);
                    });
            }
        },

        helpers: {
            percentageFormatter: function (number) {
                return (number * 100).toFixed(2) + "%";
            },

            hyphenFormatter: function (text) {
                return text.substr(0, 5) + "..." +
                    text.substr(text.length - 5, 5);
            }
        },

        dates: {
            today: function () {
                return new Date();
            },

            yearToDate: function () {
                return new Date($.conpa.dates.today() -
                    (1000 * 60 * 60 * 24 * 365)); // 1 year
            }
        }
    };

}(jQuery));


