const path = require('path');
const os = require('os');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');

let happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
function resolve (dir) {
  return path.join(__dirname, dir);
}

/**
 * fixed sidebarMenu accordion for top tags change
 */
// const fs = require('fs');
// fs.readFile(resolve('../node_modules/iview/dist/iview.js'), 'utf8', function (err, data) {
//   if (err) {
//     return console.log(err);
//   }

  //fixed method updateOpened
  /**
   * updateOpened: function updateOpened() {
            var _this2 = this;

            var items = (0, _assist.findComponentsDownward)(this, 'Submenu');

            if (items.length) {
                items.forEach(function (item) {
                    (0, _newArrowCheck3.default)(this, _this2);

                    if (this.openNames.indexOf(item.name) > -1) item.opened = true;
                }.bind(this));
            }
        }
   */
//   if (data.indexOf('else if (this.accordion)') === -1) {
//     let result = data.replace('item.opened = true;', "item.opened = true; else if (this.accordion) item.opened = false;");
//
//     fs.writeFile(resolve('../node_modules/iview/dist/iview.js'), result, 'utf8', function (err) {
//       if (err) return console.log(err);
//     });
//   }
// })

module.exports = {
  entry: {
    main: '@/main',
    'vender-base': '@/vendors/vendors.base.js',
    'vender-exten': '@/vendors/vendors.exten.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader',
            less: 'vue-style-loader!css-loader!less-loader'
          },
          postLoaders: {
            html: 'babel-loader'
          }
        }
      },
      {
        test: /iview\/.*?js$/,
        loader: 'happypack/loader?id=happybabel',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happybabel',
        exclude: /node_modules/
      },
      {
        test: /\.js[x]?$/,
        include: [resolve('src')],
        exclude: /node_modules/,
        loader: 'happypack/loader?id=happybabel'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'autoprefixer-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize','autoprefixer-loader', 'less-loader'],
          fallback: 'style-loader'
        }),
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=1024'
      },
      {
        test: /\.(html|tpl)$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': resolve('../src'),
    }
  }
};