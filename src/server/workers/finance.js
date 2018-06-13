"use strict";

const os = require("os");
const util = require("util");
const RateLimiter = require("limiter").RateLimiter;
const workway = require("workway");
const finance = require("finance");

const log = require("../util").log;

const limiter = new RateLimiter(1, 500);

log("Finance worker engaged");

finance.crm.configure({

    liveDomain: os.hostname(),

    // liveDomain: "foo.com",
    liveUrl: process.env.CONPA_LIVE_URL || "http://localhost:5984",
    liveDb: "conpa",
    testingUrl: process.env.CONPA_TEST_URL || "http://localhost:5984",
    testingDb: "conpa-staging",
    design: "ConPA"
});

function throttleRequest(callback, args) {
    return new Promise((resolve, reject) => {
        limiter.removeTokens(1, () => {
            function cb(err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }

            if (args) {
                return callback(args, cb);
            }
            return callback(cb);
        });
    });
}

finance.crm.getPortfolioCount[util.promisify.custom] = function() {
    return throttleRequest(finance.crm.getPortfolioCount);
};

finance.crm.getMostUsedAssets[util.promisify.custom] = function() {
    return throttleRequest(finance.crm.getMostUsedAssets);
};

finance.crm.getLastCreatedPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getLastCreatedPortfolios, args);
};

finance.crm.getBestPerformingPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getBestPerformingPortfolios, args);
};
finance.crm.getWorstPerformingPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getWorstPerformingPortfolios, args);
};
finance.crm.getHighProfileRiskPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getHighProfileRiskPortfolios, args);
};
finance.crm.getLowProfileRiskPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getLowProfileRiskPortfolios, args);
};
finance.crm.getHighProfileReturnPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getHighProfileReturnPortfolios, args);
};
finance.crm.getLowProfileReturnPortfolios[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.getLowProfileReturnPortfolios, args);
};

finance.crm.putPortfolioOnCRM[util.promisify.custom] = function(args) {
    return throttleRequest(finance.crm.putPortfolioOnCRM, args);
};

workway({
    getOptimalPortfolio: util.promisify(finance.portfolio.getOptimalPortfolio),
    getScriptOptimalPortfolio: util.promisify(finance.portfolio.getScriptOptimalPortfolio),
    getKeyStatistics: util.promisify(finance.keystatistics.getKeyStatistics),
    savePortfolio: util.promisify(finance.crm.putPortfolioOnCRM),
    getPortfolioCount: util.promisify(finance.crm.getPortfolioCount),
    getMostUsedAssets: util.promisify(finance.crm.getMostUsedAssets),
    getLastCreatedPortfolios: util.promisify(finance.crm.getLastCreatedPortfolios),
    getBestPerformingPortfolios: util.promisify(finance.crm.getBestPerformingPortfolios),
    getWorstPerformingPortfolios: util.promisify(finance.crm.getWorstPerformingPortfolios),
    getHighProfileRiskPortfolios: util.promisify(finance.crm.getHighProfileRiskPortfolios),
    getLowProfileRiskPortfolios: util.promisify(finance.crm.getLowProfileRiskPortfolios),
    getHighProfileReturnPortfolios: util.promisify(finance.crm.getHighProfileReturnPortfolios),
    getLowProfileReturnPortfolios: util.promisify(finance.crm.getLowProfileReturnPortfolios)
});
