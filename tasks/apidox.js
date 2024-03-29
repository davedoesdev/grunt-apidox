/**
# grunt-apidox &nbsp;&nbsp;&nbsp;[![ci](https://github.com/davedoesdev/grunt-apidox/actions/workflows/ci.yml/badge.svg)](https://github.com/davedoesdev/grunt-apidox/actions/workflows/ci.yml) [![Coverage Status](https://coveralls.io/repos/davedoesdev/grunt-apidox/badge.png?branch=master)](https://coveralls.io/r/davedoesdev/grunt-apidox?branch=master) [![NPM version](https://badge.fury.io/js/grunt-apidox.png)](http://badge.fury.io/js/grunt-apidox)

[Grunt](http://gruntjs.com/) plugin to generate Node.js API markdown using [apidox](https://github.com/codeactual/apidox).

Example:

```javascript
grunt.initConfig(
{
    apidox: {
        input: 'index.js',
        output: 'README.md'
    }
});

grunt.loadNpmTasks('grunt-apidox');
grunt.registerTask('docs', 'apidox');
```

## Installation

```shell
npm install grunt-apidox
```

## Configuration

Use the `apidox` property in your Grunt config. You can supply the following options:

- `input` (required, string): Source filename to generate documentation for. You can use Grunt [globbing patterns](http://gruntjs.com/api/grunt.file#globbing-patterns) to specify more than one file.

- `output` (optional, string): Name of the file to write the markdown into. Defaults to the same as the `input` filename but with the extension changed to `.md`.

- `outdir` (optional, string): Subdirectory to write `output` file into.

- `inputTitle` (optional, string |`false`): By default, `apidox` includes a line in the markdown saying it was generated from the `input` file. Set `inputTitle` to `false` to prevent this, or set it to a string to change the text.

- `fullSourceDescription` (optional, boolean): By default, `apidox` includes only the first paragraph of the first comment in the output. Set `fullSourceDescription` to `true` to include all of the first comment in the output.

- `sections` (optional, object): Use this to divide the table of contents into sections. Each key in `sections` is the name of the first function in a section. The value is the markdown to insert before the link to the function in the table of contents.

  Use a key with the empty string to insert markdown after the table of contents.

- `extraHeadingLevels` (optional, integer): By default, `apidox` generates level 1 headings for each API entry. Set `extraHeadingLevels` if you want to change this. For example, to generate level 3 headings, set `extraHeadingLevels` to 2.

## More Examples

Write to a subdirectory:

```javascript
apidox: {
    input: 'index.js',
    output: 'README.md',
    outdir: 'docs'
}
```

Set the text of the source link in the markdown to `bar`:

```javascript
apidox: {
    input: 'index.js',
    output: 'README.md',
    inputTitle: 'bar'
}
```

Don't show source link:

```javascript
apidox: {
    input: 'index.js',
    output: 'README.md',
    inputTitle: false
}
```

Write to `index.md`:

```javascript
apidox: 'index.js'
```

Use a wildcard to process multiple source files and generate a separate markdown file for each one:

```javascript
apidox: {
    input: '*.js',
    outdir: 'docs'
}
```

Use a wildcard to process multiple source files and generate a single markdown file:

```javascript
apidox: {
    input: '*.js',
    output: 'README.md'
}
```

Split the table of contents into two sections, `foo` and `bar`:

```javascript
apidox: {
    input: 'index.js',
    sections: {
        someFunction: '##foo',
        someOtherFunction: '##bar'
    }
}
```

## Licence

[MIT](LICENCE)

## Tests

```shell
grunt test
```

## Lint

```shell
grunt lint
```

## Code Coverage

```shell
grunt coverage
```

[c8](https://github.com/bcoe/c8) results are available [here](http://rawgit.davedoesdev.com/davedoesdev/grunt-apidox/master/coverage/lcov-report/index.html).

Coveralls page is [here](https://coveralls.io/r/davedoesdev/grunt-apidox).
*/

