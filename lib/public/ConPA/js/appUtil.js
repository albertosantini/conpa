/*global jQuery */

(function ($) {
    "use strict";

    $.conpa = {
        helpers: {
            percentageFormatter: function (number) {
                return (number * 100).toFixed(2) + "%";
            },

            hyphenFormatter: function (text) {
                return text.substr(0, 5) + "..." +
                    text.substr(text.length - 5, 5);
            }
        }
    };

}(jQuery));


