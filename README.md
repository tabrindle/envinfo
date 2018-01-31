# envinfo

Reporting issues is a pain. Responding to issues is a pain. Make it a bit better.

[![Build Status](https://travis-ci.org/tabrindle/envinfo.svg?branch=master)](https://travis-ci.org/tabrindle/envinfo)[![npm downloads per month](https://img.shields.io/npm/dm/envinfo.svg?maxAge=86400)](https://www.npmjs.com/package/envinfo)[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

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
  Free Memory: 3.99 GB
  Total Memory: 16.00 GB
Binaries:
  Node: 8.9.4
  Yarn: 1.3.2
  npm: 5.6.0
  Watchman: 4.9.0
  Docker: 17.12.0-ce, build c97c6d6
  Homebrew: 1.5.2
IDEs:
  Android Studio: Not Found
  Atom: 1.23.3
  VSCode: 1.19.3
  Sublime Text: Build 3143
  Xcode: Xcode 9.0 Build version 9A235
Languages:
  Bash: 3.2.57(1)-release
  Go: 1.9.3
  PHP: 7.1.7
  Python: 2.7.10
  Ruby: 2.3.3p222
Browsers:
  Chrome: 63.0.3239.132
  Chrome Canary: 66.0.3333.0
  Firefox: 57.0.1
  Firefox Developer Edition: 57.0
  Firefox Nightly: 58.0a1
  Safari: 11.0
  Safari Technology Preview: 11.1
```

## Options

* --clipboard - Optionally copy directly to your clipboard with `envinfo --clipboard`. This feature uses [Clipboardy](https://www.npmjs.com/package/clipboardy)

* --packages - Optionally return packages from your package.json: takes either boolean or comma delimited string in CLI or array via API

`envinfo --packages minimist,which`

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
  minimist: ^1.2.0 => 1.2.0
  which: ^1.2.14 => 1.3.0
```

Or all of your packages like this:
`envinfo --packages`

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
  array-includes: ^3.0.3 => 3.0.3
  clipboardy: ^1.2.2 => 1.2.2
  glob: ^7.1.2 => 7.1.2
  ...
  minimist: ^1.2.0 => 1.2.0
  object.entries: ^1.0.4 => 1.0.4
  object.values: ^1.0.4 => 1.0.4
  os-name: ^2.0.1 => 2.0.1
  which: ^1.2.14 => 1.3.0
```

* --globalPackages - print your npm global packages versions

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
Global Packages:
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
