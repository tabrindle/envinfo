#!/usr/bin/env node

'use strict';

var helpers = require('./helpers');
var copypasta = require('clipboardy');

module.exports.helpers = helpers;
module.exports.print = function print(opts) {
  var options = opts || {};
  var log = [];

  log.push('');
  options.clipboard ? log.push('Environment:') : log.push('\x1b[4mEnvironment:\x1b[0m');
  log.push('  OS: ' + helpers.getOperatingSystemInfo());
  if (options.cpu) log.push('  CPU: ' + helpers.getCPUInfo());
  log.push('  Node: ' + helpers.getNodeVersion());
  log.push('  Yarn: ' + helpers.getYarnVersion());
  log.push('  npm: ' + helpers.getNpmVersion());
  log.push('  Watchman: ' + helpers.getWatchmanVersion());
  if (!options.noNativeIDE) log.push('  Xcode: ' + helpers.getXcodeVersion());
  if (!options.noNativeIDE) log.push('  Android Studio: ' + helpers.getAndroidStudioVersion());
  log.push('');

  if (options.browsers && process.platform === 'darwin') {
    options.clipboard ? log.push('Browsers:') : log.push('\x1b[4mBrowsers:\x1b[0m');
    var browsers = helpers.browserBundleIdentifiers;
    var browserVersions = Object.keys(browsers).map(function browserMap(browser) {
      return '  ' + browser + ': ' + helpers.getDarwinApplicationVersion(browsers[browser]);
    });
    log = log.concat(browserVersions);
    log.push('');
  }

  if (options.packages) {
    var packageJson = helpers.getPackageJsonByPath('/package.json');

    if (!packageJson) {
      log.push('ERROR: package.json not found!');
      log.push('');
      log = log.join('\n');
      if (options.clipboard) copypasta.copy(log);
      console.log(log);
      return;
    }

    options.clipboard
      ? log.push('Packages: (wanted => installed)')
      : log.push('\x1b[4mPackages:\x1b[0m (wanted => installed)');

    var devDependencies = packageJson.devDependencies || {};
    var dependencies = packageJson.dependencies || {};
    var topLevelDependencies = Object.assign({}, devDependencies, dependencies);
    var packagePaths;

    if (options.duplicates || options.fullTree) {
      packagePaths = helpers.getAllPackageJsonPaths();
    }

    var logFunction = function logFunc(dep) {
      var trimmedDep = dep.trim();
      var wanted = topLevelDependencies[trimmedDep] || '';
      var dependencyPackageJson = helpers.getPackageJsonByName(dep);
      var installed = dependencyPackageJson ? dependencyPackageJson.version : 'Not Found';
      var duplicates = '';

      if (options.duplicates) {
        duplicates = helpers
          .getModuleVersions(dep, packagePaths)
          .filter(depVer => depVer !== installed)
          .join(', ');
        if (duplicates) duplicates = ' (' + duplicates + ')';
      }

      if (wanted) wanted += ' => ';

      log.push('  ' + trimmedDep + ': ' + wanted + installed + duplicates);
    };

    if (Array.isArray(options.packages)) {
      options.packages.map(logFunction);
    } else if (typeof options.packages === 'string') {
      options.packages.split(',').map(logFunction);
    } else if (typeof options.packages === 'boolean') {
      if (options.fullTree) {
        var allDependencies = packagePaths
          .map(filePath => {
            var json = helpers.getPackageJsonByPath(filePath);
            return {
              name: json.name,
              version: json.version,
            };
          })
          .reduce((acc, val) => {
            return Object.assign(acc, {
              [val.name]: acc[val.name] ? acc[val.name].concat([val.version]) : [val.version],
            });
          }, {});
        Object.keys(allDependencies).map(logFunction);
      } else {
        Object.keys(topLevelDependencies).map(logFunction);
      }
    }

    log.push('');
  }
  log = log.join('\n');

  if (options.clipboard) {
    copypasta.writeSync(log);
  }

  console.log(log);
};