/*jslint node: true */
"use strict";

var path = require('path'),
    apidox = require('apidox'),
    lodash = require('lodash'),
    jsdoctypeparser = require('jsdoctypeparser'),
    orig_parse = jsdoctypeparser.parse;

jsdoctypeparser.parse = function (s, opts)
{
    let r = orig_parse.call(this, s, opts);

    while (r && r.type === jsdoctypeparser.NodeType.MEMBER)
    {
        r.owner.name += '.' + r.name;
        r = r.owner;
    }

    return r;
}

module.exports = function (grunt)
{
    lodash.pluck = lodash.map;

    function convert(input, output, options)
    {
        var opt, dox = apidox.create(), out, section, re;

        grunt.util.hooker.hook(dox, 'h', function (level, text)
        {
            return grunt.util.hooker.filter(this, [(options.extraHeadingLevels || 0) + level, text]);
        });

        /*jslint forin: true */
        for (opt in options)
        {
            dox.set(opt, options[opt]);
        }
        /*jslint forin: false */

        dox.set('input', input);
        dox.set('output', output);

        grunt.util.hooker.hook(require('dox'), 'parseComments', function (js, opts)
        {
            opts = Object.assign({}, opts, options.doxOptions);
            return grunt.util.hooker.filter(this, [js, opts]);
        });

        dox.parse();

        grunt.util.hooker.unhook(require('dox'), 'parseComments');

        out = dox.convert();

        if (options.sections)
        {
            if (options.sections[''] !== undefined)
            {
                re = new RegExp('<a name="tableofcontents"></a>\\n\\n(- [^\\n]*\\n)*\\n');
                out = out.replace(re, '$&' + options.sections[''] + '\n\n');
            }

            /*jslint forin: true */
            for (section in options.sections)
            {
                if (section)
                {
                    re = new RegExp('- <a name="toc_' + section.toLowerCase().replace(/\./g, '') + '.*</a>\\[' + section + '\\]');
                    out = out.replace(re, options.sections[section] + '\n$&');
                }
            }
            /*jslint forin: false */
        }

        grunt.file.write(output, out);
    }

    function readFiles(files)
    {
        return files.map(function (f)
        {
            return grunt.file.read(f);
        }).join('');
    }

    grunt.registerTask('apidox', 'Generate node.js API markdown with dox',
    function ()
    {
        grunt.config.requires('apidox');

        var config = grunt.config('apidox'),
            i, j, cfg, input, output, outdir, files;

        if ((typeof config === 'string') ||
            (config.length === undefined))
        {
            config = [config];
        }

        for (i = 0; i < config.length; i += 1)
        {
            cfg = config[i];

            if (typeof cfg === 'string')
            {
                input = cfg;
                output = null;
                outdir = null;
                cfg = {};
            }
            else
            {
                cfg = Object.create(cfg);
                input = cfg.input;
                output = cfg.output;
                outdir = cfg.outdir;
            }

            outdir = path.normalize(outdir || '');

            if (input)
            {
                files = grunt.file.expand(input);

                if (output)
                {
                    if (files.length > 0)
                    {
                        if (files.length === 1)
                        {
                            input = files[0];
                        }
                        else
                        {
                            input = '.';
                            cfg.inputText = readFiles(files);

                            if (typeof cfg.inputTitle !== 'string')
                            {
                                cfg.inputTitle = false;
                            }
                        }

                        output = path.resolve(outdir, output);
                        convert(input, output, cfg);
                    }
                }
                else
                {
                    for (j = 0; j < files.length; j += 1)
                    {
                        input = files[j];
                        output = path.resolve(
                            outdir,
                            path.join(
                                path.dirname(input),
                                path.basename(
                                    input,
                                    path.extname(input)) + '.md'));
                        convert(input, output, cfg);
                    }
                }
            }
        }
    });
};
