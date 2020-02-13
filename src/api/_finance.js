"use strict";

const os = require("os");
const util = require("util");
const finance = require("finance");

finance.crm.configure({

    liveDomain: os.hostname(),

    // liveDomain: "foo.com",
    liveUrl: process.env.CONPA_LIVE_URL || "http://localhost:5984",
    liveDb: "conpa",
    testingUrl: process.env.CONPA_TEST_URL || "http://localhost:5984",
    testingDb: "conpa-staging",
    design: "ConPA"
});

exports.getOptimalPortfolio = util.promisify(finance.portfolio.getOptimalPortfolio);
exports.getKeyStatistics = util.promisify(finance.keystatistics.getKeyStatistics);
exports.savePortfolio = util.promisify(finance.crm.putPortfolioOnCRM);
exports.getPortfolioCount = util.promisify(finance.crm.getPortfolioCount);
exports.getMostUsedAssets = util.promisify(finance.crm.getMostUsedAssets);
exports.getLastCreatedPortfolios = util.promisify(finance.crm.getLastCreatedPortfolios);
exports.queryByDate = util.promisify(finance.crm.queryByDate);
