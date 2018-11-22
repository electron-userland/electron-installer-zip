'use strict';

const debug = require('debug')('electron-installer-zip');
const fs = require('fs-extra');
const path = require('path');
const pify = require('pify');
const { zip } = require('cross-zip');

function removeZipIfExists (opts) {
  return fs.stat(opts.outPath)
    .then(stats => {
      if (!stats.isFile()) {
        throw new Error(`Refusing to wipe path "${opts.outPath}" as it is ${stats.isDirectory() ? 'a directory' : 'not a file'}`);
      }
      return fs.unlink(opts.outPath);
    });
}

module.exports = (userOpts, done) => {
  const opts = Object.assign({}, userOpts);
  opts.dir = path.resolve(opts.dir);
  opts.out = path.resolve(opts.out);
  if (path.extname(opts.out).toLowerCase() === '.zip') {
    opts.outPath = opts.out;
    opts.out = path.dirname(opts.out);
  } else {
    opts.outPath = `${path.resolve(opts.out, path.basename(opts.dir, '.app'))}.zip`;
  }

  debug('creating zip', opts);

  return removeZipIfExists(opts)
    .then(() => fs.mkdirs(opts.out))
    .then(() => pify(zip)(opts.dir, opts.outPath))
    .then(() => opts.outPath);
};
