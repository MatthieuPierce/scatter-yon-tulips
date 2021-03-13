const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 

let mode = "development";
let target = "web";
//change mode & target conditionally by NODE_ENV
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  target = 'browserslist';
}

module.exports = {
  mode: mode,
  target: target,
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //path for asset resources, e.g. images
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  module: {
    rules: [
      {
      // loader module for JS
      test: /\.js$/i,
      exclude: [
        /node_modules/,
        /fcc-bundle\.js/
      ],
      use: {
        // babel-loader configs at .babelrc or babel.config.js
        loader: 'babel-loader',
      }
    },
    {
    // loader modules for css/sass/scss, handles postcss too, currently unused 
      test: /\.(s[ac]|c)ss$/i,
      exclude: /node_modules/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { publicPath: ''},
        },
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      type: "asset",
      // "asset" parses resournces under 8kb into js, rest as sep output files
      // "asset/resource" = all sep files in output
      // "asset/inline" = all rolled in js bundle, costly upfront 
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin( {
      template: './src/index.html'
    }),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  }
}