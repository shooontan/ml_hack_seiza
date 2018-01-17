const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    style: path.join(__dirname, '/src/style.scss'),
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].css',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                minimize: true,
                url: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                minimize: true,
                url: false,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
};
