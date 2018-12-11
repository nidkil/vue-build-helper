const path = require('path')
const addEslintDisable = require('@/commands/add-eslint-disable.cmd')
const generateDirectoryTree = require('../helpers/generate-directory-tree')
const checkDirectoryTree = require('../helpers/check-directory-tree')
const { rmdirRecursive } = require('@/common/fs-helpers')

const structure = require('../fixtures/add-eslint-disable-dir-tree.json')
const buildDestPath = path.join(__dirname, 'test-structure')
const srcFilePath = path.join(buildDestPath, 'component1', 'component1.common.js')
const verbose = false
const quiet = true

describe('Add eslint disable', () => {
  beforeEach(() => {
    rmdirRecursive(buildDestPath)
    generateDirectoryTree(__dirname, structure)
  })

  afterAll(() => {
    rmdirRecursive(buildDestPath)
  })

  test('Source file and build destination not specified', async () => {
    const options = {
      verbose,
      quiet
    }
    const t = () => {
      addEslintDisable(options)
    }
    expect(t).toThrow('Source file or build destination must be specified')
  })

  test('Source file and build destination specified', async () => {
    const options = {
      buildDestPath,
      srcFilePath,
      verbose,
      quiet
    }
    const t = () => {
      addEslintDisable(options)
    }
    expect(t).toThrow('Specify either file source path (single file mode) or build destination path (multi file mode)')
  })

  test('Build destination path specified, all relevant files updated', async () => {
    const options = {
      buildDestPath,
      verbose,
      quiet
    }
    let t = () => {
      addEslintDisable(options)
    }
    expect(t).not.toThrow()
    t = () => {
      checkDirectoryTree(__dirname, structure)
    }
    expect(t).not.toThrow()
  })

  test('Source file specified, single file updated', async () => {
    const options = {
      srcFilePath,
      verbose,
      quiet
    }
    let t = () => {
      addEslintDisable(options)
    }
    expect(t).not.toThrow()
    t = () => {
      checkDirectoryTree(__dirname, structure, srcFilePath)
    }
    expect(t).not.toThrow()
  })
})
