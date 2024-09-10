module.exports = {
  defaults: {
    System: ['OS', 'CPU', 'Memory', 'Container', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun', 'Watchman'],
    Managers: [
      'Apt',
      'Cargo',
      'CocoaPods',
      'Composer',
      'Gradle',
      'Homebrew',
      'Maven',
      'pip2',
      'pip3',
      'RubyGems',
      'Yum',
    ],
    Utilities: [
      'Bazel',
      'CMake',
      'Make',
      'GCC',
      'Git',
      'Clang',
      'Ninja',
      'Mercurial',
      'Subversion',
      'FFmpeg',
      'Curl',
      'OpenSSL',
    ],
    Servers: ['Apache', 'Nginx'],
    Virtualization: ['Docker', 'Docker Compose', 'Parallels', 'VirtualBox', 'VMware Fusion'],
    SDKs: ['iOS SDK', 'Android SDK', 'Windows SDK'],
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
      'Visual Studio',
      'Vim',
      'WebStorm',
      'Xcode',
    ],
    Languages: [
      'Bash',
      'Go',
      'Elixir',
      'Erlang',
      'Java',
      'Perl',
      'PHP',
      'Protoc',
      'Python',
      'Python3',
      'R',
      'Ruby',
      'Rust',
      'Scala',
    ],
    Databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite'],
    Browsers: [
      'Brave Browser',
      'Chrome',
      'Chrome Canary',
      'Chromium',
      'Edge',
      'Firefox',
      'Firefox Developer Edition',
      'Firefox Nightly',
      'Internet Explorer',
      'Safari',
      'Safari Technology Preview',
    ],
    Monorepos: ['Yarn Workspaces', 'Lerna'],
    npmPackages: null,
    npmGlobalPackages: null,
  },
  cssnano: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun'],
    npmPackages: ['cssnano', 'postcss'],
    options: {
      duplicates: true,
    },
  },
  jest: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun'],
    npmPackages: ['jest'],
  },
  'react-native': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun', 'Watchman'],
    SDKs: ['iOS SDK', 'Android SDK', 'Windows SDK'],
    IDEs: ['Android Studio', 'Xcode', 'Visual Studio'],
    npmPackages: ['react', 'react-native'],
    npmGlobalPackages: ['react-native-cli'],
  },
  nyc: {
    System: ['OS', 'CPU', 'Memory'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun'],
    npmPackages: '/**/{*babel*,@babel/*/,*istanbul*,nyc,source-map-support,typescript,ts-node}',
  },
  webpack: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun'],
    npmPackages: '*webpack*',
    npmGlobalPackages: ['webpack', 'webpack-cli'],
  },
  'styled-components': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun'],
    Browsers: ['Chrome', 'Firefox', 'Safari'],
    npmPackages: '*styled-components*',
  },
  'create-react-app': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'npm', 'Yarn', 'pnpm', 'bun'],
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
    Binaries: ['Node', 'npm', 'Yarn', 'pnpm', 'bun'],
    Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
    npmPackages: '{*apollo*,@apollo/*}',
    npmGlobalPackages: '{*apollo*,@apollo/*}',
  },
  'react-native-web': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'npm', 'Yarn', 'pnpm', 'bun'],
    Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
    npmPackages: ['react', 'react-native-web'],
    options: {
      showNotFound: true,
    },
  },
  babel: {
    System: ['OS'],
    Binaries: ['Node', 'npm', 'Yarn', 'pnpm', 'bun'],
    Monorepos: ['Yarn Workspaces', 'Lerna'],
    npmPackages: '{*babel*,@babel/*,eslint,webpack,create-react-app,react-native,lerna,jest,next,rollup}',
  },
  playwright: {
    System: ['OS', 'CPU', 'Memory', 'Container'],
    Binaries: ['Node', 'Yarn', 'npm', 'pnpm', 'bun'],
    Languages: ['Bash'],
    IDEs: ['VSCode'],
    npmPackages: '{playwright*,@playwright/*}',
  },
};
