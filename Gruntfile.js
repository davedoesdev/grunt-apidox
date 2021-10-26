/*jslint node: true */
"use strict";

module.exports = function (grunt)
{
    grunt.initConfig(
    {
        jshint: {
            all: {
                src: [ 'Gruntfile.js', 'tasks/*.js', 'test/*.js' ],
                options: {
                    esversion: 6
                }
            }
        },

        mochaTest: {
            src: 'test/*.js'
        },

        apidox: {
            input: 'tasks/apidox.js',
            output: 'README.md',
            fullSourceDescription: true
        },

        shell: {
            cover: {
                command: "npx c8 -x Gruntfile.js -x 'test/**' ./node_modules/.bin/grunt test"
            },

            cover_report: {
                command: 'npx c8 report -r lcov'
            },

            cover_check: {
                command: 'npx c8 check-coverage --statements 100 --branches 100 --functions 100 --lines 100'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', 'jshint:all');
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('docs', 'apidox');
    grunt.registerTask('coverage', ['shell:cover',
                                    'shell:cover_report',
                                    'shell:cover_check']);
    grunt.registerTask('default', ['lint', 'test']);
};
