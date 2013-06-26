/*globals describe: false,
          beforeEach: false,
          afterEach: false,
          it: false */
/*jslint node: true, stupid: true */
"use strict";

var path = require('path'),
    sinon = require('sinon'),
    grunt = require('grunt'),
    fs = require('fs'),
    expect = require('chai').expect;

describe('files', function ()
{
    var sandbox = sinon.sandbox.create();

    function run()
    {
        var context = { name: 'apidox', nameArgs: 'apidox' };
        /*jslint nomen: true */
        grunt.task._tasks.apidox.fn.call(context, grunt);
        /*jslint nomen: false */
    }

    beforeEach(function (done)
    {
        process.chdir(path.join('test', 'fixtures'));
        sandbox.spy(fs, 'readFileSync');
        sandbox.stub(grunt.file, 'write');
        done();
    });

    afterEach(function (done)
    {
        process.chdir(path.join('..', '..'));
        sandbox.restore();
        done();
    });

    it('should write to specified output file', function (done)
    {
        grunt.config('apidox', [{
            input: 'index.js',
            output: 'README.md'
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve('README.md'), sinon.match.any), 'write README.md').to.equal(true);

        done();
    });

    it('should write to specified output directory', function (done)
    {
        grunt.config('apidox', [{
            input: 'index.js',
            output: 'README.md',
            outdir: 'docs'
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'README.md')), sinon.match.any), 'write docs/README.md').to.equal(true);

        done();
    });

    it('should write to subdirectory within output directory', function (done)
    {
        grunt.config('apidox', [{
            input: 'index.js',
            output: 'foo/README.md',
            outdir: 'docs'
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'README.md')), sinon.match.any), 'write docs/foo/README.md').to.equal(true);

        done();
    });

    it('should write specified input title to output', function (done)
    {
        var title = String(Math.random());

        grunt.config('apidox', [{
            input: 'index.js',
            output: 'foo/README.md',
            outdir: 'docs',
            inputTitle: title
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'README.md')), sinon.match.any), 'write docs/foo/README.md').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'README.md')), sinon.match(title)), 'write title ' + title).to.equal(true);


        done();
    });

    it('should hide source information', function (done)
    {
        grunt.config('apidox', [{
            input: 'index.js',
            output: 'foo/README.md',
            outdir: 'docs',
            inputTitle: false
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'README.md')), sinon.match.any), 'write docs/foo/README.md').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'README.md')), sinon.match('_Source:')), 'no source info').to.equal(false);


        done();
    });

    it('should read from subdirectory', function (done)
    {
        grunt.config('apidox', [{
            input: 'foo/bar.js',
            output: 'wup.js',
            outdir: 'docs'
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar.js'), 'read foo/bar.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'wup.js')), sinon.match.any), 'write docs/wup.js').to.equal(true);

        done();
    });

    it('should infer output filename from input', function (done)
    {
        grunt.config('apidox', [{
            input: 'index.js'
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve('index.md'), sinon.match.any), 'write index.md').to.equal(true);

        done();
    });

    it('should write to output directory when inferring output filename', function (done)
    {
        grunt.config('apidox', [{
            input: 'index.js',
            outdir: 'docs'
        }]);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'index.md')), sinon.match.any), 'write docs/index.md').to.equal(true);

        done();
    });

    it('should support single string as input filename', function (done)
    {
        grunt.config('apidox', ['index.js']);

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve('index.md'), sinon.match.any), 'write index.md').to.equal(true);

        done();
    });

    it('should support array-less configuration as input filename', function (done)
    {
        grunt.config('apidox', 'index.js');

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve('index.md'), sinon.match.any), 'write index.md').to.equal(true);

        done();
    });

    it('should support array-less configuration as input filename', function (done)
    {
        grunt.config('apidox', { input: 'index.js' });

        run();

        expect(fs.readFileSync.calledOnce, 'read once').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve('index.md'), sinon.match.any), 'write index.md').to.equal(true);

        done();
    });

    it('should support wildcards', function (done)
    {
        grunt.config('apidox', [{
            input: '*.js',
            outdir: 'docs'
        }]);

        run();

        expect(fs.readFileSync.calledTwice, 'read twice').to.equal(true);
        expect(fs.readFileSync.calledWith('index.js'), 'read index.js').to.equal(true);
        expect(fs.readFileSync.calledWith('test.js'), 'read test.js').to.equal(true);

        expect(grunt.file.write.calledTwice, 'write twice').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'index.md')), sinon.match.any), 'write docs/index.md').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'test.md')), sinon.match.any), 'write docs/test.md').to.equal(true);

        done();
    });

    it('should support wildcards from subdirectory', function (done)
    {
        grunt.config('apidox', [{
            input: 'foo/*.js',
            outdir: 'docs'
        }]);

        run();

        expect(fs.readFileSync.calledTwice, 'read twice').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar.js'), 'read foo/bar.js').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar2.js'), 'read foor/bar2.js').to.equal(true);

        expect(grunt.file.write.calledTwice, 'write twice').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'bar.md')), sinon.match.any), 'write docs/bar.md').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'foo', 'bar2.md')), sinon.match.any), 'write docs/bar2.md').to.equal(true);

        done();
    });

    it('should support processing multiple files and generating a single document', function (done)
    {
        grunt.config('apidox', [{
            input: 'foo/*.js',
            outdir: 'docs',
            output: 'multi.md'
        }]);

        run();

        expect(fs.readFileSync.calledTwice, 'read twice').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar.js'), 'read foo/bar.js').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar2.js'), 'read foor/bar2.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'multi.md')), sinon.match.any), 'write docs/multi.md').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'multi.md')), sinon.match('_Source:')), 'no source info').to.equal(false);

        done();
    });

    it('should support processing multiple files and generating a single document with specified source information', function (done)
    {
        var title = String(Math.random());

        grunt.config('apidox', [{
            input: 'foo/*.js',
            outdir: 'docs',
            output: 'multi.md',
            inputTitle: title
        }]);

        run();

        expect(fs.readFileSync.calledTwice, 'read twice').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar.js'), 'read foo/bar.js').to.equal(true);
        expect(fs.readFileSync.calledWith('foo/bar2.js'), 'read foor/bar2.js').to.equal(true);

        expect(grunt.file.write.calledOnce, 'write once').to.equal(true);
        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'multi.md')), sinon.match.any), 'write docs/multi.md').to.equal(true);

        expect(grunt.file.write.calledWith(path.resolve(path.join('docs', 'multi.md')), sinon.match(title)), 'no source info').to.equal(true);

        done();
    });

    it('should not read or write if no input specified', function (done)
    {
        grunt.config('apidox', [{
            output: 'README.md'
        }]);

        run();

        expect(fs.readFileSync.called).to.equal(false);
        expect(grunt.file.write.called).to.equal(false);

        done();
    });

    it('should not read or write if input does not exist', function (done)
    {
        grunt.config('apidox', [{
            input: '*.foobar',
            output: 'README.md'
        }]);

        run();

        expect(fs.readFileSync.called).to.equal(false);
        expect(grunt.file.write.called).to.equal(false);

        done();
    });
});
