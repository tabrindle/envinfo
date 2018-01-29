function formatPackage(packageData, format) {
  const name = packageData[0];
  const data = packageData[1];
  const wanted = data.wanted ? `${data.wanted} =>` : '';
  const installed = Array.isArray(data.installed) ? data.installed.join(', ') : data.installed;
  const duplicates = data.duplicates ? `(${data.duplicates.join(', ')})` : '';
  if (format === 'markdown') return `* ${name}: ${wanted} ${installed} ${duplicates}`;
  return `  ${name}: ${wanted} ${installed} ${duplicates}`;
}

function formatJson(data, options) {
  if (!options) options = {};

  // delete properties that are not applicable
  Object.entries(data).forEach(d => {
    Object.entries(d[1]).forEach(i => {
      if (i[1] === 'N/A') delete d[1][i[0]];
    });
  });

  if (options.console) {
    return `\n${JSON.stringify(data, null, '  ')}\n`;
  }
  return JSON.stringify(data, null, '  ');
}

function formatMarkdown(data, options) {
  if (!options) options = {};
  var compiled = [];
  Object.entries(data).forEach(d => {
    const category = d[0];
    const values = d[1];
    if (Object.entries(values).length) compiled.push(`### ${category}:`);

    if (category === 'Packages') {
      Object.entries(values)
        .map(p => formatPackage(p, 'markdown'))
        .map(p => compiled.push(p));
    } else {
      Object.entries(values).forEach(v => {
        const name = v[0];
        const version = v[1];
        if (version !== 'N/A') compiled.push(`* ${name}: ${version}`);
      });
    }
  });
  if (options.console) {
    return '\n' + compiled.join('\n') + '\n';
  }
  return compiled.join('\n');
}

function formatTable(data, options) {
  var compiled = [];
  if (!options) options = {};
  Object.entries(data).forEach(d => {
    const category = d[0];
    const values = d[1];
    if (Object.entries(values).length) {
      if (options.console) {
        compiled.push(`\x1b[4m${category}:\x1b[0m`);
      } else {
        compiled.push(`${category}:`);
      }
    }
    if (category === 'Packages') {
      Object.entries(values)
        .map(p => formatPackage(p, 'table'))
        .map(p => compiled.push(p));
    } else {
      Object.entries(values).forEach(v => {
        const name = v[0];
        const version = v[1];
        if (version !== 'N/A') compiled.push(`  ${name}: ${version}`);
      });
    }
  });
  if (options.console) {
    return '\n' + compiled.join('\n') + '\n';
  }
  return compiled.join('\n');
}

module.exports = {
  json: formatJson,
  markdown: formatMarkdown,
  table: formatTable,
};
