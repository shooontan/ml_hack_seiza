const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].js',
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  node: {
    fs: 'empty',
  },
};
