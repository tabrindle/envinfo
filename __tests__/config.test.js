const envinfo = require('../src/envinfo');
const path = require('path');

describe('envinfo.js config file', () => {
  test('will read the file and use it', async () => {
    const cwd = process.cwd();
    process.chdir(path.join(__dirname, 'packages', path.sep, 'test-config'));
    try {
      const data = JSON.parse(await envinfo.run());
      expect(Object.keys(data)).toEqual(['System', 'npmPackages']);
      expect(Object.keys(data.System)).toEqual(['OS', 'CPU']);
    } finally {
      process.chdir(cwd);
    }
  });

  test('run will read the file and use it as a promise', async () => {
    const cwd = process.cwd();
    process.chdir(path.join(__dirname, 'packages', path.sep, 'test-config-as-promise'));
    try {
      const data = JSON.parse(await envinfo.run());
      expect(Object.keys(data)).toEqual(['System', 'Binaries']);
      expect(Object.keys(data.System)).toEqual(['OS', 'CPU']);
      expect(Object.keys(data.Binaries)).toEqual(['Node', 'npm']);
    } finally {
      process.chdir(cwd);
    }
  });
});
