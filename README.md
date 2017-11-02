# envinfo

Reporting issues is a pain. Responding to issues is a pain. Make it a bit better.

## Installation & Usage
Install this package globally:

`npm install -g envinfo` 
`envinfo`

Optionally copy directly to your clipboard with `envinfo --clipboard`

```bash
Environment:
  OS: macOS High Sierra 10.13
  Node: 8.9.0
  Yarn: 1.2.1
  npm: 5.5.1
  Watchman: 4.9.0
  Xcode: Xcode 9.0 Build version 9A235
  Android Studio:  2.3 AI-162.3934792
```

Optionally add packages from your package.json:
`envinfo --packages react,react-native`

```bash
Environment:
  OS: macOS High Sierra 10.13
  Node: 8.9.0
  Yarn: 1.2.1
  npm: 5.5.1
  Watchman: 4.9.0
  Xcode: Xcode 9.0 Build version 9A235
  Android Studio:  2.3 AI-162.3934792
Packages: (wanted => installed)
  react:  16.0.0-alpha.6 => 16.0.0-alpha.6
  react-native:  0.44.0 => 0.44.0
```

Or all of your packages like this:
`envinfo --packages`

```bash
Environment:
  OS:  macOS Sierra 10.12.5
  Node:  8.1.3
  Yarn:  0.27.5
  npm:  5.1.0
  Xcode:  Xcode 8.3.3 Build version 8E3004b
  Android Studio:  2.3 AI-162.3934792
Packages: (wanted => installed)
  eslint: ^4.0.0 => 4.2.0
  prettier-eslint-cli: ^4.1.1 => 4.1.1
  minimist: ^1.2.0 => 1.2.0
  os-name: ^2.0.1 => 2.0.1
  which: ^1.2.14 => 1.2.14
```

Add CPU and architecture information with `envinfo --cpu`:

```bash
Environment:
  OS: macOS High Sierra 10.13
  CPU: x64 Intel(R) Core(TM) i7-4870HQ CPU @ 8.50GHz
  Node: 8.9.0
  Yarn: 1.2.1
  npm: 5.5.1
  Watchman: 4.9.0
  Xcode: Xcode 9.0 Build version 9A235
  Android Studio:  2.3 AI-162.3934792
```

## Contributing
PRs for additional features are welcome! Run `npm run lint && npm run format` before commiting.

This project came out of a [PR](https://github.com/facebook/react-native/pull/14428) to the React Native CLI tool - issues are reported frequently without important environment information, like Node/npm versions.

envinfo is now live in react-native as of v0.48 as `react-native info`!
