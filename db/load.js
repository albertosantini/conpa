"use strict";

var fs = require("fs"),
    PouchDB = require("pouchdb"),
    pouchdbLoad = require("pouchdb-load");

PouchDB.plugin(pouchdbLoad);

var db = new PouchDB("http://localhost:5984/conpa");

db.info();

fs.readFile("dump.txt", "utf8", function (err1, data) {
    if (err1) {
        throw err1;
    }

    db.load(data).then(function () {
        console.log("Import done.");
    }).catch(function (err2) {
        throw err2;
    });
});
