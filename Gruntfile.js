/*jslint node: true */
"use strict";

const c8 = "npx c8 -x Gruntfile.js -x 'test/**'";

module.exports = function (grunt)
{
    grunt.initConfig(
    {
        eslint: {
            target: [ 'Gruntfile.js', 'tasks/*.js', 'test/*.js' ]
        },

        exec: Object.fromEntries(Object.entries({
            test: 'npx mocha',
            cover: `${c8} npx grunt test`,
            cover_report: `${c8} report -r lcov`,
            cover_check: `${c8} check-coverage --statements 100 --branches 100 --functions 100 --lines 100`
        }).map(([k, cmd]) => [k, { cmd, stdio: 'inherit' }])),

        apidox: {
            input: 'tasks/apidox.js',
            output: 'README.md',
            fullSourceDescription: true
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', 'eslint');
    grunt.registerTask('test', 'exec:test');
    grunt.registerTask('docs', 'apidox');
    grunt.registerTask('coverage', ['exec:cover',
                                    'exec:cover_report',
                                    'exec:cover_check']);
    grunt.registerTask('default', ['lint', 'test']);
};
