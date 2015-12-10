var webpack = require('webpack');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: './dist',
    filename: 'wayne.js',
    library: 'wayne',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin()
  ]
};
