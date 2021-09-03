"use strict";

exports.handler = async event => {
    console.log("Function `get-yahoo` invoked"); // eslint-disable-line

    const query = event.queryStringParameters.q;
    const lang = event.queryStringParameters.lang;
    const region = event.queryStringParameters.region;

    const url = "https://query1.finance.yahoo.com/v1/finance/search";

    try {
        const response = await request({
            url,
            body: {
                q: query,
                lang,
                region
            }
        });

        return {
            statusCode: 200,
            body: response
        };
    } catch (err) {
        return {
            statusCode: 404,
            body: err.toString()
        };
    }
};

const https = require("https");
const EventEmitter = require("events");

function request({
    url = "",
    body = null
} = {}) {
    return new Promise((resolve, reject) => {
        const ee = new EventEmitter();
        const reqUrl = new URL(url);
        const params = new URLSearchParams(body);
        const path = params ? `${reqUrl.pathname}?${params.toString()}` : reqUrl.pathname;
        const requestOptions = {
            host: reqUrl.hostname,
            port: 443,
            path,
            method: "GET",
            headers: {}
        };

        function requestResponse(res) {
            res.setEncoding("utf8");

            let rawData = "";

            res.on("data", chunk => {
                ee.emit("data", chunk);

                rawData += chunk;
            });

            res.on("end", () => resolve(rawData));
        }

        const req = https.request(requestOptions, requestResponse);

        req.on("error", err => reject(err));
        req.end();
    });
}
