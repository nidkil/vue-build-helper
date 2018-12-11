const { addLineToFile, fileExists, getLineFromFile } = require('../common/fs-helpers')
const FileHound = require('filehound')

// TODO move to shared module
const eslintDisable = '/* eslint-disable */'
// TODO move to shared module
const filterOn = 'common.js'
// Enable or disable verbose output
let verbose = false
// Enable or disable quiet mode
let quiet = false

/**
 * Custom filter to filter files by (*.common.js).
 * @param {Object} file - The file object
 * @returns {boolean} true if the file meets the filter, otherwise false
 */
// TODO move to shared module
function customFilter (file) {
  return file._pathname.endsWith(filterOn) > 0
}

/**
 * Add eslint disable to a file.
 * @param {String} filePath - A fully qualified path to the file to process
 * @returns {Promise<void>} a promise
 */
async function processFile (filePath) {
  verbose && console.log('File to disable eslint for: ' + filePath)
  const line = getLineFromFile(filePath, 0)
  if (line !== eslintDisable) {
    addLineToFile(filePath, eslintDisable)
    verbose && console.log('Added eslint disable to file: ' + filePath)
  } else {
    verbose && console.log('File already has eslint disable, skipping: ' + filePath)
  }
}

/**
 * Retrieve a file (srcFilePath) or files (buildDestPath) that meet a specific filename filter. Specify either file
 * source path (single file mode) or build destination path (multi file mode).
 * If buildDestPath is specified it recursively search from this start directory for any files that match the file
 * filter.
 * @param {String} srcFilePath - A fully qualified path to the file to process
 * @param {String} buildDestPath - A fully qualified path to the directory to start processing from
 * @returns {Array} with files to process
 * @throws exception if both srcFilePath and buildDestPath are specified
 */
function getFiles (srcFilePath, buildDestPath) {
  if (srcFilePath && buildDestPath) {
    throw new Error('Specify either file source path (single file mode) or build destination path (multi file mode)')
  }
  let files = []
  if (srcFilePath) {
    if (!fileExists(srcFilePath)) {
      console.log('File to disable eslint for does not exist')
      process.exit(0)
    }
    files = [ srcFilePath ]
  } else {
    // Recursively search from start directory for any files that match the file filter
    files = FileHound.create()
      .paths(buildDestPath)
      .addFilter(customFilter)
      .findSync()
  }
  return files
}

/**
 * Entry point to module. Adds eslint disable to a file (srcFilePath) or files (buildDestPath) that meet a specific
 * filename filter.
 *
 * Takes the following option object:
 * {
 *   srcFilePath:   the file to add eslint disable to (single file mode)
 *   buildDestPath: the start directory to start searching for any files that match the file filter (*.common.js) to
 *                  add eslint disable to (multi file mode)
 *   verbose:       output debugging information, default false
 *   quiet:         report errors only, default false
 * }
 *
 * Specify either file source path (single file mode) or build destination path (multi file mode).
 *
 * @param {Object} options - See description above
 */
function addEslintDisable (options) {
  if (!options.srcFilePath && !options.buildDestPath) {
    throw new Error('Source file or build destination must be specified')
  }
  verbose = options && options.verbose ? options.verbose : false
  quiet = options && options.quiet ? options.quiet : false
  verbose && console.log('add-eslint-disable', JSON.stringify(options, null, '\t'))
  const files = getFiles(options.srcFilePath, options.buildDestPath)
  if (files.length === 0) {
    verbose && console.log('No files to process')
  } else {
    files.forEach(async filePath => {
      await processFile(filePath)
    })
  }
}

module.exports = addEslintDisable
