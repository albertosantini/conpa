/*jslint node:true, nomen:true */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        concat: {
            vendor: {
                src: [
                    'lib/public/ConPA/assets/js/jquery-1.8.2.min.js',
                    'lib/public/ConPA/assets/js/jquery.pubsub-0.7.min.js',
                    'lib/public/ConPA/assets/js/jquery.sparkline-2.0.min.js',
                    'lib/public/ConPA/assets/js/jquery.localstorage-0.1.js',
                    'lib/public/ConPA/assets/js/lodash-0.9.0.min.js',
                    'lib/public/ConPA/assets/js/bootstrap-2.1.1.min.js'
                ],
                dest: 'lib/public/ConPA/build/vendor.js'
            },
            dist: {
                src: [
                    'lib/public/ConPA/js/errorMessage.js',
                    'lib/public/ConPA/js/portfolioDashboard.js',
                    'lib/public/ConPA/js/portfolioCRM.js',
                    'lib/public/ConPA/js/portfolioOptimization.js',
                    'lib/public/ConPA/js/assetStats.js',
                    'lib/public/ConPA/js/assetList.js',
                    'lib/public/ConPA/js/assetSearch.js',
                    'lib/public/ConPA/js/appUtil.js',
                    'lib/public/ConPA/js/app.js'
                ],
                dest: 'lib/public/ConPA/build/conpa.js'
            }
        },

        lint: {
            before: ['<config:concat.dist.src>'],
            after: ['<config:concat.dist.dest>']
        },

        jshint: {
            options: {
                // https://github.com/jquery/jquery/blob/master/.jshintrc
                "curly": true,
                "eqeqeq": true,
                "eqnull": true,
                "expr": true,
                "latedef": true,
                "noarg": true,
                "node": true,
                // "quotmark": "double",
                "smarttabs": true,
                "trailing": true,
                "undef": true,
                "unused": true,
                // project options
                'white': true
            }
        },

        min: {
            dist: {
                src: ['lib/public/ConPA/build/conpa.js'],
                dest: 'lib/public/ConPA/build/conpa.min.js'
            }
        },

        shell: {
            remove: {
                command: 'npm rm conpa'
            },
            install: {
                command: 'npm install ../../node-conpa'
            },
            _options: {
                execOptions: {
                    cwd: '../nodester/conpa/'
                }
            }
        },

        watch: {
            files: [
                'lib/**/*.js',
                'lib/**/*.html',
                'lib/**/*.css'
            ],
            tasks: [
                'lint:before',
                'concat',
                'lint:after',
                'min',
                'shell'
            ]
        }
    });

    // https://github.com/sindresorhus/grunt-shell/blob/master/tasks/shell.js
    grunt.registerMultiTask('shell', 'Run shell commands', function () {
        var _ = grunt.utils._,
            data = _.extend([], grunt.config.get('shell')._options, this.data),
            exec = require('child_process').exec,
            done = this.async();

        exec(data.command, data.execOptions, function () {
            done();
        });
    });

    grunt.registerTask('default', [
        'lint:before',
        'concat',
        'lint:after',
        'min',
        'shell',
        'watch'
    ]);
};
