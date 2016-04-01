var fs = require('fs-extra');
var path = require('path');
var run = require('electron-installer-run');
var zipFolder = require('zip-folder');
var format = require('util').format;
var series = require('async').series;
var debug = require('debug')('electron-installer-zip');

module.exports = function(opts, done) {
  opts.dir = opts.dir;
  opts.out = opts.out;
  var defaultDest = format('%s.zip', path.basename(opts.dir));
  opts.dest = opts.dest || path.resolve(opts.out, defaultDest);
  opts.platform = opts.platform || process.platform;

  function zip(cb) {
    if (opts.platform !== 'darwin') {
      zipFolder(opts.dir, opts.dest, cb);
      return;
    }

    var args = [
      '-r',
      '--symlinks',
      '-y',
      opts.dest,
      opts.dir
    ];
    run('zip', args, { env: process.env, cwd: opts.dir }, function(_err) {
      if (_err) {
        return cb(_err);
      }
      cb(null, opts.dest);
    });
  }
  debug('creating zip', opts);

  series([
    fs.remove.bind(null, opts.dest),
    fs.mkdirs.bind(null, path.dirname(opts.dest)),
    zip,
  ], function(err) {
    if (err) {
      return done(err);
    }
    done(null, opts.dest);
  });
};
