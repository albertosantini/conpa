"use strict";

// On Windows 7
// export CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe

var shared = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha'],
        reporters: ['progress'],
        browsers: ['Chrome'],
        autoWatch: true,

        // these are default values anyway
        singleRun: false,
        colors: true
    });
};

shared.files = [
    // Unit Test Conf
    // 3rd Party Code
    // App-specific Code
    // Test-Specific Code
];

module.exports = shared;
