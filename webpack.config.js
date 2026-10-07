const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const envinfo = require('./src/envinfo');

// The commonjs2 bundle assigns module.exports at runtime, so Node cannot see its named
// exports and `import { run } from 'envinfo'` fails in ESM. Append the no-op hint that
// esbuild emits for cjs-module-lexer, after minification so it is not dropped as dead code.
class NamedExportsHintPlugin {
  apply(compiler) {
    const hint = `\n0 && (module.exports = { ${Object.keys(envinfo).join(', ')} });\n`;
    compiler.hooks.thisCompilation.tap('NamedExportsHintPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'NamedExportsHintPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE + 1,
        },
        () => {
          compilation.updateAsset(
            'envinfo.js',
            source => new webpack.sources.ConcatSource(source, hint)
          );
        }
      );
    });
  }
}

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
      banner: `#!/usr/bin/env node\n`,
      raw: true,
      include: 'cli',
    }),
    new webpack.DefinePlugin({
      'global.__VERSION__': JSON.stringify(packageJson.version),
    }),
    new NamedExportsHintPlugin(),
  ],
};
