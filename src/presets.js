module.exports = {
  defaults: {
    System: ['OS', 'CPU', 'Memory', 'Container', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
    Utilities: ['CMake', 'Make', 'GCC', 'Git', 'Mercurial'],
    Servers: ['Apache', 'Nginx'],
    Virtualization: ['Docker', 'Parallels', 'VirtualBox', 'VMware Fusion'],
    SDKs: ['iOS SDK', 'Android SDK'],
    IDEs: [
      'Android Studio',
      'Atom',
      'Emacs',
      'IntelliJ',
      'NVim',
      'Nano',
      'PhpStorm',
      'Sublime Text',
      'VSCode',
      'Vim',
      'WebStorm',
      'Xcode',
    ],
    Languages: ['Bash', 'Go', 'Elixir', 'Java', 'Perl', 'PHP', 'Python', 'Ruby', 'Rust', 'Scala'],
    Databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite'],
    Browsers: [
      'Chrome',
      'Chrome Canary',
      'Edge',
      'Firefox',
      'Firefox Developer Edition',
      'Firefox Nightly',
      'Internet Explorer',
      'Safari',
      'Safari Technology Preview',
    ],
    npmPackages: null,
    npmGlobalPackages: null,
  },
  jest: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages: ['jest'],
  },
  'react-native': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
    SDKs: ['iOS SDK', 'Android SDK'],
    IDEs: ['Android Studio', 'Xcode'],
    npmPackages: ['react', 'react-native'],
    npmGlobalPackages: ['react-native-cli'],
  },
  nyc: {
    System: ['OS', 'CPU', 'Memory'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages: '/**/{*babel*,@babel/*/,*istanbul*,nyc,source-map-support,typescript,ts-node}',
  },
  webpack: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages: '*webpack*',
    npmGlobalPackages: ['webpack', 'webpack-cli'],
  },
  'styled-components': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: ['Chrome', 'Firefox', 'Safari'],
    npmPackages: '*styled-components*',
  },
  'create-react-app': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'npm', 'Yarn'],
    Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
    npmPackages: ['react', 'react-dom', 'react-scripts'],
    npmGlobalPackages: ['create-react-app'],
    options: {
      duplicates: true,
      showNotFound: true,
    },
  },
  apollo: {
    System: ['OS'],
    Binaries: ['Node', 'npm', 'Yarn'],
    Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
    npmPackages: '*apollo*',
    npmGlobalPackages: '*apollo*',
  },
  'react-native-web': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'npm', 'Yarn'],
    Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
    npmPackages: ['react', 'react-native-web'],
    options: {
      showNotFound: true,
    },
  },
};
