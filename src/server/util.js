"use strict";

exports.log = log;

function log(...args) {
    const now = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    console.warn(now, ...args);
}
