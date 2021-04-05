"use strict";

const util = require("util");
const finance = require("finance");

const getKeyStatistics = util.promisify(finance.keystatistics.getKeyStatistics);

exports.handler = async event => {
    console.log("Function `get-keystatistics` invoked"); // eslint-disable-line

    const symbol = event.queryStringParameters.symbol;

    return getKeyStatistics({ symbol }).then(data => ({
        statusCode: 200,
        body: JSON.stringify(data)
    })).catch(error => ({
        statusCode: 400,
        body: JSON.stringify(error)
    }));
};
