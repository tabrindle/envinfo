const utils = require('../utils');

module.exports = {
  getNodeInfo: () => {
    utils.log('trace', 'getNodeInfo');
    return Promise.all([
      utils.isWindows
        ? utils.run('node -v').then(utils.findVersion)
        : utils
            .which('node')
            .then(nodePath => (nodePath ? utils.run(nodePath + ' -v') : Promise.resolve('')))
            .then(utils.findVersion),
      utils.which('node').then(utils.condensePath),
    ]).then(v => utils.determineFound('Node', v[0], v[1]));
  },

  getnpmInfo: () => {
    utils.log('trace', 'getnpmInfo');
    return Promise.all([utils.run('npm -v'), utils.which('npm').then(utils.condensePath)]).then(v =>
      utils.determineFound('npm', v[0], v[1])
    );
  },

  getWatchmanInfo: () => {
    utils.log('trace', 'getWatchmanInfo');
    return Promise.all([
      utils
        .which('watchman')
        .then(watchmanPath => (watchmanPath ? utils.run(watchmanPath + ' -v') : undefined)),
      utils.which('watchman'),
    ]).then(v => utils.determineFound('Watchman', v[0], v[1]));
  },

  getYarnInfo: () => {
    utils.log('trace', 'getYarnInfo');
    return Promise.all([
      utils.run('yarn -v'),
      utils.which('yarn').then(utils.condensePath),
    ]).then(v => utils.determineFound('Yarn', v[0], v[1]));
  },
};
