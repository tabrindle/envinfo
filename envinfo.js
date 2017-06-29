#!/usr/bin/env node
'use strict';

var child_process = require('child_process');
var os = require('os');
var osName = require('os-name');

function getXcodeVersion() {
  var xcodeVersion = 'Not Found';
  if (process.platform === 'darwin') {
    try {
      xcodeVersion = child_process.execSync('/usr/bin/xcodebuild -version').toString().split('\n').join(' ');
    } catch (err) {
      console.log('xcodebuild not found in typical install location');
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
      androidStudioVersion = child_process
        .execFileSync(
          '/usr/libexec/PlistBuddy',
          [
            '-c',
            'Print:CFBundleShortVersionString',
            '-c',
            'Print:CFBundleVersion',
            '/Applications/Android Studio.app/Contents/Info.plist'
          ],
          { encoding: 'utf8' }
        )
        .split('\n')
        .join(' ');
    } catch (err) {
      console.log('Android Studio not found in typical install location');
    }
  } else if (process.platform === 'linux') {
    try {
      var linuxBuildNumber = child_process.execSync('cat /opt/android-studio/build.txt').toString();
      var linuxVersion = child_process
        .execSync('cat /opt/android-studio/bin/studio.sh | grep "$Home/.AndroidStudio" | head -1')
        .toString()
        .match(/\d\.\d/)[0];
      androidStudioVersion = `${linuxVersion} ${linuxBuildNumber}`;
    } catch (err) {
      console.log('Android Studio not found in typical install location');
    }
  } else if (process.platform.startsWith('win')) {
    try {
      var windowsVersion = child_process
        .execSync(
          'wmic datafile where name="C:\\\\Program Files\\\\Android\\\\Android Studio\\\\bin\\\\studio.exe" get Version'
        )
        .toString()
        .replace(/(\r\n|\n|\r)/gm, '');
      var windowsBuildNumber = child_process
        .execSync('type "C:\\\\Program Files\\\\Android\\\\Android Studio\\\\build.txt"')
        .toString()
        .replace(/(\r\n|\n|\r)/gm, '');
      androidStudioVersion = `${windowsVersion} ${windowsBuildNumber}`;
    } catch (err) {
      console.log('Android Studio not found in typical install location');
    }
  }
  return androidStudioVersion;
}

function getNpmVersion() {
  var npmVersion;
  try {
    npmVersion = (child_process.execSync('npm -v', {
      stdio: [0, 'pipe', 'ignore']
    }).toString() || '')
      .trim();
  } catch (error) {
    npmVersion = 'Not Found';
  }
  return npmVersion;
}

function getYarnVersion() {
  var yarnVersion;
  try {
    yarnVersion = (child_process.execSync('yarn --version', {
      stdio: [0, 'pipe', 'ignore']
    }).toString() || '')
      .trim();
  } catch (error) {
    yarnVersion = 'Not Found';
  }
  return yarnVersion;
}

function getOperatingSystemInfo() {
  try {
    if (process.platform === 'darwin') {
      var version = (child_process.execSync('sw_vers -productVersion ', {
        stdio: [0, 'pipe', 'ignore']
      }).toString() || '')
        .trim();
      return osName(os.platform(), os.release()) + ' ' + version;
    }
  } catch (err) {
    console.log('Unable to find Mac OS version');
  }
  return osName(os.platform(), os.release());
}

module.exports.print = function(options) {
  console.log('Environment:');
  console.log('  OS: ', getOperatingSystemInfo());
  console.log('  Node: ', process.version);
  console.log('  Yarn: ', getYarnVersion());
  console.log('  npm: ', getNpmVersion());
  console.log('  Xcode: ', getXcodeVersion());
  console.log('  Android Studio: ', getAndroidStudioVersion());

  if (options) {
    if (options.packages) {
      console.log('Packages:');

      var packageJson = require(process.cwd() + '/package.json');
      var devDependencies = packageJson.devDependencies || {};
      var dependencies = packageJson.dependencies || {};
      var allDependencies = Object.assign({}, devDependencies, dependencies);
      var logFunction = function(dep) {
        if (allDependencies[dep]) console.log('  ' + dep + ': ', allDependencies[dep]);
      };

      if (Array.isArray(options.packages)) {
        options.packages.map(logFunction);
      } else if (typeof options.packages === 'string') {
        options.packages.split(',').map(logFunction);
      } else if (typeof options.packages === 'boolean') {
        Object.keys(allDependencies).map(logFunction);
      }
    }
  }
};
