"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    finance.getKeyStatistics(req.body).then(stats => {
        res.json(stats);
    });
};
