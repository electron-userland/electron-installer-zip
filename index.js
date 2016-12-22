var fs = require('fs-extra');
var path = require('path');
var run = require('electron-installer-run');
var archiver = require('archiver');
var series = require('async').series;
var debug = require('debug')('electron-installer-zip');

function zipFolder(srcFolder, zipFilePath, callback) {
	var output = fs.createWriteStream(zipFilePath);
	var zipArchive = archiver('zip');

	output.on('close', function() {
		callback();
	});

	zipArchive.pipe(output);

	zipArchive.bulk([
		{ cwd: srcFolder, src: ['**/*'], expand: true }
	]);

	zipArchive.finalize(function(err, bytes) {
		if(err) {
			callback(err);
		}
	});
}

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
