var fs = require('fs-extra');
var path = require('path');
var run = require('electron-installer-run');
var zipFolder = require('zip-folder');
var format = require('util').format;
var series = require('async').series;
var debug = require('debug')('electron-installer-zip');

module.exports = function(opts, done) {
  opts.dir = path.resolve(opts.dir);
  opts.out = path.resolve(opts.out);
  opts.platform = opts.platform || process.platform;

  function zip(cb) {
    if (opts.platform !== 'darwin') {
      zipFolder(opts.dir, opts.out, cb);
      return;
    }

    var args = [
      '-r',
      '--symlinks',
      opts.out,
      './'
    ];

    run('zip', args, { env: process.env, cwd: path.join(opts.dir, '..') }, function(_err) {
      if (_err) {
        return cb(_err);
      }
      cb(null, opts.dest);
    });
  }
  debug('creating zip', opts);

  series([
    fs.remove.bind(null, opts.out),
    fs.mkdirs.bind(null, path.dirname(opts.out)),
    zip,
  ], function(err) {
    if (err) {
      return done(err);
    }
    done(null, opts.dest);
  });
};
