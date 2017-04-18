'use strict'

const path = require('path')
const webpack = require('webpack')
const defaultConfig = require('./webpack.config')

module.exports = Object.assign({}, defaultConfig, {
  entry: path.join(__dirname, './index.js'),
  cache: false,
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      },
      comments: false,
      sourceMap: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
