/*jslint node: true */
"use strict";

module.exports = function (grunt)
{
    grunt.initConfig(
    {
        jslint: {
            files: [ 'Gruntfile.js', 'tasks/*.js', 'test/*.js' ],
            directives: {
                white: true
            }
        },

        cafemocha: {
            src: 'test/*.js'
        },

        apidox: {
            input: 'tasks/apidox.js',
            output: 'README.md'
        }
    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-cafe-mocha');
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', 'jslint');
    grunt.registerTask('test', 'cafemocha');
    grunt.registerTask('docs', 'apidox');
    grunt.registerTask('default', ['jslint', 'cafemocha']);
};
