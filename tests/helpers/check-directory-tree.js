const path = require('path')
const { fileExists, getLineFromFile } = require('@/common/fs-helpers')

const eslintDisable = '/* eslint-disable */'

/**
 * Creates a directory tree based on a JSON object.
 *
 * Inspired by https://www.npmjs.com/package/directory-tree
 *
 * From:
 *
 * {
 *   "tree": {
 *     "path": "",
 *     "name": "photos",
 *     "type": "directory",
 *     "children": [
 *       {
 *         "path": "summer",
 *         "name": "summer",
 *         "type": "directory",
 *         "children": [
 *           {
 *             "path": "summer/june",
 *             "name": "june",
 *             "type": "directory",
 *             "children": [
 *               {
 *                 "path": "summer/june/windsurf.jpg",
 *                 "name": "windsurf.jpg",
 *                 "type": "file"
 *               }
 *             ]
 *           }
 *         ]
 *       },
 *       {
 *         "path": "winter",
 *         "name": "winter",
 *         "type": "directory",
 *         "children": [
 *           {
 *             "path": "winter/january",
 *             "name": "january",
 *             "type": "directory",
 *             "children": [
 *               {
 *                 "path": "winter/january/ski.png",
 *                 "name": "ski.png",
 *                 "type": "file"
 *               },
 *               {
 *                 "path": "winter/january/snowboard.jpg",
 *                 "name": "snowboard.jpg",
 *                 "type": "file"
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 *
 * Generates
 *
 * photos
 * ├── summer
 * │   └── june
 * │       └── windsurf.jpg
 * └── winter
 *     └── january
 *         ├── ski.png
 *         └── snowboard.jpg
 *
 * @param {String} basePath The directory path to generate the directory tree under
 * @param {Object} json A JSON object with the directory structure to generate
 */
function checkFromJson (basePath, json, singleFileCheck = null, firstCall = true) {
  if (firstCall) {
    if (!json.tree) {
      throw new Error('Root element \'tree\' missing')
    }
    json = json.tree
  }
  json.forEach(async function (obj) {
    if (obj.type === 'directory') {
      const dirPath = path.join(basePath, obj.name)
      if (obj.children) {
        checkFromJson(dirPath, obj.children, singleFileCheck, false)
      }
    } else if (obj.type === 'file') {
      const filePath = path.join(basePath, obj.name)
      if (fileExists(filePath)) {
        const hasDisable = await hasEslintDisabled(filePath)
        let disabled = obj.disabled
        if (singleFileCheck) {
          if (singleFileCheck === filePath) {
            disabled = true
          } else {
            disabled = false
          }
        }
        if (disabled && !hasDisable) {
          throw new Error('File does not have eslint disabled')
        } else if (!disabled && hasDisable) {
          throw new Error('File has eslint disabled')
        }
      } else {
        throw new Error('File does not exist: ' + JSON.stringify(obj))
      }
      if (obj.children) {
        throw new Error('File cannot have children: ' + JSON.stringify(obj))
      }
    } else {
      throw new Error('Unknown type: ' + JSON.stringify(obj))
    }
  })
}

async function hasEslintDisabled (filePath) {
  const line = getLineFromFile(filePath, 0)
  return line === eslintDisable
}

module.exports = checkFromJson
