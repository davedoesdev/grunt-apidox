/*jslint node: true */
"use strict";

module.exports = function (grunt)
{
    grunt.initConfig(
    {
        jslint: {
            all: {
                src: [ 'Gruntfile.js', 'tasks/*.js', 'test/*.js' ],
                directives: {
                    white: true
                }
            }
        },

        cafemocha: {
            src: 'test/*.js'
        },

        apidox: {
            input: 'tasks/apidox.js',
            output: 'README.md',
            fullSourceDescription: true
        },

        exec: {
            cover: {
                cmd: './node_modules/.bin/istanbul cover ./node_modules/.bin/grunt -- test'
            },

            check_cover: {
                cmd: './node_modules/.bin/istanbul check-coverage --statement 100 --branch 100 --function 100 --line 100'
            },

            coveralls: {
                cmd: 'cat coverage/lcov.info | coveralls'
            }
        }

    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-cafe-mocha');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', 'jslint:all');
    grunt.registerTask('test', 'cafemocha');
    grunt.registerTask('docs', 'apidox');
    grunt.registerTask('coverage', ['exec:cover', 'exec:check_cover']);
    grunt.registerTask('coveralls', 'exec:coveralls');
    grunt.registerTask('default', ['lint', 'test']);
};
