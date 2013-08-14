# grunt-apidox &nbsp;&nbsp;&nbsp;[![Build Status](https://travis-ci.org/davedoesdev/grunt-apidox.png)](https://travis-ci.org/davedoesdev/grunt-apidox)  [![Coverage Status](https://coveralls.io/repos/davedoesdev/grunt-apidox/badge.png?branch=master)](https://coveralls.io/r/davedoesdev/grunt-apidox?branch=master) [![NPM version](https://badge.fury.io/js/grunt-apidox.png)](http://badge.fury.io/js/grunt-apidox)

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

```javascript
grunt test
```

## Lint

```javascript
grunt lint
```

## Code Coverage

```javascript
grunt coverage
```

[Instanbul](http://gotwarlost.github.io/istanbul/) results are available [here](http://htmlpreview.github.io/?https://github.com/davedoesdev/grunt-apidox/blob/master/coverage/lcov-report/index.html).

Coveralls page is [here](https://coveralls.io/r/davedoesdev/grunt-apidox).

_Source: [tasks/apidox.js](tasks/apidox.js)_

<a name="tableofcontents"></a>


_&mdash;generated by [apidox](https://github.com/codeactual/apidox)&mdash;_
