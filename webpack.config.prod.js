const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { PATHS } = require('./env');
const theme = require('./theme.json'); // 自定义antd主题文件，用于覆盖antd全局样式

process.env.BABEL_ENV = 'prod';

module.exports = {
  entry: {
    app: path.join(PATHS.app, 'index.js'),
    vendor: path.join(PATHS.app, 'vendor.js'),
  },
  output: {
    path: PATHS.build,
    filename: '[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, 
        include: PATHS.app, 
        use: [
          { loader: 'babel-loader', options: {cacheDirectory: true} }
        ],
      },
      {
        test: /\.css$/, 
        include: PATHS.app, 
        use: [
          'style-loader',
          { loader: 'css-loader', options: {modules: true, importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]'} },
          'postcss-loader',
        ],
      },
      // antd 按需加载less样式
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`,
          // below has some problem, dont kown why
          // { loader: 'less-loader', options: {sourceMap: true, modifyVars: JSON.stringify(theme)} }
        ],
      },
      {
        test: /\.(jpg|png|gif)$/, 
        include: PATHS.images,
        use: [
          { loader: 'file-loader', options: {name: '[path][name].[hash].[ext]'} }
        ]
      }
    ]
  },
  resolve: {
    modules: [PATHS.app, 'node_modules'],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.app, 'index.html'),
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new CleanWebpackPlugin([PATHS.build], {root: process.cwd()}),
    new ProgressBarPlugin(),
  ],
  performance: {
    hints: false,
  },
};