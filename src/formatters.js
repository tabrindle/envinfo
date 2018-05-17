const yamlify = require('yamlify-object');
const utils = require('./utils');

function clean(data, options) {
  utils.log('trace', 'clean', data);
  return Object.keys(data).reduce((acc, prop) => {
    if (
      (!options.showNotFound && data[prop] === 'Not Found') ||
      data[prop] === 'N/A' ||
      data[prop] === undefined ||
      Object.keys(data[prop]).length === 0
    )
      return acc;
    if (utils.isObject(data[prop])) {
      if (
        Object.values(data[prop]).every(
          v => v === 'N/A' || (!options.showNotFound && v === 'Not Found')
        )
      )
        return acc;
      return Object.assign(acc, { [prop]: clean(data[prop], options) });
    }
    return Object.assign(acc, { [prop]: data[prop] });
  }, {});
}

function formatHeaders(data, options) {
  utils.log('trace', 'formatHeaders');
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
  utils.log('trace', 'formatPackages');
  if (!data.npmPackages) return data;
  return Object.assign(data, {
    npmPackages: Object.entries(data.npmPackages || {}).reduce((acc, entry) => {
      const key = entry[0];
      const value = entry[1];
      if (value === 'Not Found')
        return Object.assign(acc, {
          [key]: value,
        });
      const wanted = value.wanted ? `${value.wanted} =>` : '';
      const installed = Array.isArray(value.installed)
        ? value.installed.join(', ')
        : value.installed;
      const duplicates = value.duplicates ? `(${value.duplicates.join(', ')})` : '';
      return Object.assign(acc, {
        [key]: `${wanted} ${installed} ${duplicates}`,
      });
    }, {}),
  });
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
  utils.log('trace', 'serializeArrays');
  return recursiveTransform(data, joinArray);
}

function serializeVersionsAndPaths(data) {
  utils.log('trace', 'serializeVersionsAndPaths');
  return Object.entries(data).reduce(
    (Dacc, Dentry) =>
      Object.assign(
        Dacc,
        {
          [Dentry[0]]: Object.entries(Dentry[1]).reduce((acc, entry) => {
            const key = entry[0];
            const value = entry[1];
            if (value.version) {
              return Object.assign(acc, {
                [key]: [value.version, value.path].filter(Boolean).join(' - '),
              });
            }
            return Object.assign(acc, {
              [key]: [value][0],
            });
          }, {}),
        },
        {}
      ),
    {}
  );
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
  utils.log('trace', 'formatToYaml', options);
  return utils.pipe([
    () => clean(data, options),
    formatPackages,
    serializeArrays,
    serializeVersionsAndPaths,
    options.title ? d => ({ [options.title]: d }) : utils.noop,
    yaml,
    options.console ? formatHeaders : utils.noop,
  ])(data, options);
}

function formatToMarkdown(data, options) {
  utils.log('trace', 'formatToMarkdown');
  return utils.pipe([
    () => clean(data, options), // I'm either too lazy too stupid to fix this. #didYouMeanRecursion?
    formatPackages,
    serializeArrays,
    serializeVersionsAndPaths,
    yaml,
    markdown,
    options.title ? d => `\n# ${options.title}${d}` : utils.noop,
  ])(data, options);
}

function formatToJson(data, options) {
  utils.log('trace', 'formatToJson');
  if (!options) options = {};

  data = utils.pipe([
    () => clean(data, options),
    options.title ? d => ({ [options.title]: d }) : utils.noop,
    json,
  ])(data);
  data = options.console ? `\n${data}\n` : data;

  return data;
}

module.exports = {
  json: formatToJson,
  markdown: formatToMarkdown,
  yaml: formatToYaml,
};
