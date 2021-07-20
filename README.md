# electron-installer-zip

[![CI status][actions_img]][actions_url]
[![npm][npm_img]][npm_url]
[![Code coverage](https://codecov.io/gh/electron-userland/electron-installer-zip/branch/main/graph/badge.svg?token=C0rDL9lCyg)](https://codecov.io/gh/electron-userland/electron-installer-zip)

> Create a zip file with support for symlinks required by Electron on macOS.

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

[actions_img]: https://github.com/electron-userland/electron-installer-zip/actions/workflows/ci.yml/badge.svg
[actions_url]: https://github.com/electron-userland/electron-installer-zip/actions/workflows/ci.yml
[npm_img]: https://img.shields.io/npm/v/electron-installer-zip.svg
[npm_url]: https://npmjs.org/package/electron-installer-zip
[electron-packager]: https://github.com/electron/electron-packager
