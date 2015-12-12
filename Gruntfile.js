"use strict";

module.exports = function (grunt) {

    grunt.initConfig({

        eslint: {
            src: [
                "Gruntfile.js",
                "index.js",
                "karma.conf.js",
                "src/**/*.js"
            ]
        }

    });

    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("default", [
        "eslint"
    ]);

};
