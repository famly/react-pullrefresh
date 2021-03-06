'use strict'

const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const srcPath = __dirname
const port = 8080
const publicPath = '/'

module.exports = {
  entry: [
    './test/index.js'
  ],
  devtool: 'source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    path: __dirname,
    filename: 'built.js',
    publicPath: publicPath
  },
  devServer: {
    contentBase: '.',
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
    inline: true,
    port: port,
    publicPath: publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['.js', 'jsx'],
    alias: {
      'react-pullrefresh': fs.realpathSync(path.resolve('src'))
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        include: srcPath,
        loader: 'eslint-loader'
      },
      {
        test: /\.(css)$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'es2017',
            'react',
            'stage-1'
          ],
          env: {
            'development': {
              'sourceMaps': 'inline'
            }
          },
          plugins: [
            'transform-regenerator'
          ]
        }
      }
    ]
  }
}
