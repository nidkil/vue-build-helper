#!/usr/bin/env node

const updater = require('update-notifier')
const pkg = require('../package.json')
const { requireIfElse } = require('../src/common/module-helpers')
const cli = requireIfElse('../dist/vue-build-helper.cjs', '../src/vue-build-helper-cli')

// Check if there is a new version of the module is available, if so show a warning message
updater({ pkg }).notify()
cli()
