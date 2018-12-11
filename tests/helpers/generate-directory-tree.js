const path = require('path')
const { createDirectory, createEmptyFile, directoryExists, fileExists } = require('@/common/fs-helpers')

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
function generateFromJson (basePath, json, firstCall = true) {
  if (firstCall) {
    if (!json.tree) {
      throw new Error('Root element \'tree\' missing')
    }
    json = json.tree
  }
  json.forEach(function (obj) {
    if (obj.type === 'directory') {
      const dirPath = path.join(basePath, obj.name)
      if (!directoryExists(dirPath)) {
        createDirectory(dirPath)
      }
      if (obj.children) {
        generateFromJson(dirPath, obj.children, false)
      }
    } else if (obj.type === 'file') {
      const filePath = path.join(basePath, obj.name)
      if (!fileExists(filePath)) {
        createEmptyFile(filePath)
      }
      if (obj.children) {
        throw new Error('File cannot have children: ' + JSON.stringify(obj))
      }
    } else {
      throw new Error('Unknown type: ' + JSON.stringify(obj))
    }
  })
}

module.exports = generateFromJson
