#!/usr/bin/env node

var createCLI = require('mongodb-js-cli');

var cli = createCLI('electron-installer-zip');
cli.yargs.usage('$0 <dir> <out>')
  .option('verbose', {
    describe: 'Confused or trying to track down a bug and want lots of debug output?',
    type: 'boolean',
    default: false
  })
  .demand(2)
  .help('help');

if (cli.argv.verbose) {
  require('debug').enable('mon*');
}

var zip = require('../');
var opts = {
  dir: cli.argv._[0],
  out: cli.argv._[1]
};

zip(opts, function(err) {
  cli.abortIfError(err);
  cli.ok(format('Created %s', opts.dest));
});
