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
    method = "GET",
    headers = {},
    body = null
} = {}) {
    return new Promise((resolve, reject) => {
        const ee = new EventEmitter();
        const reqUrl = new URL(url);
        const host = reqUrl.hostname;
        const port = 443;

        let path = reqUrl.pathname;

        if (method === "GET" && Object.keys(body).length) {
            const params = new URLSearchParams(body);

            path += `?${params.toString()}`;
        }

        headers["Content-Type"] = headers["Content-Type"] || "application/json";

        const requestOptions = {
            host,
            port,
            path,
            method,
            headers
        };

        function requestResponse(res) {
            ee.emit("response");

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
