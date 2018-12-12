/*!
 * vue-build-helper v0.1.1
 * (c) 2018-present nidkil <info@nidkil.com> (http://nidkil.com/)
 * Released under the MIT License.
 */
import fs from 'fs';
import path from 'path';
import slash from 'slash';
import commander from 'commander';
import chalk from 'chalk';
import envinfo from 'envinfo';

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

  const data = fs.readFileSync(filePath).toString().split('\n');

  if (lineNumber <= data.length) {
    return data[lineNumber];
  }

  return '';
}

function addLineToFile(filePath, line, lineNumber = 0, emptyFile = false) {
  if (!fileExists(filePath)) {
    throw new Error('File does not exists: ' + filePath);
  }

  const data = emptyFile ? [] : fs.readFileSync(filePath).toString().split('\n');
  data.splice(lineNumber, 0, line);
  const content = data.join('\n');

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

  let fh = null;

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
      const curPath = path.join(dirPath, entry);

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
  addLineToFile,
  createDirectory,
  createEmptyFile,
  deleteDirectory,
  deleteFile,
  directoryExists,
  fileExists,
  getLineFromFile,
  rmdirRecursive
};

var name = "vue-build-helper";
var version = "0.1.1";
var description = "Streamline the Vue CLI 3 build process";
var author = "nidkil <info@nidkil.com> (http://nidkil.com/)";
var license = "MIT";
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
var entry = "./src/build-helper-cli.js";
var main = "./src/build-helper-cli.js";
var module$1 = "./dist/build-helper.es.js";
var browser = "./dist/build-helper.min.js";
var unpkg = "./dist/build-helper.min.js";
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
	test: "jest",
	coverage: "npm run test -- --coverage",
	coveralls: "npm run coverage && cat ./coverage/lcov.info | coveralls",
	lint: "eslint -c .eslintrc.json --format codeframe src tests bin",
	"lint:fix": "eslint -c .eslintrc.json --format codeframe --fix src tests bin",
	"lint:error-only": "eslint -c .eslintrc.json --quiet --format codeframe src tests bin",
	"lint:check": "eslint --print-config .eslintrc.json | eslint-config-prettier-check",
	"cz:commit": "git cz",
	"cz:retry": "git cz --retry",
	commitlint: "commitlint",
	"commitlint:last": "commitlint --edit",
	"git:first": "git rev-list HEAD | tail -n 1",
	"git:last": "git rev-list HEAD | head -n 1",
	gendocs: "jsdoc -r -c jsdoc.config.json -d ./docs",
	build: "rm -rf dist && bili --config bili.config.json",
	release: "nodenv --env ./.env.local --exec release-it --verbose"
};
var engines = {
	node: ">=6"
};
var dependencies = {
	chalk: "^2.4.1",
	commander: "^2.19.0",
	envinfo: "^6.0.1",
	filehound: "^1.16.5",
	"lodash.camelcase": "^4.3.0",
	"lodash.upperfirst": "^4.3.1",
	slash: "^2.0.0",
	"update-notifier": "^2.5.0"
};
var devDependencies = {
	"@commitlint/cli": "^7.2.1",
	"@commitlint/config-conventional": "^7.1.2",
	bili: "^3.4.2",
	"cz-conventional-changelog": "^2.1.0",
	eslint: "^5.10.0",
	"eslint-config-prettier": "^3.3.0",
	"eslint-config-standard": "^12.0.0",
	"eslint-plugin-import": "^2.14.0",
	"eslint-plugin-jest": "^22.1.2",
	"eslint-plugin-node": "^8.0.0",
	"eslint-plugin-prettier": "^3.0.0",
	"eslint-plugin-promise": "^4.0.1",
	"eslint-plugin-standard": "^4.0.0",
	husky: "^1.2.0",
	jest: "^23.6.0",
	jsdoc: "^3.5.5",
	prettier: "^1.15.3",
	"release-it": "^8.4.2"
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
	author: author,
	license: license,
	keywords: keywords,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	bin: bin,
	entry: entry,
	main: main,
	module: module$1,
	browser: browser,
	unpkg: unpkg,
	files: files,
	scripts: scripts,
	engines: engines,
	dependencies: dependencies,
	devDependencies: devDependencies,
	config: config
};

