const { addLineToFile, createDirectory, createEmptyFile, deleteDirectory, deleteFile, directoryExists, fileExists, getLineFromFile } = require('@/common/fs-helpers')
const fs = require('fs')

const testDir = 'test.dir'
const testFile = 'test.file'

function deleteIt (path) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isFile()) {
      fs.unlinkSync(path)
    } else {
      fs.rmdirSync(path)
    }
  }
}

function createIt (dirPath) {
  fs.mkdirSync(dirPath)
}

describe('fs helpers', () => {
  beforeEach(() => {
    deleteIt(testDir)
    deleteIt(testFile)
  })

  afterAll(() => {
    deleteIt(testDir)
    deleteIt(testFile)
  })

  describe('create directory', () => {
    test('directory does not exist', () => {
      createDirectory(testDir)
      expect((fs.existsSync(testDir) && fs.lstatSync(testDir).isDirectory())).toBe(true)
    })

    test('directory exists', () => {
      createDirectory(testDir)
      const t = () => {
        createDirectory(testDir)
      }
      expect(t).toThrow('Directory exists')
    })
  })

  describe('create empty file', () => {
    test('file does not exist', () => {
      createEmptyFile(testFile)
      expect((fs.existsSync(testFile) && fs.lstatSync(testFile).isFile())).toBe(true)
      expect(fs.statSync(testFile).size).toBe(0)
      fs.unlinkSync(testFile)
    })

    test('file exists', () => {
      createEmptyFile(testFile)
      const t = () => {
        createEmptyFile(testFile)
      }
      expect(t).toThrow('File exists')
    })
  })

  describe('delete directory', () => {
    test('directory exists', () => {
      createDirectory(testDir)
      expect((fs.existsSync(testDir) && fs.lstatSync(testDir).isDirectory())).toBe(true)
      expect(deleteDirectory(testDir)).toBe(true)
      expect(fs.existsSync(testDir)).toBe(false)
    })

    test('directory does NOT exist', () => {
      expect(deleteDirectory(testDir)).toBe(false)
    })
  })

  describe('delete file', () => {
    test('file exists', () => {
      createEmptyFile(testFile)
      expect((fs.existsSync(testFile) && fs.lstatSync(testFile).isFile())).toBe(true)
      expect(deleteFile(testFile)).toBe(true)
      expect(fs.existsSync(testFile)).toBe(false)
    })

    test('file does NOT exist', () => {
      expect(deleteFile(testFile)).toBe(false)
    })
  })

  describe('check if directory exists', () => {
    test('directory exists', () => {
      createIt(testDir)
      expect((fs.existsSync(testDir) && fs.lstatSync(testDir).isDirectory())).toBe(true)
      expect(directoryExists(testDir)).toBe(true)
    })

    test('directory does NOT exists', () => {
      expect((fs.existsSync(testDir) && fs.lstatSync(testDir).isFile())).toBe(false)
      expect(directoryExists(testDir)).toBe(false)
    })
  })

  describe('check if file exists', () => {
    test('file exists', () => {
      createEmptyFile(testFile)
      expect((fs.existsSync(testFile) && fs.lstatSync(testFile).isFile())).toBe(true)
      expect(fileExists(testFile)).toBe(true)
    })

    test('file does NOT exists', () => {
      expect((fs.existsSync(testFile) && fs.lstatSync(testFile).isFile())).toBe(false)
      expect(fileExists(testFile)).toBe(false)
    })
  })

  describe('get specified line from file', () => {
    test('retrieves line 5 from the file', () => {
      fs.writeFileSync(testFile, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10')
      // Offset starts at 0, so we use 4 to retrieve line 5
      const line = getLineFromFile(testFile, 4)
      expect(line).toBe('5')
    })

    test('file does NOT exists', () => {
      const t = () => {
        getLineFromFile(testFile, 4)
      }
      expect(t).toThrow()
    })
  })

  describe('prepend line to file', () => {
    test('add line to beginning of file', () => {
      fs.writeFileSync(testFile, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10')
      addLineToFile(testFile, 'add-this-line')
      // Offset starts at 0, so we use 5 to retrieve line 5 because we added a new line to the beginning of the file
      let line = getLineFromFile(testFile, 5)
      expect(line).toBe('5')
      line = getLineFromFile(testFile, 0)
      expect(line).toBe('add-this-line')
    })

    test('add line to middle of file', () => {
      fs.writeFileSync(testFile, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10')
      addLineToFile(testFile, 'add-this-line', 5)
      // Offset starts at 0, so we use 4 to retrieve line 5 because we added a new line to the end of the file
      let line = getLineFromFile(testFile, 4)
      expect(line).toBe('5')
      line = getLineFromFile(testFile, 5)
      expect(line).toBe('add-this-line')
    })

    test('add line to end of file', () => {
      fs.writeFileSync(testFile, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10')
      addLineToFile(testFile, 'add-this-line', 10)
      // Offset starts at 0, so we use 4 to retrieve line 5 because we added a new line to the end of the file
      let line = getLineFromFile(testFile, 4)
      expect(line).toBe('5')
      line = getLineFromFile(testFile, 10)
      expect(line).toBe('add-this-line')
    })

    test('file does NOT exists', () => {
      const t = () => {
        addLineToFile(testFile, 'add-this-line')
      }
      expect(t).toThrow()
    })
  })
})
