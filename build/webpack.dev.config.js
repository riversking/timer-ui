const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
  const buf = 'export default "development";';
  fs.write(fd, buf, 0, 'utf-8', function(err, written, buffer) {});
});


module.exports = merge(webpackBaseConfig, {
  devtool: '#source-map',
  output: {
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vender-exten', 'vender-base'],
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      title: 'admin v' + package.version,
      filename: '../index.html',
      inject: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/views/main-components/theme-switch/theme'
      },
      // {
      //   from: 'src/views/my-components/text-editor/tinymce'
      // }
    ], {
      ignore: [
        'text-editor.vue'
      ]
    })
  ],
  devServer: {
    host: '0.0.0.0',
    hot: true,
    compress: true,
    // port: port,
    disableHostCheck: true,
    historyApiFallback: false,
    stats: {
      modules: false,
      chunks: false,
      colors: true
    },
    headers: { "X-Custom-Header": "yes" },
    proxy: {
      '/api/v1': {
        target: 'http://localhost:10500',
        changeOrigin: true
      },
    },
    setup: function (app) {
      // app.use('/v1/archives/list', function (req, res, next) {
      //   return res.send({
      //     "code": 0,
      //     "rsp": require('../mock/archives.json'),
      //   })
      // })
    }
  }
});