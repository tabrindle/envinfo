var childProcess = require('child_process');
var os = require('os');
var osName = require('os-name');
var path = require('path');
var which = require('which');
var utils = require('./utils');

var browserBundleIdentifiers = {
  Chrome: 'com.google.Chrome',
  'Chrome Canary': 'com.google.Chrome.canary',
  Firefox: 'org.mozilla.firefox',
  'Firefox Developer Edition': 'org.mozilla.firefoxdeveloperedition',
  'Firefox Nightly': 'org.mozilla.nightly',
  Safari: 'com.apple.Safari',
  'Safari Technology Preview': 'com.apple.SafariTechnologyPreview',
};

function findDarwinApplication(id) {
  var appPath;
  try {
    appPath = utils.run('mdfind "kMDItemCFBundleIdentifier=="' + id + '""').replace(/(\s)/g, '\\ ');
  } catch (error) {
    appPath = null;
  }
  return appPath;
}

function generatePlistBuddyCommand(appPath, options) {
  var optionsArray = (options || ['CFBundleShortVersionString']).map(function optionsMap(option) {
    return '-c Print:' + option;
  });
  return ['/usr/libexec/PlistBuddy']
    .concat(optionsArray)
    .concat([appPath])
    .join(' ');
}

function getDarwinApplicationVersion(bundleIdentifier) {
  var version;
  if (process.platform === 'darwin') {
    try {
      version = utils.run(
        generatePlistBuddyCommand(
          path.join(findDarwinApplication(bundleIdentifier), 'Contents', 'Info.plist'),
          ['CFBundleShortVersionString']
        )
      );
    } catch (error) {
      version = 'Not Found';
    }
    return version;
  }
  return 'N/A';
}

function getAllAndroidSDKs() {
  var buildTools = [];
  var androidAPIs = [];
  try {
    // try to use preferred install path
    var command = process.env.ANDROID_HOME ? '$ANDROID_HOME/tools/bin/sdkmanager' : 'sdkmanager';
    var installed = utils.run(command + ' --list').split('Available')[0];

    var getBuildVersions = /build-tools;([\d|.]+)[\S\s]/g;
    var getAPIVersions = /platforms;android-(\d+)[\S\s]/g;
    var matcher;
    // eslint-disable-next-line
    while ((matcher = getBuildVersions.exec(installed))) {
      buildTools.push(matcher[1]);
    }
    // eslint-disable-next-line
    while ((matcher = getAPIVersions.exec(installed))) {
      androidAPIs.push(matcher[1]);
    }
  } catch (err) {
    buildTools = ['Unknown'];
    androidAPIs = ['Unknown'];
  }

  return {
    Android: {
      'Build Tools': buildTools,
      'API Levels': androidAPIs,
    },
  };
}

