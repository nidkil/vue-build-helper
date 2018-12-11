'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var slash = _interopDefault(require('slash'));
var commander = _interopDefault(require('commander'));
var chalk = _interopDefault(require('chalk'));
var envinfo = _interopDefault(require('envinfo'));

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function getCjsExportFromNamespace (n) {
	return n && n.default || n;
}

function getLineFromFile(filePath, lineNumber) {
  if (!fileExists(filePath)) {
    throw new Error('File does not exists: ' + filePath);
  }

  var data = fs.readFileSync(filePath).toString().split('\n');

  if (lineNumber <= data.length) {
    return data[lineNumber];
  }

  return '';
}

function addLineToFile(filePath, line) {
  var lineNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!fileExists(filePath)) {
    throw new Error('File does not exists: ' + filePath);
  }

  var data = fs.readFileSync(filePath).toString().split('\n');
  data.splice(lineNumber, 0, line);
  var content = data.join('\n');

  try {
    fs.writeFileSync(filePath, content);
    return true;
  } catch (err) {
    console.error(err.message, err.stack);
    return false;
  }
}

function createEmptyFile(filePath) {
  if (fileExists(filePath)) {
    throw new Error('File exists');
  }

  var fh = null;

  try {
    fh = fs.openSync(filePath, 'w');
  } catch (err) {
    console.error('Error creating empty file:', filePath);
  } finally {
    if (fh) fs.closeSync(fh);
  }
}

function createDirectory(dirPath) {
  if (directoryExists(dirPath)) {
    throw new Error('Directory exists');
  } else {
    fs.mkdirSync(dirPath);
  }
}

function deleteDirectory(dirPath) {
  if (directoryExists(dirPath)) {
    rmdirRecursive(dirPath);
    return true;
  }

  return false;
}

function deleteFile(filePath) {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
}

function directoryExists(dir) {
  return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
} // eslint-disable-next-line no-unused-vars
/**
 * Remove directory even if it contains files or other directories. Comparable to Unix command 'rm -rf'.
 * @param {string} dirPath - Path to directory to remove including any directories or files it contains
 */


function rmdirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function (entry) {
      var curPath = path.join(dirPath, entry);

      if (fs.lstatSync(curPath).isDirectory()) {
        rmdirRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

var fsHelpers = {
  addLineToFile: addLineToFile,
  createDirectory: createDirectory,
  createEmptyFile: createEmptyFile,
  deleteDirectory: deleteDirectory,
  deleteFile: deleteFile,
  directoryExists: directoryExists,
  fileExists: fileExists,
  getLineFromFile: getLineFromFile,
  rmdirRecursive: rmdirRecursive
};

var name = "vue-build-helper";
var version = "0.0.5";
var description = "Streamline the Vue CLI 3 build process";
var keywords = [
	"vue",
	"vue-cli",
	"vue-cli-service"
];
var repository = {
	type: "git",
	url: "https://github.com/nidkil/vue-build-helper.git"
};
var homepage = "https://github.com/nidkil/vue-build-helper";
var bugs = "https://github.com/nidkil/vue-build-helper/issues";
var bin = "./bin/vue-build-helper.js";
var author = "nidkil <info@nidkil.com> (http://nidkil.com/)";
var license = "MIT";
var entry = "src/build-helper-cli.js";
var main = "src/index.js";
var module$1 = "./dist/index.js";
var browser = "./dist/index.js";
var unpkg = "./dist/index.js";
var files = [
	"LICENSE.md",
	"README.md",
	"bin",
	"dist",
	"src",
	"*.js",
	"*.json"
];
var scripts = {
	lint: "eslint -c .eslintrc.json src test bin",
	"lint:fix": "eslint -c .eslintrc.json --fix src test bin",
	"lint:error-only": "eslint -c .eslintrc.json --quiet src test bin",
	test: "jest",
	build: "bili --format cjs --outDir dist name=vue-build-helper-cli --input src/vue-build-helper-cli.js",
	cli: "node ./bin/vue-build-helper.js",
	commit: "git cz",
	gendocs: "node ./node_modules/jsdoc/jsdoc.js -r -c jsdoc.config.json -d ./docs",
	release: "nodenv --env ./.env.local --exec release-it"
};
var dependencies = {
	chalk: "^2.4.1",
	commander: "^2.19.0",
	envinfo: "^6.0.1",
	filehound: "^1.16.5",
	filesurgeon: "^1.1.0",
	"lodash.camelcase": "^4.3.0",
	"lodash.upperfirst": "^4.3.1",
	slash: "^2.0.0"
};
var devDependencies = {
	bili: "^3.4.2",
	commitlint: "^7.2.1",
	"cz-conventional-changelog": "^2.1.0",
	eslint: "^5.9.0",
	"eslint-config-standard": "^12.0.0",
	"eslint-plugin-import": "^2.14.0",
	"eslint-plugin-jest": "^22.1.2",
	"eslint-plugin-node": "^8.0.0",
	"eslint-plugin-promise": "^4.0.1",
	"eslint-plugin-standard": "^4.0.0",
	husky: "^1.2.0",
	jest: "^23.6.0",
	jsdoc: "^3.5.5",
	"release-it": "^8.2.0",
	"update-notifier": "^2.5.0"
};
var engines = {
	node: ">=6"
};
var config = {
	commitizen: {
		path: "./node_modules/cz-conventional-changelog"
	}
};
var _package = {
	name: name,
	version: version,
	description: description,
	keywords: keywords,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	bin: bin,
	author: author,
	license: license,
	entry: entry,
	main: main,
	module: module$1,
	browser: browser,
	unpkg: unpkg,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	config: config
};

var _package$1 = /*#__PURE__*/Object.freeze({
	name: name,
	version: version,
	description: description,
	keywords: keywords,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	bin: bin,
	author: author,
	license: license,
	entry: entry,
	main: main,
	module: module$1,
	browser: browser,
	unpkg: unpkg,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	config: config,
	default: _package
});

var require$$0 = getCjsExportFromNamespace(_package$1);

var directoryExists$1 = fsHelpers.directoryExists,
    fileExists$1 = fsHelpers.fileExists;

var defaults = {
  name: 'build-helper-cli',
  buildDestDir: 'dist',
  filterOn: 'common.js',
  commands: ['all', 'eslint-disable', 'delete-demo-html', 'create-exports']
};

function createCmdModule(cmd) {
  return "./commands/".concat(cmd._name, ".cmd");
}

function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
} // Commander passes the Command object itself as options, extract only actual options into a fresh object and
// camelcase them and removing leading dashes


function cleanArgs(cmd) {
  var args = {
    cmd: cmd._name
  };
  cmd.options.forEach(function (o) {
    var key = camelize(o.long.replace(/^--/, '')); // If an option is not present and Command has a method with the same name it should not be copied

    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
} // All directories and files are relative to the current working directory (cwd), add the cwd to options so that
// individual commands do not have to handle this themselves


function enrichArgs(args) {
  var dest = args && args.dest ? args.dest : defaults.buildDestDir;
  var buildDestPath = slash(path.join(process.cwd(), dest));
  args.buildDestPath = buildDestPath;

  if (args && args.file) {
    var filePath = slash(path.join(args.buildDestPath, args.file));
    args.filePath = filePath;
  }

  return args;
} // Lets check that directories and files exist, so that individual commands do not have to handle this themselves


function checkArgs(args) {
  if (args) {
    var verbose = args.verbose || false;

    if (args.buildDestPath && !directoryExists$1(args.buildDestPath)) {
      verbose && console.log(args.cmd, JSON.stringify(args, null, '\t'));
      console.log(chalk.red('Build destination directory does not exist: ' + args.buildDestPath));
      process.exit(-1);
    }

    if (args.filePath && !fileExists$1(args.filePath)) {
      verbose && console.log(args.cmd, JSON.stringify(args, null, '\t'));
      console.log(chalk.red('File does not exist: ' + args.filePath));
      process.exit(-1);
    }
  }

  return args;
}

var vueBuildHelperCli = function () {
  commander.version(require$$0.version).usage('<command> [options]');
  commander.command('all').description('add eslint disable to file(s), delete demo.html file(s) and create file with exports').option('-d, --dest [relative path]', 'process build destination directory, default \'' + defaults.buildDestDir + '\'', defaults.buildDestDir).option('-f, --file [relative to dest path]', 'process file relative to build destination directory, if not specified then all files ending with \'' + defaults.filterOn + '\' will be processed').option('-v, --verbose', 'show processing information').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('add-eslint-disable').description('add eslint disable to file(s)').option('-d, --dest [relative path]', 'process build destination directory, default \'' + defaults.buildDestDir + '\'', defaults.buildDestDir).option('-f, --file [relative to dest path]', 'process file relative to build destination directory, if not specified then all files ending with \'' + defaults.filterOn + '\' will be processed').option('-v, --verbose', 'show processing information').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('delete-demo-html').description('delete demo.html file(s)').option('-d, --dest [relative path]', 'process build destination directory, default \'' + defaults.buildDestDir + '\'', defaults.buildDestDir).option('-v, --verbose', 'show processing information').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('create-exports').description('create file with exports (default and named exports will be created if one component is found, otherwise only named exports will be created)').option('-d, --dest [relative path]', 'process build destination directory, default \'' + defaults.buildDestDir + '\'', defaults.buildDestDir).option('-v, --verbose', 'show processing information').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('info').description('print debugging information about your environment').action(function (cmd) {
    console.log(chalk.bold('\nEnvironment Info:'));

    envinfo.run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmPackages: '/**/{*vue*,@vue/*/}',
      npmGlobalPackages: ['@vue/cli']
    }, {
      showNotFound: true,
      duplicates: true,
      fullTree: true
    }).then(console.log);
  }); // output help information on unknown commands

  commander.arguments('<command>').action(function (cmd) {
    commander.outputHelp();
    console.log('  ' + chalk.red("Unknown command ".concat(chalk.yellow(cmd), ".")));
    console.log();
  }); // Add some useful info to help

  commander.on('--help', function () {
    console.log();
    console.log("  Run ".concat(chalk.cyan("".concat(defaults.name, " <command> --help")), " for detailed usage of given command."));
    console.log();
  });
  commander.commands.forEach(function (c) {
    return c.on('--help', function () {
      return console.log();
    });
  });
  commander.parse(process.argv);

  if (!process.argv.slice(2).length) {
    commander.outputHelp();
  }
};

module.exports = vueBuildHelperCli;
