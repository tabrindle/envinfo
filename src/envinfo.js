'use strict';

const copypasta = require('clipboardy');
const helpers = require('./helpers');
const helperMap = require('./map');
const formatters = require('./formatters');
const presets = require('./presets');
const utils = require('./utils');
const arrayIncludes = require('array-includes');
const objectEntries = require('object.entries');
const objectValues = require('object.values');

if (!Array.prototype.includes) arrayIncludes.shim();
if (!Object.entries) objectEntries.shim();
if (!Object.values) objectValues.shim();

// a map of all the capabilities of envinfo - used as a default input
const capabilities = {
  System: ['OS', 'CPU', 'Free Memory', 'Total Memory', 'Shell'],
  Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
  Virtualization: ['Docker', 'Parallels', 'Virtualbox', 'VMware Fusion'],
  SDKs: ['iOS', 'Android'],
  IDEs: ['Android Studio', 'Atom', 'VSCode', 'Sublime Text', 'Xcode'],
  Languages: ['Bash', 'Go', 'Elixir', 'PHP', 'Python', 'Ruby'],
  Browsers: [
    'Chrome',
    'Chrome Canary',
    'Firefox',
    'Firefox Developer Edition',
    'Firefox Nightly',
    'Safari',
    'Safari Technology Preview',
  ],
  npmPackages: null,
  npmGlobalPackages: true,
};

function main(props, options) {
  // set props to passed in props or default all capabilities
  const defaults = Object.keys(props).length > 0 ? props : capabilities;
  options = options || {};

  // get data by iterating and calling helper functions
  const data = Object.entries(defaults).reduce((acc, prop) => {
    const category = prop[0];
    const value = prop[1];
    // create an object of all the resolved helper values
    return Object.assign(acc, {
      [category]: helperMap[category]
        ? helperMap[category](value, options) // if there is a category level helper
        : value.reduce((cat, name) => {
            const fn = helperMap[name.toLowerCase().replace(/\s/g, '_')];
            return Object.assign(cat, {
              [name]: fn ? fn() : 'Unknown',
            });
          }, {}),
    });
  }, {});

  // set the default formatter (yaml is default, similar to old table)
  const formatter = (() => {
    if (options.json) return formatters.json;
    if (options.markdown) return formatters.markdown;
    return formatters.yaml;
  })();

  // call the formatter with console option off first to return, or pipe to clipboard
  const formatted = formatter(data, { console: false });

  if (options.console) console.log(formatter(data, { console: true })); // eslint-disable-line no-console
  if (options.clipboard) copypasta.writeSync(formatted);

  return formatted;
}

// Example usage:
// $ envinfo --system --npmPackages
function cli(options) {
  // if all option is passed, do not pass go, do not collect 200 dollars, go straight to main
  if (options.all) return main(Object.assign({}, capabilities, { npmPackages: true }), options);
  // if raw, parse the row options and skip to main
  if (options.raw) return main(JSON.parse(options.raw), options);
  // generic function to make sure passed option exists in capability list
  // TODO: This will eventually be replaced with a better fuzzy finder.
  const matches = (list, opt) => list.toLowerCase().includes(opt.toLowerCase());
  // check cli options to see if any args are top level categories
  const categories = Object.keys(options).filter(o =>
    Object.keys(capabilities).some(c => matches(c, o))
  );
  // build the props object for filtering capabilities
  const props = Object.entries(capabilities).reduce((acc, entry) => {
    if (categories.some(c => matches(c, entry[0]))) {
      return Object.assign(acc, { [entry[0]]: entry[1] || options[entry[0]] });
    }
    return acc;
  }, {});

  // if there is a preset, merge that with the parsed props and options
  if (options.preset) {
    if (!presets[options.preset]) console.error(`\nNo "${options.preset}" preset found.`);
    return main(
      Object.assign({}, utils.omit(presets[options.preset], ['options']), props),
      Object.assign(
        {},
        presets[options.preset].options,
        utils.pick(options, ['duplicates', 'fullTree', 'json', 'markdown', 'console', 'clipboard'])
      )
    );
  }
  // call the main function with the filtered props, and cli options
  return main(props, options);
}

// require('envinfo);
// envinfo.run({ system: [os, cpu]}, {fullTree: true })
function run(args, options) {
  return main(args, options);
}

module.exports = {
  cli: cli,
  helpers: helpers,
  main: main,
  run: run,
};
