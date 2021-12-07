const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    envinfo: './src/envinfo.mjs',
    cli: './src/cli.mjs',
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
    libraryTarget: "umd",
    libraryExport: "default",
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
      },
    ],
  },
  externals: {
    envinfo: '_',
    'node:os': 'commonjs2 os'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `#!/usr/bin/env node`,
      raw: true,
      include: 'cli',
    }),
    new webpack.DefinePlugin({
      'global.__VERSION__': JSON.stringify(packageJson.version),
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /spawn-sync/
    }),
  ]
};
