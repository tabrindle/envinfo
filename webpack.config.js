const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
  entry: {
    envinfo: './src/envinfo.js',
    cli: './src/cli.js',
  },
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: true,
  },
  output: {
    libraryTarget: 'commonjs2',
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
  externals: [/envinfo$/],
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
    new webpack.IgnorePlugin(/spawn-sync/),
  ],
};
