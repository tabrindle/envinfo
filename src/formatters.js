const yamlify = require('yamlify-object');
const utils = require('./utils');

function clean(data) {
  return Object.keys(data).reduce((acc, prop) => {
    if (data[prop] === 'N/A' || data[prop] === undefined || Object.keys(data[prop]).length === 0)
      return acc;
    if (utils.isObject(data[prop])) {
      return Object.assign(acc, { [prop]: clean(data[prop]) });
    }
    return Object.assign(acc, { [prop]: data[prop] });
  }, {});
}

function formatHeaders(data, options) {
  if (!options) options = { type: 'underline' };
  const formats = {
    underline: ['\x1b[4m', '\x1b[0m'],
  };
  return data
    .slice()
    .split('\n')
    .map(line => {
      const isHeading = line.slice('-1') === ':';
      if (isHeading) {
        const indent = line.match(/^[\s]*/g)[0];
        return `${indent}${formats[options.type][0]}${line.slice(indent.length)}${
          formats[options.type][1]
        }`;
      }
      return line;
    })
    .join('\n');
}

function formatPackages(data) {
  return Object.assign(
    data,
    Object.entries(data.packages || {}).reduce((acc, entry) => {
      const key = entry[0];
      const value = entry[1];
      const wanted = value.wanted ? `${value.wanted} =>` : '';
      const installed = Array.isArray(value.installed)
        ? value.installed.join(', ')
        : value.installed;
      const duplicates = value.duplicates ? `(${value.duplicates.join(', ')})` : '';
      return Object.assign(acc, {
        [key]: `${wanted} ${installed} ${duplicates}`,
      });
    }, {})
  );
}

function joinArray(key, value, options) {
  if (!options) options = { emptyMessage: 'None' };
  if (Array.isArray(value)) {
    value = value.length > 0 ? value.join(', ') : options.emptyMessage;
  }
  return {
    [key]: value,
  };
}

function recursiveTransform(data, fn) {
  return Object.entries(data).reduce((acc, entry) => {
    const key = entry[0];
    const value = entry[1];
    if (utils.isObject(value)) {
      return Object.assign(acc, { [key]: recursiveTransform(value, fn) });
    }
    return Object.assign(acc, fn(key, value));
  }, {});
}

function serializeArrays(data) {
  return recursiveTransform(data, joinArray);
}

function yaml(data) {
  return yamlify(data, {
    indent: '  ',
    prefix: '\n',
    postfix: '\n',
  });
}

function markdown(data) {
  return data
    .slice()
    .split('\n')
    .map(line => {
      if (line !== '') {
        const isHeading = line.slice('-1') === ':';
        const indent = line.search(/\S|$/);
        if (isHeading) {
          return `${'#'.repeat(indent / 2 + 1)} ` + line.slice(indent);
        }
        return ' - ' + line.slice(indent);
      }
      return '';
    })
    .join('\n');
}

function json(data, options) {
  if (!options)
    options = {
      indent: '  ',
    };
  return JSON.stringify(data, null, options.indent);
}

function formatToYaml(data, options) {
  return utils.pipe([
    formatPackages,
    serializeArrays,
    clean,
    yaml,
    options.console ? formatHeaders : utils.noop,
  ])(data);
}

function formatToMarkdown(data) {
  return utils.pipe([formatPackages, serializeArrays, clean, yaml, markdown])(data);
}

function formatToJson(data, options) {
  if (!options) options = {};

  data = utils.pipe([json])(data);
  data = options.console ? `\n${data}\n` : data;

  return data;
}

module.exports = {
  json: formatToJson,
  markdown: formatToMarkdown,
  yaml: formatToYaml,
};
