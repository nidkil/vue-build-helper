const builtins = require('rollup-plugin-node-builtins')
module.exports = {
  input: './src/vue-build-helper-cli.js',
  outDir: './dist',
  format: ['es', 'umd', 'umd-min', 'cjs'],
  moduleName: 'vue-build-helper',
  name: 'vue-build-helper',
  filename: '[name][suffix].js',
  banner: true,
  // target: 'node',
  alias: {
    '@': require('path').resolve(__dirname, 'src')
  },
  plugin: [
    builtins()
  ]
}
