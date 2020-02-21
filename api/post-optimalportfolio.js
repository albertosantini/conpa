"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    finance.getOptimalPortfolio(req.body).then(portfolio => {
        res.json(portfolio);
    });
};
