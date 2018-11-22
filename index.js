var crossZip = require('cross-zip');
var fs = require('fs-extra');
var path = require('path');
var series = require('async').series;
var debug = require('debug')('electron-installer-zip');

module.exports = function (_opts, done) {
  var opts = Object.assign({}, _opts);
  opts.dir = path.resolve(opts.dir);
  opts.out = path.resolve(opts.out);
  opts.platform = opts.platform || process.platform;
  if (path.extname(opts.out).toLowerCase() === '.zip') {
    opts.outPath = opts.out;
    opts.out = path.dirname(opts.out);
  } else {
    opts.outPath = path.resolve(opts.out, path.basename(opts.dir, '.app')) + '.zip';
  }

  debug('creating zip', opts);

  series([
    function removeZipIfExists (cb) {
      fs.stat(opts.outPath, function (err, stats) {
        if (err) return cb(null);

        if (!stats.isFile()) {
          return cb(new Error('Refusing to wipe path "' + opts.outPath + '" as it is ' + (stats.isDirectory() ? 'a directory' : 'not a file')));
        }
        return fs.unlink(opts.outPath, cb);
      });
    },
    fs.mkdirs.bind(null, opts.out),
    function zip (cb) {
      crossZip.zip(opts.dir, opts.outPath, cb);
    }
  ], function (err) {
    if (err) {
      return done(err);
    }
    done(null, opts.outPath);
  });
};
