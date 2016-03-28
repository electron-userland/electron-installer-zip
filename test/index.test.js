var proxyquire = require('proxyquire');
var assert = require('assert');
var path = require('path');

describe('electron-installer-zip', function() {
  it('should be requireable', function() {
    assert(require('../'));
  });
  
  var options = {
    dir: path.join(__dirname, '..', 'bin'),
    out: path.join(__dirname, 'dist')
  };

  it('should use `which zip` --symlinks on darwin', function(done) {
    var zip = proxyquire('../', {
      process: {
        platform: 'darwin'
      },
      'electron-installer-run': function(bin, args, opts, cb) {
        assert.equal(bin, 'zip');
        assert(args.indexOf('--symlinks') > -1);
        assert.equal(opts.cwd, options.dir);
        cb(null);
      }
    });
    zip(options, done);
  });
});
