const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const { resolve } = require('path');

module.exports = {
  entry: ['./src/index.tsx'],

  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.json', '.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   use: ['babel-loader']
      // },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'public/img/[name].[ext]',
            outputPath: 'dist/img/'
          }
        }
      },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      },
      {
        test: /\.(otf|ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'public/fonts/[name].[ext]',
          outputPath: 'dist/fonts'
        }
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'style.css' }),
    new HtmlWebpackPlugin({
      template: './resources/index.html',
      filename: './index.html',
      hash: false
    })
  ],

  devServer: {
    historyApiFallback: true,

    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  devtool: 'eval-source-map '
};
