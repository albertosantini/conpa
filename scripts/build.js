"use strict";

function build() {
    const fs = require("fs");
    const path = require("path");
    const shell = require("shelljs");

    const outputFolder = path.join(__dirname, "../public/");
    const outputNodeModulesFolder = path.join(__dirname, "../public/node_modules");
    const sourceFolder = path.join(__dirname, "../src/client/*");
    const nodeModulesFolder = path.join(__dirname, "../node_modules");
    const hyperhtmlDep = path.join(nodeModulesFolder, "hyperhtml/");
    const tachyonslDep = path.join(nodeModulesFolder, "tachyons/");


    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    if (!fs.existsSync(outputNodeModulesFolder)) {
        fs.mkdirSync(outputNodeModulesFolder);
    }

    shell.cp("-R", sourceFolder, outputFolder);
    shell.cp("-R", hyperhtmlDep, `${outputNodeModulesFolder}/hyperhtml/`);
    shell.cp("-R", tachyonslDep, `${outputNodeModulesFolder}/tachyons/`);
}
module.exports = build;

build();
