const envinfo = require('../src/envinfo');
const path = require('path');

describe('envinfo will report on scoped npm packages', () => {
  test('return expected packages', async () => {
    const cwd = process.cwd();
    process.chdir(path.join(__dirname, 'packages', path.sep, 'test-duplicates'));
    try {
      const data = await envinfo.run({ npmPackages: true }, { duplicates: true, json: true });
      expect(JSON.parse(data)).toMatchSnapshot();
    } finally {
      process.chdir(cwd);
    }
  });
});
