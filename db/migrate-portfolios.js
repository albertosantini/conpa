// Migarate portfolios from couchdb (Cloudant) to PostgreSQL (Supabase)

"use strict";

const urlParse = require("url").parse;
const https = require("https");
const { createClient } = require("@supabase/supabase-js");

function toBase64(str) {
    return Buffer.from(str || "", "utf8").toString("base64");
}

function request({
    url = ""
} = {}) {
    return new Promise((resolve, reject) => {
        const reqUrl = urlParse(url);
        const host = reqUrl.hostname;
        const port = reqUrl.port || 443;
        const path = reqUrl.path;
        const auth = reqUrl.auth;
        const headers = {};

        if (auth) {
            headers.Authorization = `Basic ${toBase64(auth)}`;
        }

        const requestOptions = {
            host,
            port,
            path,
            method: "GET",
            headers
        };

        function requestResponse(res) {
            res.setEncoding("utf8");

            let rawData = "";

            res.on("data", chunk => {
                rawData += chunk;
            });

            res.on("end", () => resolve(rawData));
        }

        // @ts-ignore
        const req = https.request(requestOptions, requestResponse);

        req.on("error", err => reject(err));

        req.end();
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function main() {
    await request({
        url: `${process.env.CONPA_LIVE_URL}/conpa/_all_docs`
    }).then(async data => {
        const allDocs = JSON.parse(data);

        console.log(`Docs count ....... : ${allDocs.total_rows}`); // eslint-disable-line

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        let processedDocs = 0;

        await asyncForEach(allDocs.rows, async row => {
            if (row.id.search("design") === -1) {
                const docUrl = `${process.env.CONPA_LIVE_URL}/conpa/${row.id}`;

                await request({
                    url: docUrl
                }).then(async data2 => {
                    const doc = JSON.parse(data2);

                    await supabase
                        .from("portfolios")
                        .insert([
                            {
                                created_at: doc.created_at, // eslint-disable-line
                                ref: doc.ref,
                                assets: doc.assets,
                                weights: doc.weights,
                                ret: doc.ret,
                                risk: doc.risk,
                                perf: doc.perf,
                                lows: doc.constraints?.lowBounds,
                                highs: doc.constraints?.highBounds
                            }
                        ]);

                    processedDocs += 1;
                }).catch(err2 => {
                    throw new Error(err2);
                });
            }
        });

        console.log(`Docs processed ... : ${processedDocs}`); // eslint-disable-line
    }).catch(err => {
        throw new Error(err);
    });
}

main();
