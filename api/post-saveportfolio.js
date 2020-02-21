"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    finance.savePortfolio(req.body).then(id => {
        res.json(id);
    });
};
