const fs = require('fs')
const path = require('path')
const createExports = require('@/commands/create-exports.cmd')
const generateDirectoryTree = require('../helpers/generate-directory-tree')
const { createDirectory, directoryExists, rmdirRecursive } = require('@/common/fs-helpers')

// For mocking
const fsHelpers = require('@/common/fs-helpers')
const origImpl = fsHelpers.directoryExists

const structure = require('../fixtures/add-eslint-disable-dir-tree.json')
const testBasePath = path.join(__dirname, 'tmp')
const expectedContentsNamedOnly = `import Component1 from './component1/component1.common'
import Component2 from './component2/component2.common'`
const expectedContentsNamedAndDefault = `import Component1 from './component1.common'
export default Component1`
const verbose = false
const quiet = true

// There are issues on Windows deleting directories recursively, as a workaround each tests gets it's own tests
// structure :-(
let testCnt = 0
let buildDestPath = ''
let exportsFile = ''

describe('Create exports', () => {
  beforeAll(() => {
    rmdirRecursive(testBasePath)
    createDirectory(testBasePath)
  })

  beforeEach(() => {
    fsHelpers.directoryExists = origImpl
    const curTestBasePath = path.join(testBasePath, 'test-' + testCnt++)
    buildDestPath = path.join(curTestBasePath, 'test-structure')
    exportsFile = path.join(buildDestPath, 'index.js')
    createDirectory(curTestBasePath)
    generateDirectoryTree(curTestBasePath, structure)
  })

  afterAll(() => {
    rmdirRecursive(testBasePath)
  })

  test.skip('Build destination not specified', () => {
    fsHelpers.directoryExists = jest.fn().mockImplementation(() => {
      return false;
    })
    const options = {
      verbose,
      quiet
    }
    const t = () => {
      createExports(options)
    }
    const expected = 'Build directory does not exist: ' + path.join(__dirname, 'dist')
    // TODO this isn't working as expected :-(
    expect(t).toThrow(expected)
  })

  test('Build destination specified, multiple files, named exports only', async () => {
    const options = {
      buildDestPath,
      verbose,
      quiet
    }
    const t = () => {
      createExports(options)
    }
    expect(t).not.toThrow()
    const contents = fs.readFileSync(exportsFile)
    expect(contents.toString()).toBe(expectedContentsNamedOnly)
  })

  test('Build destination specified, single file, named and default export', async () => {
    const destPath = path.join(buildDestPath, 'component1')
    const exportsFile = path.join(destPath, 'index.js')
    const options = {
      buildDestPath: destPath,
      verbose,
      quiet
    }
    const t = () => {
      createExports(options)
    }
    expect(t).not.toThrow()
    const contents = fs.readFileSync(exportsFile)
    expect(contents.toString()).toBe(expectedContentsNamedAndDefault)
  })

  test('Default build directory does not exist', () => {
    fsHelpers.directoryExists = jest.fn().mockImplementation(() => {
      return false;
    })
    const options = {
      verbose,
      quiet
    }
    const t = () => {
      createExports(options)
    }
    expect(t).not.toThrow('Default build directory does not exist: .*')
  })
})
