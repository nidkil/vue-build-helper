#!/usr/bin/env node

const updater = require('update-notifier')
const pkg = require('../package.json')
const { requireIfElse } = require('../src/common/module-helpers')

let cli = null
try {
  // First try to load dist version
  cli = require('../dist/vue-build-helper.cjs')
} catch (e) {
  // Fallback to src version
  cli = require('../src/vue-build-helper-cli')
}

// Check if there is a new version of the module is available, if so show a warning message
updater({ pkg }).notify()
cli()
