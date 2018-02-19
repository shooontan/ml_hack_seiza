const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config.common');

module.exports = merge(webpackConfig, {
  entry: {
    bundle: [path.join(__dirname, '/src/index.js')],
  },
});
