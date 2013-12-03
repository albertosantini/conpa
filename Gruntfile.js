module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        concat: {
            vendor: {
                src: [
                    'lib/public/ConPA/assets/js/jquery-1.10.2.min.js',
                    'lib/public/ConPA/assets/js/jquery.pubsub-0.7.min.js',
                    'lib/public/ConPA/assets/js/jquery.localstorage-0.1.js',
                    'lib/public/ConPA/assets/js/lodash-2.4.1.min.js',
                    'lib/public/ConPA/assets/js/typeahead-2.3.2.min.js'
                ],
                dest: 'lib/public/ConPA/build/vendor.js'
            },
            dist: {
                src: [
                    'lib/public/ConPA/js/errorMessage.js',
                    'lib/public/ConPA/js/portfolioDashboard.js',
                    'lib/public/ConPA/js/portfolioCRM.js',
                    'lib/public/ConPA/js/portfolioOptimization.js',
                    'lib/public/ConPA/js/portfolioCharts.js',
                    'lib/public/ConPA/js/assetStats.js',
                    'lib/public/ConPA/js/assetList.js',
                    'lib/public/ConPA/js/assetSearch.js',
                    'lib/public/ConPA/js/appUtil.js',
                    'lib/public/ConPA/js/app.js'
                ],
                dest: 'lib/public/ConPA/build/conpa.js'
            }
        },

        jshint: {
            backend: [
                'lib/conpa.js'
            ],
            before: ['<%= concat.dist.src %>'],
            after: ['<%= concat.dist.dest %>'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        uglify: {
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
                command: 'npm install ../..'
            },
            options: {
                execOptions: {
                    cwd: './dist/nodejitsu/'
                },
                stdout: true
            }
        },

        karma: {
            e2e: {
                configFile: './test/karma-e2e.conf.js',
                autoWatch: false,
                singleRun: true
            },
            e2e_auto: {
                configFile: './test/karma-e2e.conf.js'
            }
        },

        watch: {
            files: [
                'lib/**/*.js',
                'lib/**/*.html',
                'lib/**/*.css'
            ],
            tasks: [
                'default'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', [
        'jshint:backend',
        'jshint:before',
        'concat',
        'jshint:after',
        'uglify',
        'shell',
        'watch'
    ]);

};
