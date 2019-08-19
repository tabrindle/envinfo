const envinfo = require('../src/envinfo');
const path = require('path');

describe('Running the programmatic interface', () => {
  test('return expected duplicates in json', async () => {
    const cwd = process.cwd();
    process.chdir(path.join(__dirname, 'packages', path.sep, 'test-duplicates'));
    try {
      const data = await envinfo.run({ npmPackages: ['b'] }, { duplicates: true, json: true });
      expect(JSON.parse(data)).toMatchSnapshot();
    } finally {
      process.chdir(cwd);
    }
  });

  test('return expected duplicates in yaml', async () => {
    const cwd = process.cwd();
    process.chdir(path.join(__dirname, 'packages', path.sep, 'test-duplicates'));
    try {
      const data = await envinfo.run({ npmPackages: ['b'] }, { duplicates: true });
      expect(data).toMatchSnapshot();
    } finally {
      process.chdir(cwd);
    }
  });
});
