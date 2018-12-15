const path = require('path');

function stripLeadingNavBack(path) {
  return path.replace(/\.\.[\/\\]/, '')
}

function makeAbsolutePath(checkPath) {
  if(!path.isAbsolute(checkPath)) {
    return path.join(process.cwd(), stripLeadingNavBack(checkPath))
  }
  return checkPath
}

function moduleExists(path) {
  try {
    require.resolve(makeAbsolutePath(path));
    return true;
  } catch (e) {
    return false;
  }
}

function requireIfElse(primaryModule, secondaryModule) {
  const absolutePrimaryPath = makeAbsolutePath(primaryModule)
  console.log(primaryModule, absolutePrimaryPath)
  if (moduleExists(absolutePrimaryPath)) {
    return require(absolutePrimaryPath)
  } else {
    const absoluteSecondaryPath = makeAbsolutePath(secondaryModule)
    return require(absoluteSecondaryPath)
  }
}

module.exports = {
  moduleExists,
  requireIfElse
}
