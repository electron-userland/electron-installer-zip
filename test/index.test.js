'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const sinon = require('sinon');
const zip = require('..');

describe('electron-installer-zip', () => {
  it('should refuse to wipe a directory', () => {
    const options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'fixtures', 'bad.zip')
    };

    return zip(options)
      .then(outPath => assert.fail('zip should not succeed'))
      .catch(err => assert.ok(err.message.includes('is a directory')));
  });

  it('should make a zip file in the out dir', () => {
    const options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'fixtures')
    };

    return zip(options)
      .then(outPath => {
        assert.strictEqual(outPath, path.resolve(options.out, 'bin.zip'));
        return fs.pathExists(outPath);
      }).then(exists => assert.ok(exists));
  });

  it('should wipe the out file if it already exists', () => {
    const options = {
      dir: path.join(__dirname, '..', 'bin'),
      out: path.join(__dirname, 'fixtures', 'good.zip')
    };

    const unlinkSpy = sinon.spy(fs, 'unlink');

    return fs.writeFile(options.out, 'content')
      .then(() => zip(options))
      .then(outPath => {
        assert.strictEqual(outPath, options.out);
        assert.strictEqual(unlinkSpy.callCount, 1);
        return assert.strictEqual(unlinkSpy.firstCall.args[0], options.out);
      });
  });
});
