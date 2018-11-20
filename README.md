# electron-installer-zip

[![Build Status](https://travis-ci.org/electron-userland/electron-installer-zip.svg?branch=master)](https://travis-ci.org/electron-userland/electron-installer-zip)
[![npm version](https://badge.fury.io/js/electron-installer-zip.svg)](https://npm.im/electron-installer-zip)

> Create a zip file with support for symlinks required by electron on osx.

## Installation

```
# For use in npm scripts
npm i electron-installer-zip --save-dev

# For use from cli
npm i electron-installer-zip -g
```

## Usage

```bash
electron-installer-zip <dir> <out>

Options:
  --verbose  Confused or trying to track down a bug and want lots of debug
             output?                                  [boolean] [default: false]
  --help     Show help                                                 [boolean]
```

```javascript
var zip = require('electron-installer-zip');

var opts = {
  dir: 'dist/MongoDB Compass-darwin-x64/MongoDB Compass.app',
  // out can either be a directory or a path for a ZIP file
  out: 'dist/',
  // out: 'dist/App.zip',
};

zip(opts, function(err, res) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Zip file written to: ', res);
});

```

## License

Apache 2.0
