const slash = require('slash')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const { directoryExists, fileExists } = require('./common/fs-helpers')

const defaults = {
  name: 'build-helper-cli',
  buildDestDir: 'dist',
  filterOn: 'common.js',
  commands: ['all', 'eslint-disable', 'delete-demo-html', 'create-exports', 'info']
}

function createCmdModule(cmd) {
  return `./commands/${cmd._name}.cmd`
}

function camelcase(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// Commander passes the Command object itself as options, extract only actual options into a fresh object and
// camelcase them and remove leading dashes
function cleanArgs(cmd) {
  const args = {
    cmd: cmd._name
  }
  cmd.options.forEach(o => {
    const key = camelcase(o.long.replace(/^--/, ''))
    // If an option is not present and Command has a method with the same name it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

// All directories and files are relative to the current working directory (cwd), add the cwd to options so that
// individual commands do not have to handle this themselves
function enrichArgs(args) {
  const dest = args && args.dest ? args.dest : defaults.buildDestDir
  const buildDestPath = slash(path.join(process.cwd(), dest))
  args.buildDestPath = buildDestPath
  if (args && args.file) {
    const filePath = slash(path.join(args.buildDestPath, args.file))
    args.filePath = filePath
  }
  return args
}

// Lets check that directories and files exist, so that individual commands do not have to handle this themselves
function checkArgs(args) {
  if (args) {
    const verbose = args.verbose || false
    if (args.buildDestPath && !directoryExists(args.buildDestPath)) {
      verbose && console.log(args.cmd, JSON.stringify(args, null, '\t'))
      console.log(chalk.red('Build destination directory does not exist: ' + args.buildDestPath))
      process.exit(-1)
    }
    if (args.filePath && !fileExists(args.filePath)) {
      verbose && console.log(args.cmd, JSON.stringify(args, null, '\t'))
      console.log(chalk.red('File does not exist: ' + args.filePath))
      process.exit(-1)
    }
  }
  return args
}

module.exports = () => {
  program.version(require('../package.json').version).usage('<command> [options]')

  program
    .command('all')
    .description(
      'add eslint disable to file(s), delete demo.html file(s) and create file with exports'
    )
    .option(
      '-d, --dest [relative path]',
      `process build destination directory, default '${defaults.buildDestDir}'`,
      defaults.buildDestDir
    )
    .option(
      '-f, --file [relative to dest path]',
      `process file relative to build destination directory, if not specified then all files ending
      with '${defaults.filterOn}' will be processed`
    )
    .option('-v, --verbose', 'show processing information, default false')
    .option('-q, --quiet', 'report errors only, default false')
    .action(function(cmd, options) {
      require(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))))
    })

  program
    .command('add-eslint-disable')
    .description('add eslint disable to file(s)')
    .option(
      '-d, --dest [relative path]',
      `process build destination directory, default '${defaults.buildDestDir}'`,
      defaults.buildDestDir
    )
    .option(
      '-f, --file [relative to dest path]',
      `process file relative to build destination directory, if not specified then all files ending
      with '${defaults.filterOn}' will be processed`
    )
    .option('-v, --verbose', 'show processing information, default false')
    .option('-q, --quiet', 'report errors only, default false')
    .action(function(cmd, options) {
      require(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))))
    })

  program
    .command('delete-demo-html')
    .description('delete demo.html file(s)')
    .option(
      '-d, --dest [relative path]',
      `process build destination directory, default '${defaults.buildDestDir}'`,
      defaults.buildDestDir
    )
    .option('-v, --verbose', 'show processing information, default false')
    .option('-q, --quiet', 'report errors only, default false')
    .action(function(cmd, options) {
      require(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))))
    })

  program
    .command('create-exports')
    .description(
      'create file with exports (default and named exports will be created if one component is found, otherwise only named exports will be created)'
    )
    .option(
      '-d, --dest [relative path]',
      `process build destination directory, default '${defaults.buildDestDir}'`,
      defaults.buildDestDir
    )
    .option('-v, --verbose', 'show processing information, default false')
    .option('-q, --quiet', 'report errors only, default false')
    .action(function(cmd, options) {
      require(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))))
    })

  program
    .command('info')
    .description('print debugging information about your environment')
    .action(cmd => {
      console.log(chalk.bold('\nEnvironment Info:'))
      require('envinfo')
        .run(
          {
            System: ['OS', 'CPU'],
            Binaries: ['Node', 'Yarn', 'npm'],
            Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
            npmPackages: '/**/{*vue*,@vue/*/}',
            npmGlobalPackages: ['@vue/cli']
          },
          {
            showNotFound: true,
            duplicates: true,
            fullTree: true
          }
        )
        .then(console.log)
    })

  // Output help information on unknown commands
  program.arguments('<command>').action(cmd => {
    program.outputHelp()
    console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

  // Add some useful info to help
  program.on('--help', function() {
    console.log()
    console.log(
      `  Run ${chalk.cyan(
        `${defaults.name} <command> --help`
      )} for detailed usage of given command.`
    )
    console.log()
  })

  program.commands.forEach(c => c.on('--help', () => console.log()))

  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}
