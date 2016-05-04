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
                command: './node_modules/.bin/istanbul cover ./node_modules/.bin/grunt -- test'
            },

            check_cover: {
                command: './node_modules/.bin/istanbul check-coverage --statement 100 --branch 100 --function 100 --line 100'
            },

            coveralls: {
                command: 'cat coverage/lcov.info | coveralls'
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
    grunt.registerTask('coverage', ['shell:cover', 'shell:check_cover']);
    grunt.registerTask('coveralls', 'shell:coveralls');
    grunt.registerTask('default', ['lint', 'test']);
};