var _package$1 = /*#__PURE__*/Object.freeze({
	name: name,
	version: version,
	description: description,
	author: author,
	license: license,
	keywords: keywords,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	bin: bin,
	entry: entry,
	main: main,
	module: module$1,
	browser: browser,
	unpkg: unpkg,
	files: files,
	scripts: scripts,
	engines: engines,
	dependencies: dependencies,
	devDependencies: devDependencies,
	config: config,
	default: _package
});

var require$$0 = getCjsExportFromNamespace(_package$1);

const directoryExists$1 = fsHelpers.directoryExists,
      fileExists$1 = fsHelpers.fileExists;

const defaults = {
  name: 'build-helper-cli',
  buildDestDir: 'dist',
  filterOn: 'common.js',
  commands: ['all', 'eslint-disable', 'delete-demo-html', 'create-exports', 'info']
};

function createCmdModule(cmd) {
  return `./commands/${cmd._name}.cmd`;
}

function camelcase(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
} // Commander passes the Command object itself as options, extract only actual options into a fresh object and
// camelcase them and remove leading dashes


function cleanArgs(cmd) {
  const args = {
    cmd: cmd._name
  };
  cmd.options.forEach(o => {
    const key = camelcase(o.long.replace(/^--/, '')); // If an option is not present and Command has a method with the same name it should not be copied

    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
} // All directories and files are relative to the current working directory (cwd), add the cwd to options so that
// individual commands do not have to handle this themselves


function enrichArgs(args) {
  const dest = args && args.dest ? args.dest : defaults.buildDestDir;
  const buildDestPath = slash(path.join(process.cwd(), dest));
  args.buildDestPath = buildDestPath;

  if (args && args.file) {
    const filePath = slash(path.join(args.buildDestPath, args.file));
    args.filePath = filePath;
  }

  return args;
} // Lets check that directories and files exist, so that individual commands do not have to handle this themselves


function checkArgs(args) {
  if (args) {
    const verbose = args.verbose || false;

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

var vueBuildHelperCli = () => {
  commander.version(require$$0.version).usage('<command> [options]');
  commander.command('all').description('add eslint disable to file(s), delete demo.html file(s) and create file with exports').option('-d, --dest [relative path]', `process build destination directory, default '${defaults.buildDestDir}'`, defaults.buildDestDir).option('-f, --file [relative to dest path]', `process file relative to build destination directory, if not specified then all files ending
      with '${defaults.filterOn}' will be processed`).option('-v, --verbose', 'show processing information, default false').option('-q, --quiet', 'report errors only, default false').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('add-eslint-disable').description('add eslint disable to file(s)').option('-d, --dest [relative path]', `process build destination directory, default '${defaults.buildDestDir}'`, defaults.buildDestDir).option('-f, --file [relative to dest path]', `process file relative to build destination directory, if not specified then all files ending
      with '${defaults.filterOn}' will be processed`).option('-v, --verbose', 'show processing information, default false').option('-q, --quiet', 'report errors only, default false').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('delete-demo-html').description('delete demo.html file(s)').option('-d, --dest [relative path]', `process build destination directory, default '${defaults.buildDestDir}'`, defaults.buildDestDir).option('-v, --verbose', 'show processing information, default false').option('-q, --quiet', 'report errors only, default false').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('create-exports').description('create file with exports (default and named exports will be created if one component is found, otherwise only named exports will be created)').option('-d, --dest [relative path]', `process build destination directory, default '${defaults.buildDestDir}'`, defaults.buildDestDir).option('-v, --verbose', 'show processing information, default false').option('-q, --quiet', 'report errors only, default false').action(function (cmd, options) {
    commonjsRequire(createCmdModule(cmd))(checkArgs(enrichArgs(cleanArgs(cmd))));
  });
  commander.command('info').description('print debugging information about your environment').action(cmd => {
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
  }); // Output help information on unknown commands

  commander.arguments('<command>').action(cmd => {
    commander.outputHelp();
    console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
  }); // Add some useful info to help

  commander.on('--help', function () {
    console.log();
    console.log(`  Run ${chalk.cyan(`${defaults.name} <command> --help`)} for detailed usage of given command.`);
    console.log();
  });
  commander.commands.forEach(c => c.on('--help', () => console.log()));
  commander.parse(process.argv);

  if (!process.argv.slice(2).length) {
    commander.outputHelp();
  }
};

export default vueBuildHelperCli;
