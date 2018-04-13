'use strict';

const {resolve} = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const commonConfig = require('./webpack.config.common');
const isSSL = process.env.SSL === 'true';
process.env.PORT = process.env.port || 4440;
module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [`webpack-hot-middleware/client?${isSSL ? 'https' : 'http'}://localhost:${process.env.PORT}&reload=true`],
  output: {
    hotUpdateMainFilename: 'hot-update.[hash:6].json',
    hotUpdateChunkFilename: 'hot-update.[hash:6].js'
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve(__dirname, '..', 'src', 'client', 'index.html'),
      //  favicon: resolve(__dirname, '..', 'src', 'client', 'static', 'favicon.png'),
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: resolve(__dirname, '..', 'build-dev', 'client')
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'callstats',
          entry: process.env.CSJSURL || 'https://api.callstats.io/static/callstats.min.js',
          global: 'callstats'
        }
      ]
    })
  ]
});
