const utils = require('../utils');
const path = require('path');

module.exports = {
  getYarnWorkspacesInfo: () => {
    utils.log('trace', 'getYarnWorkspacesInfo');
    return Promise.all([
      utils.run('yarn -v'),
      utils
        .getPackageJsonByPath('package.json')
        .then(packageJson => packageJson && 'workspaces' in packageJson),
    ]).then(v => {
      const name = 'Yarn Workspaces';
      if (v[0] && v[1]) {
        return Promise.resolve([name, v[0]]);
      }
      return Promise.resolve([name, 'Not Found']);
    });
  },

  getLernaInfo: () => {
    utils.log('trace', 'getLernaInfo');
    return Promise.all([
      utils.getPackageJsonByName('lerna').then(packageJson => packageJson && packageJson.version),
      utils.fileExists(path.join(process.cwd(), 'lerna.json')),
    ]).then(v => {
      const name = 'Lerna';
      if (v[0] && v[1]) {
        return Promise.resolve([name, v[0]]);
      }
      return Promise.resolve([name, 'Not Found']);
    });
  },
};
