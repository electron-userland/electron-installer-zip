var proxyquire = require('proxyquire');
var assert = require('assert');
var path = require('path');
var fs = require('fs-extra');
var sinon = require('sinon');

describe('electron-installer-zip', function() {
  it('should be requireable', function() {
    assert(require('../'));
  });

  it('should use `which zip` --symlinks on darwin', function(done) {
    var options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'dist'),
      platform: 'darwin'
    };

    var zip = proxyquire('../', {
      'electron-installer-run': function(bin, args, opts, cb) {
        assert.equal(bin, 'zip');
        assert(args.indexOf('--symlinks') > -1);
        assert.equal(opts.cwd, path.join(options.dir, '..'));
        cb(null, opts);
      },
      'zip-folder': function(src, dest, cb) {
        cb(new Error('Should not have called zip-folder!'));
      }
    });
    zip(options, done);
  });

  it('should refuse to wipe a directory', function(done) {
    var options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'fixtures', 'bad.zip')
    };

    var zip = proxyquire('../', {});
    zip(options, function(err, outPath) {
      assert.notStrictEqual(err, null);
      assert.strictEqual(outPath, undefined);
      assert.ok(err.message.includes('is a directory'));
      done();
    });
  });

  it('should make a zip file in the out dir', function(done) {
    var options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'fixtures')
    };

    fs.writeFile(options.out, 'content', function() {
      var zip = proxyquire('../', {});
      zip(options, function(err, outPath) {
        assert.strictEqual(err, null);
        assert.strictEqual(outPath, path.resolve(options.out, 'bin.zip'));
        fs.exists(outPath, function(exists) {
          assert.ok(exists);
          done();
        });
      });
    });
  });

  it('should wipe the out file if it already exists', function(done) {
    var options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'fixtures', 'good.zip')
    };

    var unlinkSpy = sinon.spy(fs, 'unlink');

    fs.writeFile(options.out, 'content', function() {
      var zip = proxyquire('../', {});
      zip(options, function(err, outPath) {
        assert.strictEqual(err, null);
        assert.strictEqual(outPath, options.out);
        assert.strictEqual(unlinkSpy.callCount, 1);
        assert.strictEqual(unlinkSpy.firstCall.args[0], options.out);
        done();
      });
    });
  });
});
