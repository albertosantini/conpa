"use strict";

exports.configure = configure;

var bodyParser = require("body-parser"),
    finance = require("finance");

var jsonParser = bodyParser.json();

function configure(app, config) {
    app.post("/api/getOptimalPortfolio", jsonParser, function (req, res) {
        if (config.rserve) {
            finance.portfolio
                .getOptimalPortfolio(req.body, function (err, data) {
                    if (!err) {
                        res.json(data);
                    }
                }, config.rserve);
        } else {
            finance.portfolio
                .getOptimalPortfolio(req.body, function (err, data) {
                    if (!err) {
                        res.json(data);
                    }
                });
        }
    });

    app.post("/api/getScriptOptimalPortfolio", jsonParser, function (req, res) {
        finance.portfolio
            .getScriptOptimalPortfolio(req.body, function (err, data) {
                if (!err) {
                    res.json(data);
                }
            });
    });

    app.post("/api/getKeyStatistics", jsonParser, function (req, res) {
        finance.keystatistics.getKeyStatistics(req.body, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });

    app.post("/api/getImpliedVolatility", jsonParser, function (req, res) {
        finance.volatility.getImpliedVolatility(req.body, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });

    finance.crm.configure(config.crm);

    app.post("/api/getPortfolio", jsonParser, function (req, res) {
        finance.crm.getPortfolio(req.body, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });

    app.post("/api/putPortfolioOnCRM", jsonParser, function (req, res) {
        finance.crm.putPortfolioOnCRM(req.body, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    });
    app.get("/api/getLastCreatedPortfolios", jsonParser, function (req, res) {
        finance.crm.getLastCreatedPortfolios(100, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getBestPerformingPortfolios", jsonParser, function (req, res) {
        finance.crm.getBestPerformingPortfolios(3, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getWorstPerformingPortfolios", jsonParser, function (req, res) {
        finance.crm.getWorstPerformingPortfolios(3, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getHighProfileRiskPortfolios", jsonParser, function (req, res) {
        finance.crm.getHighProfileRiskPortfolios(3, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getLowProfileRiskPortfolios", jsonParser, function (req, res) {
        finance.crm.getLowProfileRiskPortfolios(3, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getHighProfileReturnPortfolios", jsonParser, function (req, res) {
        finance.crm.getHighProfileReturnPortfolios(3, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getLowProfileReturnPortfolios", jsonParser, function (req, res) {
        finance.crm.getLowProfileReturnPortfolios(3, function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getPortfolioCount", jsonParser, function (req, res) {
        finance.crm.getPortfolioCount(function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
    app.get("/api/getMostUsedAssets", jsonParser, function (req, res) {
        finance.crm.getMostUsedAssets(function (err, data) {
            if (!err) {
                res.json(data);
            }
        });
    });
}
