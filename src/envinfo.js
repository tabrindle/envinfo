#!/usr/bin/env node

'use strict';

const copypasta = require('clipboardy');
const helpers = require('./helpers');
const helperMap = require('./map');
const formatters = require('./formatters');
const packages = require('./packages');
const arrayincludes = require('array-includes');
const objectentries = require('object.entries');
const objectvalues = require('object.values');

if (!Object.entries) objectentries.shim();
if (!Object.values) objectvalues.shim();
if (!Array.prototype.includes) arrayincludes.shim();

module.exports.helpers = helpers;
module.exports.envinfo = function print(options) {
  const props = {
    System: ['OS', 'CPU', 'Free Memory', 'Total Memory', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman', 'Docker', 'Homebrew'],
    SDKs: ['Android'],
    IDEs: ['Android Studio', 'Atom', 'VSCode', 'Sublime Text', 'Xcode'],
    Languages: ['Bash', 'Go', 'PHP', 'Python', 'Ruby'],
    Browsers: [
      'Chrome',
      'Chrome Canary',
      'Firefox',
      'Firefox Developer Edition',
      'Firefox Nightly',
      'Safari',
      'Safari Technology Preview',
    ],
  };
  const info = Object.entries(props).reduce((acc, prop) => {
    const key = prop[0];
    const value = prop[1];
    const category = {
      [key]: value.reduce((cat, name) => {
        const fn = helperMap[name.toLowerCase().replace(/\s/g, '_')];
        return Object.assign(cat, {
          [name]: fn ? fn() : 'Unknown',
        });
      }, {}),
    };
    return Object.assign(acc, category);
  }, {});
  const npmPackages = options.packages
    ? {
        Packages: packages.getPackageInfo(options.packages, options),
      }
    : {};
  const npmGlobals = options.globalPackages
    ? {
        'Global Packages': packages.getNpmGlobalPackages(),
      }
    : {};
  const data = Object.assign(info, npmPackages, npmGlobals);
  const formatter = (() => {
    if (options.json) return formatters.json;
    if (options.markdown) return formatters.markdown;
    return formatters.yaml;
  })();
  const formatted = formatter(data, { console: false });

  if (options.clipboard) copypasta.writeSync(formatted);
  if (options.console) console.log(formatter(data, { console: true })); // eslint-disable-line no-console

  return formatted;
};
