# envinfo

Reporting issues is a pain. Responding to issues is a pain. Make it a bit better.

[![Build Status](https://travis-ci.org/tabrindle/envinfo.svg?branch=master)](https://travis-ci.org/tabrindle/envinfo) [![npm version](https://badge.fury.io/js/envinfo.svg)](https://badge.fury.io/js/envinfo) [![npm downloads per month](https://img.shields.io/npm/dm/envinfo.svg?maxAge=86400)](https://www.npmjs.com/package/envinfo) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Installation

Install this package globally:

```sh
npm install -g envinfo || yarn global add envinfo
```

## Usage

`envinfo` || `npx envinfo`

```bash
System:
  OS: macOS High Sierra 10.13
  CPU: x64 Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz
  Free Memory: 4.01 GB
  Total Memory: 16.00 GB
  Shell: /usr/local/bin/bash - 4.4.12
Binaries:
  Node: 8.9.4
  Yarn: 1.3.2
  npm: 5.6.0
  Watchman: 4.9.0
  Docker: 17.12.0-ce, build c97c6d6
  Homebrew: 1.5.4
SDKs:
  iOS:
    Platforms: iOS 11.0, macOS 10.13, tvOS 11.0, watchOS 4.0
  Android:
    Build Tools: 27.0.3
    API Levels: 26
IDEs:
  Android Studio: 3.0 AI-171.4443003
  Atom: 1.23.3
  VSCode: 1.20.1
  Sublime Text: Build 3143
  Xcode: Xcode 9.0 Build version 9A235
Languages:
  Bash: 4.4.12
  Go: 1.9.3
  PHP: 7.1.7
  Python: 2.7.10
  Ruby: 2.3.3p222
Browsers:
  Chrome: 64.0.3282.167
  Chrome Canary: 66.0.3353.0
  Firefox: 58.0
  Firefox Developer Edition: 57.0
  Firefox Nightly: 58.0a1
  Safari: 11.0
  Safari Technology Preview: 11.1
npmPackages:
  eslint:
    wanted: ^4.10.0
    installed: 4.16.0
  eslint-config-airbnb-base:
    wanted: ^12.1.0
    installed: 12.1.0
  eslint-config-prettier:
    wanted: ^2.7.0
    installed: 2.9.0
  eslint-plugin-import:
    wanted: ^2.8.0
    installed: 2.8.0
  eslint-plugin-prettier:
    wanted: ^2.3.1
    installed: 2.5.0
  prettier-eslint-cli:
    wanted: ^4.1.1
    installed: 4.7.0
  array-includes:
    wanted: ^3.0.3
    installed: 3.0.3
  clipboardy:
    wanted: ^1.2.2
    installed: 1.2.2
  glob:
    wanted: ^7.1.2
    installed: 7.1.2
  minimist:
    wanted: ^1.2.0
    installed: 1.2.0
  object.entries:
    wanted: ^1.0.4
    installed: 1.0.4
  object.values:
    wanted: ^1.0.4
    installed: 1.0.4
  os-name:
    wanted: ^2.0.1
    installed: 2.0.1
  which:
    wanted: ^1.2.14
    installed: 1.3.0
  yamlify-object:
    wanted: ^0.4.5
    installed: 0.4.5
npmGlobalPackages:
  create-react-native-app: 1.0.0
  docker-registry-cli: 1.0.0
  envinfo: 4.0.0-beta.6
  exp: 49.2.2
  lerna: 2.7.1
  npm: 5.6.0
  npm-check-updates: 2.14.0
  react-native-cli: 2.0.1
```

## Options

* --clipboard - Optionally copy directly to your clipboard with `envinfo --clipboard`. This feature uses [Clipboardy](https://www.npmjs.com/package/clipboardy)

* --npmPackages - Optionally return packages from your package.json: takes either boolean or comma delimited string in CLI or array via API

`envinfo --system --binaries --npmPackages=minimist,which`

```sh
  System:
    OS: macOS High Sierra 10.13
    CPU: x64 Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz
    Free Memory: 3.93 GB
    Total Memory: 16.00 GB
    Shell: /usr/local/bin/bash - 4.4.12
  Binaries:
    Node: 8.9.4
    Yarn: 1.3.2
    npm: 5.6.0
    ...
  npmPackages:
    eslint:
      wanted: ^4.10.0
      installed: 4.16.0
    ...
    yamlify-object:
      wanted: ^0.4.5
      installed: 0.4.5
```

* --npmGlobalPackages - print your npm global packages versions

`envinfo --system --binaries --npmGlobalPackages`

```sh
System:
  OS: macOS High Sierra 10.13
  CPU: x64 Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz
  Free Memory: 4.01 GB
  Total Memory: 16.00 GB
Binaries:
  Node: 8.9.4
  Yarn: 1.3.2
  npm: 5.6.0
  ...
npmGlobalPackages:
  envinfo: 4.0.0-beta.1
  exp: 48.0.2
  lerna: 2.7.1
  npm: 5.6.0
  npm-check-updates: 2.14.0
  react-native-cli: 2.0.1
```

* --duplicates - will search given packages for duplicates, display in parentheses

```sh
System:
  OS: macOS High Sierra 10.13
  CPU: x64 Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz
  Free Memory: 4.01 GB
  Total Memory: 16.00 GB
Binaries:
  Node: 8.9.4
  Yarn: 1.3.2
  npm: 5.6.0
 ...
Packages:
  minimist: ^1.2.0 => 1.2.0 (1.2.0, 0.0.8)
```

* --fullTree - will traverse and print the entire flattened dependency tree (optionally also with --duplicates)

```sh
System:
  OS: macOS High Sierra 10.13
  CPU: x64 Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz
  Free Memory: 4.01 GB
  Total Memory: 16.00 GB
Binaries:
  Node: 8.9.4
  Yarn: 1.3.2
  npm: 5.6.0
 ...
Packages:
  ...
  minimatch:  3.0.4
  minimist: ^1.2.0 => 1.2.0 (1.2.0, 0.0.8)
  mkdirp:  0.5.1
  ...
```

## Integration

envinfo is live in:

* [React Native](https://github.com/facebook/react-native) (`react-native info`)
* [create-react-app](https://github.com/facebook/create-react-app) (`create-react-app --info`)
* [Exponent Development CLI](https://github.com/expo/exp) (`exp diagnostics`)
* [Solidarity](https://github.com/infinitered/solidarity) (`solidarity report`)

## Contributing

PRs for additional features are welcome! Run `npm run lint && npm run format` before committing.

This project came out of a [PR](https://github.com/facebook/react-native/pull/14428) to the React Native CLI tool - issues are reported frequently without important environment information, like Node/npm versions.
