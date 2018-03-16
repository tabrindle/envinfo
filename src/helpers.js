const childProcess = require('child_process');
const os = require('os');
const osName = require('os-name');
const path = require('path');
const which = require('which');
const packages = require('./packages');
const utils = require('./utils');

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

function getAlliOSSDKs() {
  var iOSSDKVersions;

  if (process.platform === 'darwin') {
    try {
      var output = utils.run('xcodebuild -showsdks');
      iOSSDKVersions = output.match(/[\w]+\s[\d|.]+/g);
    } catch (e) {
      iOSSDKVersions = 'Unknown';
    }
  } else {
    return 'N/A';
  }

  return {
    Platforms: utils.uniq(iOSSDKVersions),
  };
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
    'Build Tools': buildTools,
    'API Levels': androidAPIs,
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
  return utils.customGenericVersionFunction(() => getDarwinApplicationVersion('com.github.atom'));
}

function getCPUInfo() {
  return utils.customGenericVersionFunction(() => os.arch() + ' ' + os.cpus()[0].model, 'Unknown');
}

function getBashVersion() {
  var bashVersion;
  var bashPath;
  try {
    bashPath = which.sync('bash');
    bashVersion = utils.run(`${bashPath} --version`).match(utils.versionRegex)[0];
  } catch (error) {
    bashVersion = 'Not Found';
  }
  return bashVersion;
}

function getPhpVersion() {
  return utils.customGenericVersionFunction(() => utils.run('php -v').split(' ', 2)[1]);
}

function getParallelsVersion() {
  return utils.customGenericVersionFunction(
    () => utils.run('prlctl --version').match(/[version]+\s([\d|.]+)/)[1]
  );
}

function getDockerVersion() {
  return utils.customGenericVersionFunction(() =>
    utils.run('docker --version').replace('Docker version ', '')
  );
}

function getElixirVersion() {
  return utils.customGenericVersionFunction(
    () => /[Elixir]+\s([\d|.]+)/g.exec(utils.run('elixir --version'))[1]
  );
}

function getFreeMemory() {
  return utils.toReadableBytes(os.freemem());
}

function getTotalMemory() {
  return utils.toReadableBytes(os.totalmem());
}

function getSublimeTextVersion() {
  return utils.customGenericVersionFunction(() => getDarwinApplicationVersion('com.sublimetext.3'));
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
  return utils.customGenericVersionFunction(() =>
    utils
      .run('go version')
      .replace('go version go', '')
      .split(' ', 1)
      .join()
  );
}

function getRubyVersion() {
  return utils.customGenericVersionFunction(() =>
    utils
      .run('ruby --version')
      .replace('ruby ', '')
      .split(' ', 1)
      .join()
  );
}

function getNodeVersion() {
  return utils.customGenericVersionFunction(() => utils.run('node --version').replace('v', ''));
}

function getNpmVersion() {
  return utils.customGenericVersionFunction(() => utils.run('npm -v'));
}

function getShell(shellBinary) {
  shellBinary = shellBinary || process.env.SHELL;

  const shellVersion = utils.customGenericVersionFunction(
    () => utils.run(`${shellBinary} --version`).match(utils.versionRegex)[0]
  );

  return (shellBinary && shellVersion && `${shellBinary} - ${shellVersion}`) || `¯\\_(ツ)_/¯`;
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
  return utils.customGenericVersionFunction(
    () => which.sync('watchman') && utils.run(which.sync('watchman') + ' --version')
  );
}

function getVSCodeVersion() {
  return utils.customGenericVersionFunction(() =>
    utils
      .run('code --version')
      .split('\n', 1)
      .join('')
  );
}

function getVirtualBoxVersion() {
  return utils.customGenericVersionFunction(() => utils.run('vboxmanage --version'));
}

function getVMwareVersion() {
  return utils.customGenericVersionFunction(() => getDarwinApplicationVersion('com.vmware.fusion'));
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
  return utils.customGenericVersionFunction(() => utils.run('yarn --version'));
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

module.exports = Object.assign(packages, {
  browserBundleIdentifiers: browserBundleIdentifiers,
  findDarwinApplication: findDarwinApplication,
  generatePlistBuddyCommand: generatePlistBuddyCommand,
  getAllAndroidSDKs: getAllAndroidSDKs,
  getAlliOSSDKs: getAlliOSSDKs,
  getAndroidStudioVersion: getAndroidStudioVersion,
  getAtomVersion: getAtomVersion,
  getBashVersion: getBashVersion,
  getCPUInfo: getCPUInfo,
  getDarwinApplicationVersion: getDarwinApplicationVersion,
  getDockerVersion: getDockerVersion,
  getElixirVersion: getElixirVersion,
  getFreeMemory: getFreeMemory,
  getGoVersion: getGoVersion,
  getHomeBrewVersion: getHomeBrewVersion,
  getNodeVersion: getNodeVersion,
  getNpmVersion: getNpmVersion,
  getOperatingSystemInfo: getOperatingSystemInfo,
  getPhpVersion: getPhpVersion,
  getParallelsVersion: getParallelsVersion,
  getPythonVersion: getPythonVersion,
  getRubyVersion: getRubyVersion,
  getShell: getShell,
  getSublimeTextVersion: getSublimeTextVersion,
  getTotalMemory: getTotalMemory,
  getVirtualBoxVersion: getVirtualBoxVersion,
  getVMwareVersion: getVMwareVersion,
  getVSCodeVersion: getVSCodeVersion,
  getWatchmanVersion: getWatchmanVersion,
  getXcodeVersion: getXcodeVersion,
  getYarnVersion: getYarnVersion,
  getChromeVersion: getChromeVersion,
  getFirefoxVersion: getFirefoxVersion,
  getFirefoxNightlyVersion: getFirefoxNightlyVersion,
});
