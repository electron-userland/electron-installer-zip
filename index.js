var fs = require('fs-extra');
var path = require('path');
var run = require('electron-installer-run');
var zipFolder = require('zip-folder');
var format = require('util').format;
var debug = require('debug')('electron-installer-zip');

module.exports = function(opts, done) {
  opts.dir = opts.dir;
  opts.out = opts.out;
  var defaultDest = format('%s.zip', path.basename(opts.dir));
  opts.dest = opts.dest || path.resolve(opts.out, defaultDest);

  debug('removing `%s` if it exists', opts.dest);
  fs.remove(opts.dest, function(err) {
    if (err) {
      return done(err);
    }

    debug('creating zip', opts);
    if (process.platform !== 'darwin') {
      zipFolder(opts.src, opts.dest, done);
      return;
    }
    var args = [
      '-r',
      '--symlinks',
      '-y',
      opts.dest
    ];
    run('zip', args, { env: process.env, cwd: opts.dir }, function(_err) {
      if (_err) {
        return done(err);
      }
      done(null, opts.dest);
    });
  });
};
