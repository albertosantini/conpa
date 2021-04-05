"use strict";

const chokidar = require("chokidar");

const build = require("./build");

chokidar.watch("./src").on("change", path => {
    console.log(`Building for ${path}...`); // eslint-disable-line
    build();
    console.log("done."); // eslint-disable-line
});
