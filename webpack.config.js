const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    envinfo: './src/envinfo.js',
    cli: './src/cli.js',
  },
  target: 'node',
  mode: 'production',
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.BannerPlugin({
      banner: `#!/usr/bin/env node
      "use strict"`,
      raw: true,
      include: 'cli',
    }),
    new webpack.IgnorePlugin(/spawn-sync/),
  ],
};
