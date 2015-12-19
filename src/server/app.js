"use strict";

var os = require("os"),
    path = require("path"),
    express = require("express"),
    routes = require("./routes");

var app = express(),
    hostname = os.hostname(),
    port = process.env.CONPA_PORT || 8080,
    documentRoot = path.join(__dirname, "../client"),
    liveUrl = process.env.CONPA_LIVE_URL,
    testingUrl = process.env.CONPA_TEST_URL;

if (!liveUrl && !testingUrl) {
    throw new Error("CONPA_LIVE_URL and CONPA_TEST_URL not defined.");
}

process.on("uncaughtException", function (err) {
    console.log(err.stack);
});

app.get("/status", function (req, res) {
    res.send("ConPA is running on " + hostname + " on " + process.version);
});

app.use(express.static(documentRoot));

routes.configure(app, {
    crm: {
        liveDomain: hostname,
        // liveDomain: "foo.com",
        liveUrl: liveUrl,
        liveDb: "conpa",
        testingUrl: testingUrl,
        testingDb: "conpa-staging",
        design: "ConPA"
    }
});

app.listen(port, function () {
    console.log("ConPA document root is " + documentRoot);
    console.log("ConPA listening on http://" + hostname + ":" + port);
});
