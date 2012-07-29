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

            isToday: function (date) {
                var today = $.conpa.dates.today(),
                    d1 = today.getDate(),
                    m1 = today.getMonth(),
                    y1 = today.getFullYear(),
                    d2 = date.getDate(),
                    m2 = date.getMonth(),
                    y2 = date.getFullYear();

                return (d1 === d2) && (m1 === m2) && (y1 === y2);
            },

            yearToDate: function () {
                return new Date($.conpa.dates.today() -
                    (1000 * 60 * 60 * 24 * 365)); // 1 year
            },
            ymdDate: function (date) {
                var d = new Date(date),
                    day = d.getDate(),
                    month = d.getMonth() + 1,
                    year = d.getFullYear();

                return year + "/" +
                    (month < 10 ? "0" + month : month) + "/" +
                    (day < 10 ? "0" + day : day);
            }
        }
    };

}(jQuery));


