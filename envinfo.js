#!/usr/bin/env node
'use strict';

var child_process = require('child_process');
var os = require('os');
var osName = require('os-name');
var which = require('which');

function run(cmd) {
  return (child_process.execSync(cmd, {
      stdio: [0, 'pipe', 'ignore']
    }).toString() || '').trim();
}

function getXcodeVersion() {
  var xcodeVersion;
  if (process.platform === 'darwin') {
    var xcodePath = which.sync('xcodebuild');
    try {
      xcodeVersion = xcodePath && run(xcodePath + ' -version').split('\n').join(' ');
    } catch (err) {
      xcodeVersion = 'Not Found';
    }
  } else {
    xcodeVersion = 'N/A';
  }
  return xcodeVersion;
}

function getAndroidStudioVersion() {
  var androidStudioVersion = 'Not Found';
  if (process.platform === 'darwin') {
    try {
      androidStudioVersion = run(
          [
            '/usr/libexec/PlistBuddy',
            '-c',
            'Print:CFBundleShortVersionString',
            '-c',
            'Print:CFBundleVersion',
            '/Applications/Android\\ Studio.app/Contents/Info.plist'
          ].join(' ')
        )
        .split('\n')
        .join(' ');
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  } else if (process.platform === 'linux') {
    try {
      var linuxBuildNumber = run('cat /opt/android-studio/build.txt');
      var linuxVersion = run('cat /opt/android-studio/bin/studio.sh | grep "$Home/.AndroidStudio" | head -1')
        .match(/\d\.\d/)[0];
      androidStudioVersion = `${linuxVersion} ${linuxBuildNumber}`;
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  } else if (process.platform.startsWith('win')) {
    try {
      var windowsVersion = run(
          'wmic datafile where name="C:\\\\Program Files\\\\Android\\\\Android Studio\\\\bin\\\\studio.exe" get Version'
        )
        .replace(/(\r\n|\n|\r)/gm, '');
      var windowsBuildNumber = run('type "C:\\\\Program Files\\\\Android\\\\Android Studio\\\\build.txt"')
        .replace(/(\r\n|\n|\r)/gm, '');
      androidStudioVersion = `${windowsVersion} ${windowsBuildNumber}`;
    } catch (err) {
      androidStudioVersion = 'Not Found';
    }
  }
  return androidStudioVersion;
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

function getYarnVersion() {
  var yarnVersion;
  try {
    yarnVersion = run('yarn --version');
  } catch (error) {
    yarnVersion = 'Not Found';
  }
  return yarnVersion;
}

function getOperatingSystemInfo() {
  var operatingSystemInfo;
  try {
    var operatingSystemInfo = osName(os.platform(), os.release());
    if (process.platform === 'darwin') {
      operatingSystemInfo = operatingSystemInfo + ' ' + run('sw_vers -productVersion ');
    }
  } catch (err) {
    operatingSystemInfo = operatingSystemInfo + ' Unknown Version';
  }
  return operatingSystemInfo;
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

module.exports.print = function(options) {
  console.log('');
  console.log('\x1b[4mEnvironment:\x1b[0m');
  console.log('  OS: ', getOperatingSystemInfo());
  console.log('  Node: ', getNodeVersion());
  console.log('  Yarn: ', getYarnVersion());
  console.log('  npm: ', getNpmVersion());
  console.log('  Watchman: ', getWatchmanVersion());
  console.log('  Xcode: ', getXcodeVersion());
  console.log('  Android Studio: ', getAndroidStudioVersion());
  console.log('');

  if (options) {
    if (options.packages) {
      try {
        var packageJson = require(process.cwd() + '/package.json');
      } catch (err) {
        console.log('ERROR: package.json not found!');
        console.log('');
        return;
      }

      console.log('\x1b[4mPackages:\x1b[0m (wanted => installed)');

      var devDependencies = packageJson.devDependencies || {};
      var dependencies = packageJson.dependencies || {};
      var allDependencies = Object.assign({}, devDependencies, dependencies);
      var logFunction = function(dep) {
        if (allDependencies[dep]) {
          var wanted = allDependencies[dep];
          var installed;
          try {
            installed = require(process.cwd() + '/node_modules/' + dep + '/package.json').version;
          } catch (err) {
            installed = 'Not Installed';
          }
          console.log('  ' + dep + ': ' + wanted + ' => ' + installed);
        }
      };

      if (Array.isArray(options.packages)) {
        options.packages.map(logFunction);
      } else if (typeof options.packages === 'string') {
        options.packages.split(',').map(logFunction);
      } else if (typeof options.packages === 'boolean') {
        Object.keys(allDependencies).map(logFunction);
      }
      console.log('');
    }
  }
};
