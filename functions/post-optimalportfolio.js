"use strict";

const util = require("util");
const finance = require("finance");

const getOptimalPortfolio = util.promisify(finance.portfolio.getOptimalPortfolio);

exports.handler = async event => {
    console.log("Function `post-optimalportfolio` invoked"); // eslint-disable-line

    const ptfParams = JSON.parse(event.body);

    return getOptimalPortfolio(ptfParams).then(data => ({
        statusCode: 200,
        body: JSON.stringify(data)
    })).catch(error => ({
        statusCode: 400,
        body: JSON.stringify(error)
    }));
};
