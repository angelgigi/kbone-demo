const path = require('path')
const webpack = require('webpack')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MpPlugin = require('mp-webpack-plugin') // 用于构建小程序代码的 webpack 插件
const stylehacks = require('stylehacks')
const autoprefixer = require('autoprefixer')
const mpPluginConfig = require('./miniprogram.config.js') // 插件配置

const isDevelop = process.env.NODE_ENV === 'development'
const isOptimize = true // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
  mode: 'production',
  entry: {
    // js 入口
    home: path.resolve(__dirname, '../src/mp/home/main.mp.js'),
    other: path.resolve(__dirname, '../src/mp/other/main.mp.js'),
    order: path.resolve(__dirname, '../src/mp/order/main.mp.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/mp/common'), // 放到小程序代码目录中的 common 目录下
    filename: '[name].js', // 必需字段，不能修改
    library: 'createApp', // 必需字段，不能修改
    libraryExport: 'default', // 必需字段，不能修改
    libraryTarget: 'window', // 必需字段，不能修改
  },
  watch: isDevelop,
  target: 'web', // 必需字段，不能修改
  optimization: {
    runtimeChunk: false, // 
    splitChunks: { // 代码分割配置，不建议修改
      chunks: 'all',
      minSize: 1000, //
      maxSize: 0,
      minChunks: 1, // 打包频率次数限制
      maxAsyncRequests: 100, // 最大异步请求次数
      maxInitialRequests: 100, // 最大初始化请求次数
      automaticNameDelimiter: '~', // 打包时分割代码的符号
      name: true, // 打包后的文件名，[name] 表示原 js 文件名
      // 分割代码的组
      cacheGroups: {
        // node_modules 中的代码
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2, // 被打包的模块最少被引用的次数
          priority: -20, // 优先级，值越大越优先
          reuseExistingChunk: true // 复用已被引用的模块，而不是重复生成新模块
        }
      }
    },
    minimizer: isOptimize ? [
      // 压缩CSS
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.(css|wxss)$/g, // 匹配文件名
        cssProcessor: require('cssnano'), // 压缩 css 的插件
        cssProcessorPluginOptions: {
          preset: ['default', {
            discardComments: {
              removeAll: true, // 删除注释
            },
            minifySelectors: false, // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
          }],
        },
        canPrint: false // 是否输出日志
      }),
      // 压缩 js
      new TerserPlugin({
        test: /\.js(\?.*)?$/i, // 匹配文件名
        parallel: true, //并行压缩
      })
    ] : [],
  },
  module: {
    rules: [
      // html
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      // css
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              modules: true,
            },
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => {
                return [
                  autoprefixer,
                  stylehacks(), // 剔除 ie hack 代码
                ]
              }
            }
          },
          {
            loader: 'less-loader'
          }
        ],
      },
      // eslint
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, '../src')],
        options: {
          formatter: eslintFriendlyFormatter,
          emitWarning: true,
        },
      },
      // vue
      {
        test: /\.vue$/,
        use: [
          'thread-loader',
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          'vue-improve-loader',
        ]
      },
      // ts
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'thread-loader',
        }, {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }, {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            happyPackMode: true,
          },
        }],
      },
      // js
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }
        ],
        exclude: /node_modules/
      },
      // res
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|woff|woff2|ttf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: '[name]_[hash:hex:6].[ext]',
            publicPath: 'https://test.miniprogram.com/res', // 对于资源文件直接使用线上的 cdn 地址
            emitFile: false,
          }
        }],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
    }),
    new MiniCssExtractPlugin({
      filename: '[name].wxss',
    }),
    new VueLoaderPlugin(),
    new MpPlugin(mpPluginConfig),
  ],
}
