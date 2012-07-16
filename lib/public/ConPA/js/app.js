/*global jQuery, Handlebars */

jQuery(function ($) {
    'use strict';

    var App;

    App = {
        init: function () {
            this.latestPortfoliosTemplate = Handlebars
                .compile($('#latest-portfolios-template').html());
            this.$latestPortfoliosList = $('#latest-portfolios-list');

            this.render();
        },

        render: function () {
            var t = [{
                id: 1
            }, {
                id: 2
            }];

            this.$latestPortfoliosList.html(this.latestPortfoliosTemplate(t));
        }
    };

    App.init();
});
