module.exports = {
  jest: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages: ['jest'],
  },
  'react-native': {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
    SDKs: ['iOS', 'Android'],
    IDEs: ['Android Studio', 'Xcode'],
    npmPackages: ['react', 'react-native'],
    npmGlobalPackages: ['react-native-cli'],
  },
  webpack: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages: ['webpack', 'webpack-cli'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
  },
};
