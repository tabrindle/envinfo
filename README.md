# envinfo

Reporting issues is a pain. Responding to issues is a pain. Make it a bit better.

## Installation
You can either install this package globally:
`npm install -g envinfo` 

Or just install npx!
`npm install -g npx`
No need to install envinfo - npx will install and run it for you!

## Usage
Installed globally: `envinfo`
Via npx: `npx envinfo`

## Sample
```bash
Environment:
  OS:  macOS Sierra
  Node:  v8.0.0
  Yarn:  0.24.5
  npm:  5.0.0
  Xcode:  Xcode 8.3.3 Build version 8E3004b 
  Android Studio:  2.3 AI-162.3934792
```

## Contributing
PRs for additional features are welcome! Run `npm run lint && npm run format` before commiting.

This project came out of a PR to the React Native CLI tool - issues are reported frequently without important environment information, like Node/npm versions. 
