"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    finance.getPortfolioCount().then(count => {
        res.json(count);
    });
};
