<p align="center">
  <img src="https://raw.githubusercontent.com/tabrindle/envinfo/master/logo.png" align="center"  width="700px"/>
  <h3 align="center">envinfo generates a report of the common details needed when troubleshooting software issues, such as your operating system, binary versions, browsers, installed languages, and more</h3> 
  <hr/>
</p>

[![Build Status](https://travis-ci.org/tabrindle/envinfo.svg?branch=master)](https://travis-ci.org/tabrindle/envinfo) [![npm version](https://badge.fury.io/js/envinfo.svg)](https://badge.fury.io/js/envinfo) [![npm downloads per month](https://img.shields.io/npm/dm/envinfo.svg?maxAge=86400)](https://www.npmjs.com/package/envinfo) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The problem
- It works on my computer
- "command not found"
- what version of "command" are you running?
- what version of "different command" are you running?
- do you have "insert obscure android sdk version"?
- every github issue reporting template ever:

**Please mention other relevant information such as the browser version, Node.js version, Operating System and programming language.**

## This solution
- Gather all of this information in one spot, quickly, and painlessly.

## Installation

To use as a CLI tool, install this package globally:

```sh
npm install -g envinfo || yarn global add envinfo
```

Or, use without installing with npx:

`npx envinfo`

To use as a library in another project:

```sh
npm install envinfo || yarn add envinfo
```

## CLI Usage

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
  ...
  yamlify-object:
    wanted: ^0.4.5
    installed: 0.4.5
npmGlobalPackages:
  create-react-native-app: 1.0.0
  exp: 49.2.2
  lerna: 2.7.1
  npm: 5.6.0
  npm-check-updates: 2.14.0
  react-native-cli: 2.0.1
```

## Programmatic Usage

Envinfo takes a configuration object and returns a string (optionally yaml, json or markdown)

```javascript
import envinfo from 'envinfo';

console.log(
    envinfo.run(
        {
            System: ['OS', 'CPU'],
            Binaries: ['Node', 'Yarn', 'npm'],
            Browsers: ['Chrome', 'Firefox', 'Safari'],
            npmPackages: ['styled-components', 'babel-plugin-styled-components'],
        },
        { json: true }
    )
);
```
returns:
```
{
  "System": {
    "OS": "macOS High Sierra 10.13",
    "CPU": "x64 Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz"
  },
  "Binaries": {
    "Node": "8.9.4",
    "Yarn": "1.3.2",
    "npm": "5.6.0"
  },
  "Browsers": {
    "Chrome": "65.0.3325.146",
    "Firefox": 58.0,
    "Safari": 11.0
  },
  "npmPackages": {
    "styled-components": {
      "wanted": "^3.2.1",
      "installed": "3.2.1"
    },
    "babel-plugin-styled-components": {
      "wanted": "^1.5.1",
      "installed": "1.5.1"
    }
  }
}
```

All of envinfo's helpers are also exported for use. You can use envinfo as a whole, or just the parts that you need, like this:

```javascript
import { helpers } from 'envinfo';

const OS = helpers.getOperatingSystemInfo();
const docker = helpers.getDockerVersion();

console.log({ OS, docker });
```

```
{
 OS: 'macOS High Sierra 10.13'
 docker: '17.12.0-ce, build c97c6d6'
}
```

## CLI Options

```
    --system               Print general system info such as OS, CPU, Memory and Shell
    --browsers             Get version numbers of installed web browsers
    --SDKs                 Get platforms, build tools and SDKs of iOS and Android
    --IDEs                 Get version numbers of installed IDEs
    --languages            Get version numbers of installed languages such as Java, Python, PHP, etc
    --binaries             Get version numbers of node, npm, watchman, etc
    --npmPackages          Get version numbers of locally installed npm packages - glob, string, or comma delimited list
    --npmGlobalPackages    Get version numbers of globally installed npm packages

    --duplicates           Mark duplicate npm packages inside parentheses eg. (2.1.4)
    --fullTree             Traverse entire node_modules dependency tree, not just top level

    --markdown             Print output in markdown format
    --json                 Print output in JSON format
    --console              Print to console (defaults to on for CLI usage, off for programmatic usage)
    --clipboard            Copy output to your system clipboard (uses clipboardy)
```

## Integration

envinfo is live in:

*   [React Native](https://github.com/facebook/react-native) (`react-native info`)
*   [Create React App](https://github.com/facebook/create-react-app) (`create-react-app --info`)
*   [Expo](https://github.com/expo/exp) (`exp diagnostics`)
*   [Webpack](https://github.com/webpack/webpack-cli) (`webpack-cli info`)
*   [Solidarity](https://github.com/infinitered/solidarity) (`solidarity report`)

envinfo is used in the ISSUE_TEMPLATE of:
*   [styled-components](https://github.com/styled-components/styled-components)
*   [Jest](https://github.com/facebook/jest)

## Contributing

PRs for additional features are welcome! Run `npm run lint && npm run format` before committing.

This project came out of a [PR](https://github.com/facebook/react-native/pull/14428) to the React Native CLI tool - issues are reported frequently without important environment information, like Node/npm versions.

## Alternatives
- type `$ command -v` until you smash your computer
- [screenfetch](https://github.com/KittyKatt/screenFetch) - fetch system and terminal information, and display a pretty ascii logo
- [Solidarity](https://github.com/infinitered/solidarity) - a project based environment checker
- write your own

## License
MIT
