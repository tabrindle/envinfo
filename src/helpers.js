var childProcess = require('child_process');
var fs = require('fs');
var glob = require('glob');
var os = require('os');
var osName = require('os-name');
var path = require('path');
var which = require('which');

var browserBundleIdentifiers = {
  Chrome: 'com.google.Chrome',
  'Chrome Canary': 'com.google.Chrome.canary',
  Firefox: 'org.mozilla.firefox',
  'Firefox Developer Edition': 'org.mozilla.firefoxdeveloperedition',
  'Firefox Nightly': 'org.mozilla.nightly',
  Safari: 'com.apple.Safari',
  'Safari Technology Preview': 'com.apple.SafariTechnologyPreview',
};

function uniq(arr) {
  return Array.from(new Set(arr));
}

function requireJson(filePath) {
  var packageJson;
  if (fs.existsSync(filePath)) {
    try {
      packageJson = require(filePath);
    } catch (e) {
      return false;
    }
    return packageJson;
  }
  return false;
}

function getPackageJsonByName(dep) {
  return this.requireJson(path.join(process.cwd(), '/node_modules/', dep, '/package.json'));
}

function getPackageJsonByPath(filePath) {
  return this.requireJson(path.join(process.cwd(), filePath));
}

function run(cmd) {
  return (
    childProcess
      .execSync(cmd, {
        stdio: [0, 'pipe', 'ignore'],
      })
      .toString() || ''
  ).trim();
}

function findDarwinApplication(id) {
  var appPath;
  try {
    appPath = run('mdfind "kMDItemCFBundleIdentifier=="' + id + '""').replace(/(\s)/g, '\\ ');
  } catch (error) {
    appPath = false;
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

function getAndroidStudioVersion() {
  var androidStudioVersion = 'Not Found';
  if (process.platform === 'darwin') {
    try {
      androidStudioVersion = run(
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
      var linuxBuildNumber = run('cat /opt/android-studio/build.txt');
      var linuxVersion = run(
        'cat /opt/android-studio/bin/studio.sh | grep "$Home/.AndroidStudio" | head -1'
      ).match(/\d\.\d/)[0];
      androidStudioVersion = `${linuxVersion} ${linuxBuildNumber}`;
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  } else if (process.platform.startsWith('win')) {
    try {
      var windowsVersion = run(
        'wmic datafile where name="C:\\\\Program Files\\\\Android\\\\Android Studio\\\\bin\\\\studio.exe" get Version'
      ).replace(/(\r\n|\n|\r)/gm, '');
      var windowsBuildNumber = run(
        'type "C:\\\\Program Files\\\\Android\\\\Android Studio\\\\build.txt"'
      ).replace(/(\r\n|\n|\r)/gm, '');
      androidStudioVersion = `${windowsVersion} ${windowsBuildNumber}`;
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  }
  return androidStudioVersion;
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

function getDarwinApplicationVersion(bundleIdentifier) {
  var version;
  try {
    version = run(
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

function getNodeVersion() {
  var nodeVersion;
  try {
    nodeVersion = run('node --version').replace('v', '');
  } catch (error) {
    nodeVersion = 'Not Found';
  }
  return nodeVersion;
}

function getNpmVersion() {
  var npmVersion;
  try {
    npmVersion = run('npm -v');
  } catch (error) {
    npmVersion = 'Not Found';
  }
  return npmVersion;
}

function getOperatingSystemInfo() {
  var operatingSystemInfo;
  try {
    operatingSystemInfo = osName(os.platform(), os.release());
    if (process.platform === 'darwin') {
      operatingSystemInfo = operatingSystemInfo + ' ' + run('sw_vers -productVersion ');
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
    watchmanVersion = watchmanPath && run(watchmanPath + ' --version');
  } catch (error) {
    watchmanVersion = 'Not Found';
  }
  return watchmanVersion;
}

function getXcodeVersion() {
  var xcodeVersion;
  if (process.platform === 'darwin') {
    var xcodePath = which.sync('xcodebuild');
    try {
      xcodeVersion =
        xcodePath &&
        run(xcodePath + ' -version')
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
    yarnVersion = run('yarn --version');
  } catch (error) {
    yarnVersion = 'Not Found';
  }
  return yarnVersion;
}

function getAllPackageJsonPaths() {
  return glob.sync('node_modules/**/package.json');
}

function getModuleVersions(dependency, packagePaths) {
  var paths;
  var versions;
  try {
    paths = packagePaths.filter(function filterPackagePaths(packagePath) {
      return packagePath.includes(`/${dependency}/package.json`);
    });
    versions = paths
      .map(function mapPathsForVersion(packageJsonPath) {
        var packageJson = getPackageJsonByPath(packageJsonPath);
        if (packageJson) return packageJson.version;
        return false;
      })
      .filter(Boolean);
    versions = uniq(versions).sort();
  } catch (error) {
    versions = [];
  }
  return versions;
}

module.exports = {
  browserBundleIdentifiers: browserBundleIdentifiers,
  findDarwinApplication: findDarwinApplication,
  generatePlistBuddyCommand: generatePlistBuddyCommand,
  getAllPackageJsonPaths: getAllPackageJsonPaths,
  getAndroidStudioVersion: getAndroidStudioVersion,
  getCPUInfo: getCPUInfo,
  getDarwinApplicationVersion: getDarwinApplicationVersion,
  getModuleVersions: getModuleVersions,
  getNodeVersion: getNodeVersion,
  getNpmVersion: getNpmVersion,
  getOperatingSystemInfo: getOperatingSystemInfo,
  getPackageJsonByName: getPackageJsonByName,
  getPackageJsonByPath: getPackageJsonByPath,
  getWatchmanVersion: getWatchmanVersion,
  getXcodeVersion: getXcodeVersion,
  getYarnVersion: getYarnVersion,
  requireJson: requireJson,
  uniq: uniq,
};
