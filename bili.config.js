module.exports = {
  input: './src/vue-build-helper-cli.js',
  outDir: './dist',
  format: ['es', 'cjs'],
  name: 'vue-build-helper',
  filename: '[name][suffix].js',
  banner: true,
  // target: 'node',
  alias: {
    '@': require('path').resolve(__dirname, 'src')
  }
}
