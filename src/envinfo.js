#!/usr/bin/env node

'use strict';

var helpers = require('./helpers');
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
  log.push('  Xcode: ' + helpers.getXcodeVersion());
  log.push('  Android Studio: ' + helpers.getAndroidStudioVersion());
  log.push('');

  if (options) {
    if (options.packages) {
      try {
        var packageJson = require(process.cwd() + '/package.json');
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
      var logFunction = function(dep) {
        if (allDependencies[dep]) {
          var wanted = allDependencies[dep];
          var installed;
          try {
            installed = require(process.cwd() + '/node_modules/' + dep + '/package.json').version;
          } catch (err) {
            installed = 'Not Installed';
          }
          log.push('  ' + dep + ': ' + wanted + ' => ' + installed);
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
