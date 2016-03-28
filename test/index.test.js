var proxyquire = require('proxyquire');
var assert = require('assert');

describe('electron-installer-zip', function() {
  it('should be requireable', function() {
    assert(require('../'));
  });
  var options = {
    dir: '../bin',
    out: './dist'
  };

  it('should use `which zip` --symlinks on darwin', function(done) {
    var zip = proxyquire('../', {
      process: {
        platform: 'darwin'
      },
      'electron-installer-run': function(bin, args, opts, cb) {
        assert.equal(bin, 'zip');
        assert(args.indexOf('--symlinks') > -1);
        cb(null);
      }
    });
    zip(options, done);
  });
});
