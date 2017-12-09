"use strict";

var os = require("os"),
    path = require("path"),
    express = require("express"),
    RateLimit = require("express-rate-limit"),
    routes = require("./routes");

var apiLimiter = new RateLimit({
    windowMs: 1000,
    max: 0,
    delayAfter: 2,
    delayMs: 500
});

var app = express(),
    hostname = os.hostname(),
    port = process.env.CONPA_PORT || 80,
    documentRoot = path.resolve(__dirname, "../client"),
    nodeModules = path.resolve(__dirname, "../../node_modules/"),
    liveUrl = process.env.CONPA_LIVE_URL || "http://localhost:5984",
    testingUrl = process.env.CONPA_TEST_URL || "http://localhost:5984";

process.on("uncaughtException", function (err) {
    console.log(err.stack);
});

app.get("/status", function (req, res) {
    res.send(`ConPA is running on ${hostname} on ${process.version}`);
});

app.use("/api/", apiLimiter);
app.use(express.static(documentRoot));
app.use("/node_modules", express.static(nodeModules));

routes.configure(app, {
    crm: {
        liveDomain: hostname,

        // liveDomain: "foo.com",
        liveUrl: liveUrl,
        liveDb: "conpa",
        testingUrl: testingUrl,
        testingDb: "conpa",
        design: "ConPA"
    }
});

app.listen(port, function () {
    console.log(`ConPA document root is ${documentRoot}`);
    console.log(`ConPA node_modules root is ${nodeModules}`);
    console.log(`ConPA listening on http://${hostname}:${port}`);
});
