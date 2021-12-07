const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    envinfo: './src/envinfo.js',
    cli: './src/cli.js',
  },
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /(node_modules)/,
        test: /\.js$/,
      },
    ],
  },
  externals: {
    envinfo: '_'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `#!/usr/bin/env node
      "use strict"`,
      raw: true,
      include: 'cli',
    }),
    new webpack.DefinePlugin({
      'global.__VERSION__': JSON.stringify(packageJson.version),
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /spawn-sync/
    }),
  ],
};
