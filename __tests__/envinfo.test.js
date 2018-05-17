const envinfo = require('../src/envinfo');
const helpers = require('../src/helpers');

jest.mock('../src/helpers');

// cycle through the helperFns and mock them according to their name
Object.keys(helpers).forEach(helperFn => {
  const match = helperFn.match(/get(.*)Info/);
  if (match) {
    const name = match[1];
    helpers[helperFn].mockImplementation(() =>
      Promise.resolve([name, '10.0.0', `/usr/local/bin/${name.toLowerCase()}`])
    );
  }
});

describe('Running the programmatic interface', () => {
  test('returns expected json value', () => {
    return envinfo.run({ Binaries: ['Node'] }, { json: true }).then(data => {
      return expect(JSON.parse(data)).toEqual({
        Binaries: {
          Node: {
            version: '10.0.0',
            path: '/usr/local/bin/node',
          },
        },
      });
    });
  });

  test('returns expected yaml value', () => {
    return envinfo.run({ Binaries: ['Node'] }).then(data => {
      // prettier-ignore
      return expect(data).toEqual(
`
  Binaries:
    Node: 10.0.0 - /usr/local/bin/node
`
    );
    });
  });

  test('returns expected markdown value', () => {
    return envinfo.run({ Binaries: ['npm'] }, { markdown: true }).then(data => {
      // prettier-ignore
      return expect(data).toEqual(
`
## Binaries:
 - npm: 10.0.0 - /usr/local/bin/npm
`
    );
    });
  });

  test('returns expected json value with multiple values', () => {
    return envinfo
      .run(
        {
          Binaries: ['Node', 'Yarn', 'npm'],
        },
        { json: true }
      )
      .then(data => {
        return expect(JSON.parse(data)).toEqual({
          Binaries: {
            Node: {
              version: '10.0.0',
              path: '/usr/local/bin/node',
            },
            Yarn: {
              version: '10.0.0',
              path: '/usr/local/bin/yarn',
            },
            npm: {
              version: '10.0.0',
              path: '/usr/local/bin/npm',
            },
          },
        });
      });
  });

  test('returns expected json value with multiple categories', () => {
    return envinfo
      .run(
        {
          Binaries: ['Node'],
          Languages: ['Bash'],
        },
        { json: true }
      )
      .then(data => {
        return expect(JSON.parse(data)).toEqual({
          Binaries: {
            Node: {
              version: '10.0.0',
              path: '/usr/local/bin/node',
            },
          },
          Languages: {
            Bash: {
              version: '10.0.0',
              path: '/usr/local/bin/bash',
            },
          },
        });
      });
  });

  test('filters out returned values with N/A', () => {
    helpers.getChromeInfo.mockImplementation(() => Promise.resolve(['Chrome', 'N/A', 'N/A']));
    return envinfo.run({ Browsers: ['Chrome', 'Firefox'] }, { json: true }).then(data => {
      return expect(JSON.parse(data)).toEqual({
        Browsers: { Firefox: { path: '/usr/local/bin/firefox', version: '10.0.0' } },
      });
    });
  });

  test('filters out returned path values with N/A', () => {
    helpers.getChromeInfo.mockImplementation(() =>
      Promise.resolve(['Chrome', '65.0.3325.181', 'N/A'])
    );
    return envinfo.run({ Browsers: ['Chrome'] }, { json: true }).then(data => {
      return expect(JSON.parse(data)).toEqual({
        Browsers: {
          Chrome: { version: '65.0.3325.181' },
        },
      });
    });
  });

  test('returns expected title in json', () => {
    return envinfo
      .run({ Binaries: ['Node'] }, { title: 'envinfo rocks!', json: true })
      .then(data => {
        return expect(JSON.parse(data)).toEqual({
          'envinfo rocks!': {
            Binaries: {
              Node: {
                version: '10.0.0',
                path: '/usr/local/bin/node',
              },
            },
          },
        });
      });
  });

  test('returns expected title in yaml', () => {
    return envinfo.run({ Binaries: ['Node'] }, { title: 'envinfo rocks!' }).then(data => {
      // prettier-ignore
      return expect(data).toEqual(
`
  envinfo rocks!:
    Binaries:
      Node: 10.0.0 - /usr/local/bin/node
`
      );
    });
  });
});
