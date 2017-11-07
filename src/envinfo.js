#!/usr/bin/env node

'use strict';

var helpers = require('./helpers');
var utils = require('./utils');
var copypasta = require('copy-paste');

module.exports.print = function print(options) {
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

  if (options) {
    if (options.packages) {
      var packageJson;
      try {
        packageJson = require(process.cwd() + '/package.json');
      } catch (err) {
        log.push('ERROR: package.json not found!');
        log.push('');
        return;
      }

      options.clipboard
        ? log.push('Packages: (wanted => installed)')
        : log.push('\x1b[4mPackages:\x1b[0m (wanted => installed)');

      var devDependencies = packageJson.devDependencies || {};
      var dependencies = packageJson.dependencies || {};
      var allDependencies = Object.assign({}, devDependencies, dependencies);
      var packageTree;

      if (options.recursive) {
        packageTree = helpers.getPackageTree();
      }

      var logFunction = function logFunc(dep) {
        var trimmedDep = dep.trim();
        if (allDependencies[trimmedDep]) {
          var wanted = allDependencies[trimmedDep];
          var installed;
          if (options.recursive) {
            var flatTree = helpers.flattenNodeModuleTree(packageTree.dependencies);
            installed = utils.uniq(flatTree[trimmedDep]).join(', ');
          } else {
            installed = utils.getDependencyPackageJson(dep).version;
          }
          log.push('  ' + trimmedDep + ': ' + wanted + ' => ' + installed);
        } else {
          log.push('  ' + trimmedDep + ': Not Found');
        }
      };

      if (Array.isArray(options.packages)) {
        options.packages.map(logFunction);
      } else if (typeof options.packages === 'string') {
        options.packages.split(',').map(logFunction);
      } else if (typeof options.packages === 'boolean') {
        Object.keys(allDependencies).map(logFunction);
      }

      log.push('');
    }
    log = log.join('\n');

    if (options.clipboard) {
      copypasta.copy(log);
    }
  }

  console.log(log);
};
