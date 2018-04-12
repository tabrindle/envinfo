'use strict';

const copypasta = require('clipboardy');
const helpers = require('./helpers');
const formatters = require('./formatters');
const presets = require('./presets');
const utils = require('./utils');
const arrayIncludes = require('array-includes');
const objectEntries = require('object.entries');
const objectValues = require('object.values');

if (!Array.prototype.includes) arrayIncludes.shim();
if (!Object.entries) objectEntries.shim();
if (!Object.values) objectValues.shim();

function format(data, options) {
  // set the default formatter (yaml is default, similar to old table)
  const formatter = (() => {
    if (options.json) return formatters.json;
    if (options.markdown) return formatters.markdown;
    return formatters.yaml;
  })();

  if (options.console)
    return console.log(formatter(data, Object.assign({}, options, { console: true }))); // eslint-disable-line no-console

  // call the formatter with console option off first to return, or pipe to clipboard
  const formatted = formatter(data, Object.assign({}, options, { console: false }));
  if (options.clipboard) copypasta.writeSync(formatted);

  return formatted;
}

function main(props, options) {
  options = options || {};
  // set props to passed in props or default to presets.defaults
  const defaults = Object.keys(props).length > 0 ? props : presets.defaults;
  // collect a list of promises of helper functions
  const promises = Object.entries(defaults).reduce((acc, entries) => {
    const category = entries[0];
    const value = entries[1];
    const categoryFn = helpers[`get${category}`];
    // check to see if a category level function exists
    if (categoryFn) {
      if (value) acc.push(categoryFn(value, options));
      // if the value on the category is falsy, don't run it
      return acc;
    }
    // map over a categories helper functions, call and add to the stack
    acc = acc.concat(
      (value || []).map(v => {
        const helperFn = helpers[`get${v.replace(/\s/g, '')}Info`];
        return helperFn ? helperFn() : Promise.resolve(['Unknown']);
      })
    );
    return acc;
  }, []);
  // once all tasks are done, map all the data back to the shape of the original config obj
  return Promise.all(promises).then(data => {
    // reduce promise results to object for addressability.
    const dataObj = data.reduce((acc, dataValue) => {
      if (dataValue && dataValue[0]) Object.assign(acc, { [dataValue[0]]: dataValue });
      return acc;
    }, {});
    // use defaults object for mapping
    const reduced = Object.entries(presets.defaults).reduce((acc, entries) => {
      const category = entries[0];
      const values = entries[1];
      if (dataObj[category]) return Object.assign(acc, { [category]: dataObj[category][1] });
      return Object.assign(acc, {
        [category]: (values || []).reduce((helperAcc, v) => {
          if (dataObj[v]) {
            dataObj[v].shift();
            if (dataObj[v].length === 1) return Object.assign(helperAcc, { [v]: dataObj[v][0] });
            return Object.assign(helperAcc, {
              [v]: { version: dataObj[v][0], path: dataObj[v][1] },
            });
          }
          return helperAcc;
        }, {}),
      });
    }, {});
    return format(reduced, options);
  });
}

// Example usage:
// $ envinfo --system --npmPackages
function cli(options) {
  // if all option is passed, do not pass go, do not collect 200 dollars, go straight to main
  if (options.all)
    return main(
      Object.assign({}, presets.defaults, { npmPackages: true, npmGlobalPackages: true }),
      options
    );
  // if raw, parse the row options and skip to main
  if (options.raw) return main(JSON.parse(options.raw), options);
  // if helper flag, run just that helper then log the results
  if (options.helper) {
    const helper =
      helpers[`get${options.helper}`] ||
      helpers[`get${options.helper}Info`] ||
      helpers[options.helper];
    return helper ? helper().then(console.log) : console.error('Not Found');
  }
  // generic function to make sure passed option exists in presets.defaults list
  // TODO: This will eventually be replaced with a better fuzzy finder.
  const matches = (list, opt) => list.toLowerCase().includes(opt.toLowerCase());
  // check cli options to see if any args are top level categories
  const categories = Object.keys(options).filter(o =>
    Object.keys(presets.defaults).some(c => matches(c, o))
  );
  // build the props object for filtering presets.defaults
  const props = Object.entries(presets.defaults).reduce((acc, entry) => {
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
