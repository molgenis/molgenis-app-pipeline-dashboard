const TypeDocWebpackPlugin = require('typedoc-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new TypeDocWebpackPlugin({
      out: './docs/documentation',
      module: 'commonjs',
      target: 'es6',
      exclude: '**/node_modules/**/*.*',
      experimentalDecorators: true,
      excludeExternals: false,
      plugin: 'typedoc-plugin-external-module-name'
    }, './src')
  ]
}
