<p align="center">
  <img src="https://raw.githubusercontent.com/nidkil/vue-build-helper/master/images/vue-build-helper-robot.gif" alt="vue-build-helper robot" width="200"/>
</p>
<p align="center" style="font-size: 1.5em"><b></b></p>
<p align="center" style="font-size: 0.5em">Streamline the Vue CLI 3 build process</p>

[![Build status](https://travis-ci.com/nidkil/vue-build-helper.svg?branch=master)](https://travis-ci.com/nidkil/vue-build-helper)
[![NPM version](https://img.shields.io/npm/v/vue-build-helper.svg)](https://www.npmjs.com/package/vue-build-helper)
[![Vue 2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![Vue CLI 3](https://img.shields.io/badge/vue%20cli-3-brightgreen.svg)](https://cli.vuejs.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/nidkil/vue-build-helper#readme)
[![Dependency status](https://david-dm.org/alanshaw/david.svg)](https://david-dm.org/alanshaw/david)
[![devDependency status](https://david-dm.org/alanshaw/david/dev-status.svg)](https://david-dm.org/alanshaw/david?type=dev)
[![Hit count](http://hits.dwyl.com/nidkil/vue-test-plugin.svg)](http://hits.dwyl.com/dwyl/start-here)
[![License MIT](https://img.shields.io/badge/license-mit-yellow.svg)](https://opensource.org/licenses/MIT) [![Greenkeeper badge](https://badges.greenkeeper.io/nidkil/vue-build-helper.svg)](https://greenkeeper.io/)

> Streamline the Vue CLI 3 build process.

The Vue CLI 3 is an awesome tool. The build process is not completely smooth when you have multiple components or are testing the component locally using link with npm or yarn. This module provides the following features.

1. It removes the (irritating) `demo.html` files that are useless.
2. It generates an index file with named exports for all components.
3. It disables eslint for the components to avoid an avalanche of errors and warnings when testing the component in another project using link with npm or yarn.

These functionalities can be run all together or separately.

<details>
 <summary><strong>Table of Contents</strong> (click to expand)</summary>

<summary><strong>Table of Contents</strong> (click to expand)</summary>

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Additional configuration](#additional-configuration)
- [Other options](#other-options)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Brag about it](#brag-about-it)
- [Author](#author)

<!-- tocstop -->

</git sdetails>

## Installation

### Global

Install as a globally available CLI tool using [npm](https://www.npmjs.com/):

```bash
npm install --global vue-build-helper
```

Or install using [yarn](https://yarnpkg.com):

```bash
yarn gloabl add vue-build-helper
```

### Local

Install as a `devDependency` using [npm](https://www.npmjs.com/):

```bash
npm install --save-dev vue-build-helper
```

Or install using [yarn](https://yarnpkg.com):

```bash
yarn add --dev vue-build-helper
```

The following entry will be added to the `devDependencies` section in the `package.json` file.

```json
{
  "devDependencies": {
    "vue-build-helper": "^0.1.4"
  }
}
```

Add the following entry to the `scripts` section in the `package.json` file:

```json
{
  "scripts": {
    "build-helper": "vue-build-helper"
  }
}
```

Now you can run `npm run build-helper` from the command line. You can pass it arguments using double dashes (--), e.g. `npm run build-helper -- info`.

## Usage

### Minimum configuration

The easiest way to use this module is adding it as a `postbuild` script in the `package.json` file. The following shows how to run all features when the build process has completed successfully. The vue-build-helper uses sane defaults, if no options are specified it assumes `dist` as default destination for the build directory.

```json
{
  "scripts": {
    "build": "vue-build-helper.js-helper.js",
    "postbuild": "vue-build-helper all"
  }
}
```

You can also call it directly by executing one of the following commands.

```bash
npm run postbuild
```

Or:

```bash
yarn postbuild
```

## Additional configuration

### Running features individually

Features can be run individually by specifying one of the following commands: eslint-disable, delete-demo-html, create-exports.

Example calling the eslint-disable feature for a specific file. Keep in mind that the file is always relative to the build destination directory (default `dist`).

```json
{
  "scripts": {
    "postbuild": "vue-build-helper eslint-disable --file TestPlugin/TestPlugin.common.js"
  }
}

```
### Specifying alternative build directory

All commands accept the `--dest` option so that you can specify a different build directory than the default `dist` directory. Keep in mind that the build destination directory is always relative to the current working directory.

Example setting the destination build directory to `build`.

```json
{
  "scripts": {
    "postbuild": "vue-build-helper all --dist build"
  }
}
```

## Other options

- **--help**: Using `npm run build-helper -- --help` will list the available commands.

- **\<command\> --help**: Using `npm run build-helper -- <command> --help` will display information about the specified command and its options.

- **info**: Using `npm run build-helper -- info` will display information about your operating system and other environment information that is useful if you need to submit an issue.

## Roadmap

Currently there is nothing on the roadmap. Suggestions? Please submit an issue.

## Contributing

We welcome pull requests! What follows is the simplified version of the contribution process, please read [here](./CONTRIBUTING.md) to fully understand our contribution policy and [here](./CODE-OF-CONDUCT.md) to understand our code of conduct.

1. Fork the repository [here](https://github.com/nidkil/vue-build-helper)!
2. Create your feature branch: `git checkout -b my-new-feature`
3. If relevant, don't forget to add your tests
4. Commit your changes: `npm run commit`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :-)

## Brag about it

Do you find this package useful? Then please brag about it to the world by Twitter, email, blog, Discord, Slack, forums, etc. etc. Thx!

## Author

**nidkil** © [nidkil](https://github.com/nidkil), released under the [MIT](LICENSE.md) license.
Authored and maintained by nidkil with help from [contributors](https://github.com/nidkil/vue-build-helper/contributors).

> [Website](https://github.com/nidkil) · GitHub [@nidkil](https://github.com/nidkil) · Twitter [@nidkil](https://twitter.com/nidkil)
