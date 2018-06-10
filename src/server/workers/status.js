"use strict";

const workway = require("workway");

const log = require("../util").log;

log("Status worker engaged");

workway({
    message: `Running on Node.js ${process.version}`
});
