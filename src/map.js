var helpers = require('./helpers');
// var fuse = require('fuse.js');

module.exports = {
  // system
  cpu: helpers.getCPUInfo,
  os: helpers.getOperatingSystemInfo,
  total_memory: helpers.getTotalMemory,
  free_memory: helpers.getFreeMemory,
  shell: helpers.getShell,
  // applications
  docker: helpers.getDockerVersion,
  node: helpers.getNodeVersion,
  npm: helpers.getNpmVersion,
  watchman: helpers.getWatchmanVersion,
  yarn: helpers.getYarnVersion,
  homebrew: helpers.getHomeBrewVersion,
  android_sdks: helpers.prettifyGetAllAndroidSDKs,
  // browsers
  chrome_canary: () =>
    helpers.getDarwinApplicationVersion(helpers.browserBundleIdentifiers['Chrome Canary']),
  chrome: helpers.getChromeVersion,
  firefox_developer_edition: () =>
    helpers.getDarwinApplicationVersion(
      helpers.browserBundleIdentifiers['Firefox Developer Edition']
    ),
  firefox_nightly: helpers.getFirefoxNightlyVersion,
  firefox: helpers.getFirefoxVersion,
  safari_technology_preview: () =>
    helpers.getDarwinApplicationVersion(
      helpers.browserBundleIdentifiers['Safari Technology Preview']
    ),
  safari: () => helpers.getDarwinApplicationVersion(helpers.browserBundleIdentifiers.Safari),
  // IDEs
  android_studio: helpers.getAndroidStudioVersion,
  atom: helpers.getAtomVersion,
  vscode: helpers.getVSCodeVersion,
  xcode: helpers.getXcodeVersion,
  sublime_text: helpers.getSublimeTextVersion,
  // Languages
  bash: helpers.getBashVersion,
  go: helpers.getGoVersion,
  php: helpers.getPhpVersion,
  python: helpers.getPythonVersion,
  ruby: helpers.getRubyVersion,
};
