"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    finance.queryByDate(req.body).then(portfolios => {
        res.json(portfolios);
    });
};
