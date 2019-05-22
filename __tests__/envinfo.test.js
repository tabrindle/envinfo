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
      expect(JSON.parse(data)).toMatchSnapshot();
    });
  });

  test('returns expected yaml value', () => {
    return envinfo.run({ Binaries: ['Node'] }).then(data => {
      expect(data).toMatchSnapshot();
    });
  });

  test('returns expected markdown value', () => {
    return envinfo.run({ Binaries: ['npm'] }, { markdown: true }).then(data => {
      expect(data).toMatchSnapshot();
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
        expect(JSON.parse(data)).toMatchSnapshot();
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
        expect(JSON.parse(data)).toMatchSnapshot();
      });
  });

  test('filters out returned values with N/A', () => {
    helpers.getChromeInfo.mockImplementation(() => Promise.resolve(['Chrome', 'N/A', 'N/A']));

    return envinfo.run({ Browsers: ['Chrome', 'Firefox'] }, { json: true }).then(data => {
      expect(JSON.parse(data)).toMatchSnapshot();
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
        expect(JSON.parse(data)).toMatchSnapshot();
      });
  });

  test('returns expected title in yaml', () => {
    return envinfo.run({ Binaries: ['Node'] }, { title: 'envinfo rocks!' }).then(data => {
      expect(data).toMatchSnapshot();
    });
  });
});

describe('Running the cli interface', () => {
  test('returns expected formatted yaml value', () => {
    const oldIsTTY = process.stdout.isTTY;
    process.stdout.isTTY = true;

    const consoleLogSpy = jest.spyOn(global.console, 'log');
    consoleLogSpy.mockImplementation((data) => expect(data).toMatchSnapshot());

    return envinfo.cli({ binaries: true, console: true }).then(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    }).finally(() => {
      process.stdout.isTTY = oldIsTTY;
      consoleLogSpy.mockClear();
    });
  });

  test('returns expected unformatted yaml value', () => {
    const oldIsTTY = process.stdout.isTTY;
    process.stdout.isTTY = false;

    const consoleLogSpy = jest.spyOn(global.console, 'log');
    consoleLogSpy.mockImplementation((data) => expect(data).toMatchSnapshot());

    return envinfo.cli({ binaries: true, console: true }).then(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    }).finally(() => {
      process.stdout.isTTY = oldIsTTY;
      consoleLogSpy.mockClear();
    });
  });
});
