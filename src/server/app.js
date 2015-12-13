"use strict";

var os = require("os"),
    path = require("path"),
    express = require("express"),
    routes = require("./routes");

var app = express(),
    hostname = os.hostname(),
    port = process.env.CONPA_PORT || 8080,
    documentRoot = path.join(__dirname, "../client");

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
        liveUrl: process.env.CONPA_LIVE_URL,
        liveDb: "conpa",
        testingUrl: process.env.CONPA_TEST_URL,
        testingDb: "conpa-staging",
        design: "ConPA"
    }
});

app.listen(port, function () {
    console.log("ConPA document root is " + documentRoot);
    console.log("ConPA listening on http://" + hostname + ":" + port);
});
