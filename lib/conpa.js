var finance = require('finance');

function configure(app, express, config) {
    'use strict';

    var d = __dirname + '/public';

    if (config.pubdir) {
        d = __dirname + config.pubdir;
    }

    app.configure(function () {
        /*jshint es3: false */
        app.use(express.static(d));
    });

    app.post('/ConPA/getOptimalPortfolio', function (req, res) {
        if (config.rserve) {
            finance.portfolio
                .getOptimalPortfolio(req.body, function (err, data) {
                    res.contentType('application/json');
                    res.send(data);
                }, config.rserve);
        } else {
            finance.portfolio
                .getOptimalPortfolio(req.body, function (err, data) {
                    res.contentType('application/json');
                    res.send(data);
                });
        }
    });

    app.post('/ConPA/getScriptOptimalPortfolio', function (req, res) {
        finance.portfolio
            .getScriptOptimalPortfolio(req.body, function (err, data) {
                res.contentType('application/json');
                res.send(data);
            });
    });

    app.post('/ConPA/getKeyStatistics', function (req, res) {
        finance.keystatistics.getKeyStatistics(req.body, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });

    app.post('/ConPA/getImpliedVolatility', function (req, res) {
        finance.volatility.getImpliedVolatility(req.body, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });

    finance.crm.configure(config.crm);

    app.post('/ConPA/getPortfolio', function (req, res) {
        finance.crm.getPortfolio(req.body, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });

    app.post('/ConPA/putPortfolioOnCRM', function (req, res) {
        finance.crm.putPortfolioOnCRM(req.body, function (err, data) {
            res.send(data);
        });
    });
    app.get('/ConPA/getLastCreatedPortfolios', function (req, res) {
        finance.crm.getLastCreatedPortfolios(100, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getBestPerformingPortfolios', function (req, res) {
        finance.crm.getBestPerformingPortfolios(3, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getWorstPerformingPortfolios', function (req, res) {
        finance.crm.getWorstPerformingPortfolios(3, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getHighProfileRiskPortfolios', function (req, res) {
        finance.crm.getHighProfileRiskPortfolios(3, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getLowProfileRiskPortfolios', function (req, res) {
        finance.crm.getLowProfileRiskPortfolios(3, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getHighProfileReturnPortfolios', function (req, res) {
        finance.crm.getHighProfileReturnPortfolios(3, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getLowProfileReturnPortfolios', function (req, res) {
        finance.crm.getLowProfileReturnPortfolios(3, function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getPortfolioCount', function (req, res) {
        finance.crm.getPortfolioCount(function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
    app.get('/ConPA/getMostUsedAssets', function (req, res) {
        finance.crm.getMostUsedAssets(function (err, data) {
            res.contentType('application/json');
            res.send(data);
        });
    });
}
exports.configure = configure;
