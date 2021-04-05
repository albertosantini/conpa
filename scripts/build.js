"use strict";

const path = require("path");
const shell = require("shelljs");

function build() {
    const outputFolder = path.join(__dirname, "../public/");
    const outputNodeModulesFolder = path.join(__dirname, "../public/node_modules");
    const sourceFolder = path.join(__dirname, "../src/client/*");
    const nodeModulesFolder = path.join(__dirname, "../node_modules");
    const hyperhtmlDep = path.join(nodeModulesFolder, "hyperhtml/");
    const tachyonslDep = path.join(nodeModulesFolder, "tachyons/");

    shell.rm("-rf", outputFolder);
    shell.mkdir("-p", outputFolder);
    shell.mkdir("-p", outputNodeModulesFolder);
    shell.cp("-R", sourceFolder, outputFolder);
    shell.cp("-R", hyperhtmlDep, `${outputNodeModulesFolder}/hyperhtml/`);
    shell.cp("-R", tachyonslDep, `${outputNodeModulesFolder}/tachyons/`);
}
module.exports = build;

build();
