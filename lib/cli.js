var program = require('commander');
program
  .version(require('../package.json').version)
  .usage('[options] [dir]')
  .option('-a, --auth <user>:<pass>', 'specify basic auth credentials')
  .option('-F, --format <fmt>', 'specify the log format string', 'dev')
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
  .option('-H, --hidden', 'enable hidden file serving')
  .option('-S, --no-stylus', 'disable stylus rendering')
  .option('-J, --no-jade', 'disable jade rendering')
  .option('    --no-less', 'disable less css rendering')
  .option('-I, --no-icons', 'disable icons')
  .option('-L, --no-logs', 'disable request logging')
  .option('-D, --no-dirs', 'disable directory serving')
  .option('-f, --favicon <path>', 'serve the given favicon')
  .option('-M, --mocks <path>', 'mock files directory')
  .option('    --cookies', 'add cookies parse support')
  .option('-C, --cors', 'allows cross origin access serving')
  .option('    --compress', 'gzip or deflate the response')
  .option('    --exec <cmd>', 'execute command on each request')

module.exports = program;
