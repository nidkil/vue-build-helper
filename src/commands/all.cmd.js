const addEslintDisable = require('./add-eslint-disable.cmd')
const createExports = require('./create-exports.cmd')
const deleteDemoHtml = require('./delete-demo-html.cmd')

/**
 * Main entry point to module. Calls all the indivual commands: add-eslint-disable, create-exports and delete-demo-html.
 *
 * Takes the following option object:
 * {
 *   buildDestPath: the start directory to start searching for any files that match the file filter (*.common.js) to
 *                  add eslint disable to (multi file mode) and create export entries for in index.js that is placed
 *                  in the start directory
 *                  if not specified it uses a sane default: dist
 *   verbose:       output debugging information, default false
 *   quiet:         report errors only, default false
 * }
 *
 * @param {Object} options - See description above
 */
function all (options) {
  const verbose = options && options.verbose ? options.verbose : false
  verbose && console.log('all', JSON.stringify(options, null, '\t'))
  addEslintDisable(options)
  createExports(options)
  deleteDemoHtml(options)
}

module.exports = all
