// Quick and dirty getting started
//
// - clone the repo
// - cd to the project folder
// - npm install express@3.5.1
// - cd to the example folder
// - node server_example.js
// - add three assets and you get the optimal portfolio

"use strict";

var express = require("express"),
    conpa = require('../lib/conpa');

var app = express();

app.configure(function () {
    app.use(express["static"](["../lib/public/ConPA"]));
    app.use(express.bodyParser());
    app.use(express.errorHandler());
    app.use(express.cookieParser());
});

app.listen(process.env.PORT || 8001);

conpa.configure(app, express, {
    crm: {
        liveDomain: "x.y.z",
        liveUrl: "http://user1:pass1" +
            "@a.b.c",
        liveDb: "conpa",
        testingUrl: "http://user2:pass2" +
            "@a.b.c",
        testingDb: "staging",
        design: "ConPA"
    }
});

