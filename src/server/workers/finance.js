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

const apis = [
    { name: "getOptimalPortfolio", domain: "portfolio", limit: false },
    { name: "getScriptOptimalPortfolio", domain: "portfolio", limit: false },
    { name: "getKeyStatistics", domain: "keystatistics", limit: false },
    { name: "savePortfolio", domain: "crm", key: "putPortfolioOnCRM", limit: true },
    { name: "getPortfolioCount", domain: "crm", limit: true },
    { name: "getMostUsedAssets", domain: "crm", limit: true },
    { name: "getLastCreatedPortfolios", domain: "crm", limit: true },
    { name: "getBestPerformingPortfolios", domain: "crm", limit: true },
    { name: "getWorstPerformingPortfolios", domain: "crm", limit: true },
    { name: "getHighProfileRiskPortfolios", domain: "crm", limit: true },
    { name: "getLowProfileRiskPortfolios", domain: "crm", limit: true },
    { name: "getHighProfileReturnPortfolios", domain: "crm", limit: true },
    { name: "getLowProfileReturnPortfolios", domain: "crm", limit: true }
];

const workwayApis = {};

apis.forEach(api => {
    const name = api.name;
    const domain = api.domain;
    const key = api.key || api.name;

    if (api.limit) {
        finance[domain][key][util.promisify.custom] = function(arg) {
            return throttleRequest(finance[domain][key], arg);
        };
    }

    workwayApis[name] = util.promisify(finance[domain][key]);
});

workway(workwayApis);
