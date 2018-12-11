const path = require('path')
const FileHound = require('filehound')
const upperFirst = require('lodash.upperFirst')
const camelCase = require('lodash.camelCase')
const { deleteFile } = require('../common/fs-helpers')

const defaultDestPath = path.join(process.cwd(), 'dist')

// TODO move to shared module
const filterOn = 'common.js'
// Enable or disable verbose output
let verbose = false
// Enable or disable quiet mode
let quiet = false

/**
 * Correct the path separator on Windows from backslash to forward slash.
 * @param {string} filePath - Fully qualified path of the file to correct the path for
 * @returns {string}
 */
function correctPathSeparator (filePath) {
  return filePath.replace(/\\/g, '/')
}

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
 * Remove the filter (*.common.js) from the filename.
 * @param {Object} filename - The filename to remove the filter from
 * @returns {string} The filename without the filter part
 */
function stripFilter (filename) {
  return filename.substring(0, filename.length - filterOn.length - 1)
}

/**
 * Get the relative path to the file by removing the starting directory (buildDestPath) from the file path.
 * @param {string} filePath - Fully qualified path of the file to get the relative path for
 * @param {string} buildDistPath - Fully qualified path to the start directory, which is subtracted from the filePath
 *                                 to get the relative path
 * @returns {string} relative file path to the module
 */
function stripBuildDest (filePath, buildDestPath) {
  return filePath.substring(buildDestPath.length)
}

/**
 * Remove the file extension from the file path.
 * @param {string} filePath - Fully qualified path of the file to remove the file extension from
 * @returns {string} Fully qualified path of the file without the file extension
 */
function stripExt (filePath) {
  const ext = path.extname(filePath)
  return filePath.substring(0, filePath.length - ext.length)
}

/**
 * @typedef {Object} ModuleParts
 * @property {string} moduleName - The module name
 * @property {string} modulePath - The relative path starting from the buildDistPath
 */

/**
 * Creates a module parts object that contains the name and relative path to the module based on the file path from
 * which the base path (buildDestPath) is extracted. It also converts kebab case to capitalized words without spaces,
 * i.e. hello-world to HelloWorld.
 * @param {string} filePath - Fully qualified name of the file to create the module parts for
 * @param {string} buildDistPath - Fully qualified path to the start directory, which is subtracted from the filePath
 *                                 to get the relative path
 * @returns {ModuleParts} an object with the module parts
 */
function getModuleParts (filePath, buildDistPath) {
  filePath = correctPathSeparator(filePath)
  // Convert kebab case to capitalized words without spaces, i.e. hello-world to HelloWorld
  const moduleName = upperFirst(camelCase(stripFilter(path.basename(filePath))))
  const modulePath = stripExt(stripBuildDest(filePath, buildDistPath))
  return { moduleName, modulePath }
}

/**
 * Creates a named export statement.
 * @param {Object} moduleParts - An object with the module parts that are extracted from the filename
 * @returns {string} a named export statement
 */
function createNamedExport (moduleParts) {
  return 'import ' + moduleParts.moduleName + ' from \'.' + moduleParts.modulePath + '\''
}

/**
 * Creates a default export statement.
 * @param {Object} moduleParts - An object with the module parts that are extracted from the filename
 * @returns {string} a default export statement
 */
function createDefaultExport (moduleParts) {
  return 'export default ' + moduleParts.moduleName
}

/**
 * Create named exports in the index.js file places in the start directory.
 * @param {Array<String>} files - An array with fully qualified paths to the files to process
 * @param {string} exportsFilePath - Fully qualified path to the index.js file in the start directory
 * @param {string} buildDestPath - A fully qualified path to the directory to start processing from
 * @returns {Promise<void>} a promise
 */
async function processFiles (files, exportsFilePath, buildDestPath) {
  // Make sure we remove the old exports file
  deleteFile(exportsFilePath)
  if (files.length === 0) {
    !quiet && console.log('No components to process')
  } else {
    let contents = []
    if (files.length === 1) {
      // One file found, add named and default exports
      const moduleParts = getModuleParts(files[0], buildDestPath)
      contents.push(createNamedExport(moduleParts))
      contents.push(createDefaultExport(moduleParts))
      !quiet && console.log('One component found, set named and default export')
    } else {
      // Multiple files found, only add named exports
      files.forEach(file => {
        const moduleParts = getModuleParts(file, buildDestPath)
        contents.push(createNamedExport(moduleParts))
      })
      !quiet && console.log(files.length + ' components found, set named exports only')
    }
    const fs = require('fs')
    fs.writeFileSync(exportsFilePath, contents.join('\n'))
  }
}

/**
 * Retrieve files (buildDestPath) that meet a specific filename filter. It recursively search from this start directory
 * for any files that match the file filter.
 * @param {string} buildDestPath - A fully qualified path to the directory to start processing from
 * @returns {Array} with files to process
 */
function getFiles (buildDestPath) {
  const files = FileHound.create()
    .paths(buildDestPath)
    .addFilter(customFilter)
    .findSync()
  return files
}

/**
 * Main entry point to module creates the index.js file with named exports (multiple components) or default and
 * named (single component).
 *
 * Takes the following option object:
 * {
 *   buildDestPath: the start directory to start searching for any files that match the file filter (*.common.js) to
 *                  add eslint disable to (multi file mode) and create export entries for in index.js that is placed
 *                  in the start directory.
 *                  if not specified it uses a sane default: dist
 *   verbose:       output debugging information, default false
 *   quiet:         report errors only, default false
 * }
 *
 * @param {Object} options - See description above
 */
function createExports (options) {
  verbose = options && options.verbose ? options.verbose : false
  quiet = options && options.quiet ? options.quiet : false
  verbose && console.log('create-exports', JSON.stringify(options, null, '\t'))
  // Use sane default (dist) if not specified
  options.buildDestPath = options.buildDestPath || defaultDestPath
  const exportsFilePath = path.join(options.buildDestPath, 'index.js')
  verbose && console.log('Exports file: ' + exportsFilePath)
  processFiles(getFiles(options.buildDestPath), exportsFilePath, options.buildDestPath)
    .then(() => verbose && console.log('Exports file created'))
}

module.exports = createExports
