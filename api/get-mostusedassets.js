"use strict";

const finance = require("./_finance");

module.exports = (req, res) => {
    finance.getMostUsedAssets().then(mostUsedAssets => {
        res.json(mostUsedAssets);
    });
};
