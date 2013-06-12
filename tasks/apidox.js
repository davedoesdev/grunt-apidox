/**
# grunt-apidox

[Grunt](http://gruntjs.com/) plugin to generate node.js API markdown using [apidox](https://github.com/codeactual/apidox).

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

## Configuration

Use the `apidox` property in your Grunt config. You can supply the following options:

- `input` (required, string): Source filename to generate documentation for. You can use Grunt [globbing patterns](http://gruntjs.com/api/grunt.file#globbing-patterns) to specify more than one file.

- `output` (optional, string): Name of the file to write the markdown into. Defaults to the same as the `input` filename but with the extension changed to `.md`.

- `outdir` (optional, string): Subdirectory to write `output` file into.

- `inputTitle` (optional, string |`false`): By default, `apidox` includes a line in the markdown saying it was generated from the `input` file. Set `inputTitle` to `false` to prevent this, or set it to a string to change the text.

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

## Licence

[MIT](LICENCE)

## Tests

```javascript
grunt test
```

## Lint

```javascript
grunt lint
```

*/

/*jslint node: true */
"use strict";

var path = require('path'),
    apidox = require('apidox');

module.exports = function (grunt)
{
    function convert(input, output, options)
    {
        var opt, dox = apidox.create();

        /*jslint forin: true */
        for (opt in options)
        {
            dox.set(opt, options[opt]);
        }
        /*jslint forin: false */

        dox.set('input', input);
        dox.set('output', output);
        dox.parse();

        grunt.file.write(output, dox.convert());
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
                            input = undefined;
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
