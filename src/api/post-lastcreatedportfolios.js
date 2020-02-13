"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    const count = req.body.count;

    finance.getLastCreatedPortfolios(count).then(portfolios => {
        res.json(portfolios);
    });
};
