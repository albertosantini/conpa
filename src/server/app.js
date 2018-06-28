"use strict";

const express = require("express");
const path = require("path");
const workway = require("workway/node");

const { log } = require("./util");

workway.authorize(path.join(__dirname, "workers"));

const app = workway.app(express());
const port = process.env.CONPA_PORT || 80;
const documentRoot = path.resolve(__dirname, "../client");
const nodeModules = path.resolve(__dirname, "../../node_modules/");

process.on("uncaughtException", err => {
    log(err.stack);
});

app.use(express.static(documentRoot));
app.use("/node_modules", express.static(nodeModules));

app.listen(port, () => {
    log(`http://localhost:${port}`);
});
