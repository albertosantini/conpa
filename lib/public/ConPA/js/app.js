/*global jQuery, Handlebars */

jQuery(function ($) {
    'use strict';

    var App;

    Handlebars.registerHelper('percentageFormatter', function (number) {
        return (number * 100).toFixed(2) + "%";
    });

    Handlebars.registerHelper('hyphenFormatter', function (text) {
        return text.substr(0, 5) + "..." + text.substr(text.length - 5, 5);
    });


    App = {
        run: function () {
            this.init();
            this.render();
        },

        init: function () {
            this.latestPortfoliosTemplate = Handlebars
                .compile($('#latest-portfolios-template').html());
            this.$latestPortfoliosList = $('#latest-portfolios-list');

            this.otherPortfoliosTemplate = Handlebars
                .compile($('#other-portfolios-template').html());
            this.$bestPerfomingPortfoliosList = $('#best-performing-portfolios-list');
        },

        getLastCreatedPortfolios: function () {
            var self = this;

            $.ajax({
                url: "/ConPA/getLastCreatedPortfolios",
                success: function (data) {
                    self.$latestPortfoliosList.html(self
                        .latestPortfoliosTemplate(data.rows));
                }
            });
        },

        getBestPerformingPortfolios: function () {
            var self = this;

            $.ajax({
                url: "/ConPA/getBestPerformingPortfolios",
                success: function (data) {
                    self.$bestPerfomingPortfoliosList.html(self
                        .otherPortfoliosTemplate({
                            keyName: "Perf",
                            idDesc: "Best Performing",
                            data: data.rows
                        }));
                }
            });
        },

        render: function () {
            this.getLastCreatedPortfolios();
            this.getBestPerformingPortfolios();
        }
    };

    App.run();
});