function getAndroidStudioVersion() {
  var androidStudioVersion = 'Not Found';
  if (process.platform === 'darwin') {
    try {
      androidStudioVersion = utils
        .run(
          generatePlistBuddyCommand('/Applications/Android\\ Studio.app/Contents/Info.plist', [
            'CFBundleShortVersionString',
            'CFBundleVersion',
          ])
        )
        .split('\n')
        .join(' ');
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  } else if (process.platform === 'linux') {
    try {
      var linuxBuildNumber = utils.run('cat /opt/android-studio/build.txt');
      var linuxVersion = utils
        .run('cat /opt/android-studio/bin/studio.sh | grep "$Home/.AndroidStudio" | head -1')
        .match(/\d\.\d/)[0];
      androidStudioVersion = `${linuxVersion} ${linuxBuildNumber}`;
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  } else if (process.platform.startsWith('win')) {
    try {
      var windowsVersion = utils
        .run(
          'wmic datafile where name="C:\\\\Program Files\\\\Android\\\\Android Studio\\\\bin\\\\studio.exe" get Version'
        )
        .replace(/(\r\n|\n|\r)/gm, '');
      var windowsBuildNumber = utils
        .run('type "C:\\\\Program Files\\\\Android\\\\Android Studio\\\\build.txt"')
        .replace(/(\r\n|\n|\r)/gm, '');
      androidStudioVersion = `${windowsVersion} ${windowsBuildNumber}`;
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  }
  return androidStudioVersion;
}

function getAtomVersion() {
  var atomVersion;
  try {
    atomVersion = getDarwinApplicationVersion('com.github.atom');
  } catch (error) {
    atomVersion = 'Not Found';
  }
  return atomVersion;
}

function getCPUInfo() {
  var CPUInfo;
  try {
    CPUInfo = os.arch() + ' ' + os.cpus()[0].model;
  } catch (error) {
    CPUInfo = 'Not Found';
  }
  return CPUInfo;
}

function getBashVersion() {
  var bashVersion;
  var bashPath;
  try {
    bashPath = which.sync('bash');
    bashVersion = utils.run(`${bashPath} --version`).match(/\d+(\.\d+)+/)[0];
  } catch (error) {
    bashVersion = 'Not Found';
  }
  return bashVersion;
}

function getPhpVersion() {
  var phpVersion;
  try {
    phpVersion = utils.run('php -v').split(' ', 2)[1];
  } catch (error) {
    phpVersion = 'Not Found';
  }
  return phpVersion;
}

function getDockerVersion() {
  var dockerVersion;
  try {
    dockerVersion = utils.run('docker --version').replace('Docker version ', '');
  } catch (error) {
    dockerVersion = 'Not Found';
  }
  return dockerVersion;
}

function getFreeMemory() {
  return utils.toReadableBytes(os.freemem());
}

function getTotalMemory() {
  return utils.toReadableBytes(os.totalmem());
}

function getSublimeTextVersion() {
  var sublimeTextVersion;
  try {
    sublimeTextVersion = getDarwinApplicationVersion('com.sublimetext.3');
  } catch (error) {
    sublimeTextVersion = 'Not Found';
  }
  return sublimeTextVersion;
}

function getHomeBrewVersion() {
  var homeBrewVersion;
  if (process.platform === 'darwin') {
    try {
      homeBrewVersion = utils
        .run('brew --version')
        .replace('Homebrew ', '')
        .split('\n', 1)
        .join();
    } catch (error) {
      homeBrewVersion = 'Not Found';
    }
  } else homeBrewVersion = 'N/A';
  return homeBrewVersion;
}

function getGoVersion() {
  var goVersion;
  try {
    goVersion = utils
      .run('go version')
      .replace('go version go', '')
      .split(' ', 1)
      .join();
  } catch (error) {
    goVersion = 'Not Found';
  }
  return goVersion;
}

function getRubyVersion() {
  var rubyVersion;
  try {
    rubyVersion = utils
      .run('ruby --version')
      .replace('ruby ', '')
      .split(' ', 1)
      .join();
  } catch (error) {
    rubyVersion = 'Not Found';
  }
  return rubyVersion;
}

function getNodeVersion() {
  var nodeVersion;
  try {
    nodeVersion = utils.run('node --version').replace('v', '');
  } catch (error) {
    nodeVersion = 'Not Found';
  }
  return nodeVersion;
}

function getNpmVersion() {
  var npmVersion;
  try {
    npmVersion = utils.run('npm -v');
  } catch (error) {
    npmVersion = 'Not Found';
  }
  return npmVersion;
}

function getNpmGlobalPackages() {
  var npmGlobalPackages;
  try {
    npmGlobalPackages = utils.run('npm list -g --depth=0 --json');
    npmGlobalPackages = JSON.parse(npmGlobalPackages);
    npmGlobalPackages = Object.entries(npmGlobalPackages.dependencies).reduce((acc, dep) => {
      const name = dep[0];
      const info = dep[1];
      return Object.assign(acc, {
        [name]: info.version,
      });
    }, {});
  } catch (error) {
    npmGlobalPackages = 'Not Found';
  }
  return npmGlobalPackages;
}

function getShell() {
  var shell;
  try {
    if (process.env.SHELL.indexOf('bash') > 0)
      shell = utils.run(process.env.SHELL + ' --version').match(/\d+(\.\d+)+/)[0];
  } catch (error) {
    shell = 'Not Found';
  }
  return process.env.SHELL + ' - ' + shell;
}

function getOperatingSystemInfo() {
  var operatingSystemInfo;
  try {
    operatingSystemInfo = osName(os.platform(), os.release());
    if (process.platform === 'darwin') {
      operatingSystemInfo = operatingSystemInfo + ' ' + utils.run('sw_vers -productVersion ');
    }
  } catch (err) {
    operatingSystemInfo += ' Unknown Version';
  }
  return operatingSystemInfo;
}

function getWatchmanVersion() {
  var watchmanVersion;
  try {
    var watchmanPath = which.sync('watchman');
    watchmanVersion = watchmanPath && utils.run(watchmanPath + ' --version');
  } catch (error) {
    watchmanVersion = 'Not Found';
  }
  return watchmanVersion;
}

function getVSCodeVersion() {
  var VSCodeVersion;
  try {
    VSCodeVersion = utils
      .run('code --version')
      .split('\n', 1)
      .join('');
  } catch (error) {
    VSCodeVersion = 'Not Found';
  }
  return VSCodeVersion;
}

function getPythonVersion() {
  var pythonVersion;
  var pythonPath;
  try {
    pythonPath = utils.run('which python');
    pythonVersion = childProcess
      .execFileSync(pythonPath, ['-c', 'import platform; print(platform.python_version());'])
      .toString()
      .replace(/(\r\n|\n|\r)/gm, '');
  } catch (error) {
    pythonVersion = 'Not Found';
  }
  return pythonVersion;
}

function getXcodeVersion() {
  var xcodeVersion;
  if (process.platform === 'darwin') {
    var xcodePath = which.sync('xcodebuild');
    try {
      xcodeVersion =
        xcodePath &&
        utils
          .run(xcodePath + ' -version')
          .split('\n')
          .join(' ');
    } catch (err) {
      xcodeVersion = 'Not Found';
    }
  } else {
    xcodeVersion = 'N/A';
  }
  return xcodeVersion;
}

function getYarnVersion() {
  var yarnVersion;
  try {
    yarnVersion = utils.run('yarn --version');
  } catch (error) {
    yarnVersion = 'Not Found';
  }
  return yarnVersion;
}

function getChromeVersion() {
  var chromeVersion;
  if (process.platform === 'linux') {
    try {
      chromeVersion = utils.run('google-chrome --version').replace(/^.* ([^ ]*)/g, '$1');
    } catch (err) {
      chromeVersion = 'Not Found';
    }
  } else {
    chromeVersion = getDarwinApplicationVersion(browserBundleIdentifiers.Chrome);
  }
  return chromeVersion;
}

function getFirefoxVersion() {
  var firefoxVersion;
  if (process.platform === 'linux') {
    try {
      firefoxVersion = utils.run('firefox --version').replace(/^.* ([^ ]*)/g, '$1');
    } catch (err) {
      firefoxVersion = 'Not Found';
    }
  } else {
    firefoxVersion = getDarwinApplicationVersion(browserBundleIdentifiers.Firefox);
  }
  return firefoxVersion;
}

function getFirefoxNightlyVersion() {
  var firefoxNightlyVersion;
  if (process.platform === 'linux') {
    try {
      firefoxNightlyVersion = utils.run('firefox-trunk --version').replace(/^.* ([^ ]*)/g, '$1');
    } catch (err) {
      firefoxNightlyVersion = 'Not Found';
    }
  } else {
    firefoxNightlyVersion = getDarwinApplicationVersion(
      browserBundleIdentifiers['Firefox Nightly']
    );
  }
  return firefoxNightlyVersion;
}

module.exports = {
  browserBundleIdentifiers: browserBundleIdentifiers,
  findDarwinApplication: findDarwinApplication,
  generatePlistBuddyCommand: generatePlistBuddyCommand,
  getAllAndroidSDKs: getAllAndroidSDKs,
  getAndroidStudioVersion: getAndroidStudioVersion,
  getAtomVersion: getAtomVersion,
  getBashVersion: getBashVersion,
  getCPUInfo: getCPUInfo,
  getDarwinApplicationVersion: getDarwinApplicationVersion,
  getDockerVersion: getDockerVersion,
  getFreeMemory: getFreeMemory,
  getGoVersion: getGoVersion,
  getHomeBrewVersion: getHomeBrewVersion,
  getNodeVersion: getNodeVersion,
  getNpmGlobalPackages: getNpmGlobalPackages,
  getNpmVersion: getNpmVersion,
  getOperatingSystemInfo: getOperatingSystemInfo,
  getPhpVersion: getPhpVersion,
  getPythonVersion: getPythonVersion,
  getRubyVersion: getRubyVersion,
  getShell: getShell,
  getSublimeTextVersion: getSublimeTextVersion,
  getTotalMemory: getTotalMemory,
  getVSCodeVersion: getVSCodeVersion,
  getWatchmanVersion: getWatchmanVersion,
  getXcodeVersion: getXcodeVersion,
  getYarnVersion: getYarnVersion,
  getChromeVersion: getChromeVersion,
  getFirefoxVersion: getFirefoxVersion,
  getFirefoxNightlyVersion: getFirefoxNightlyVersion,
};
