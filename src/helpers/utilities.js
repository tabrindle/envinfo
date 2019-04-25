const utils = require('../utils');

module.exports = {
  getCMakeInfo: () => {
    utils.log('trace', 'getCMakeInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('cmake --version').then(utils.findVersion),
        utils.run('which cmake'),
      ]).then(v => utils.determineFound('CMake', v[0], v[1]));
    }
    return Promise.resolve(['CMake', 'N/A']);
  },

  getGCCInfo: () => {
    utils.log('trace', 'getGCCInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('gcc -v 2>&1').then(utils.findVersion),
        utils.run('which gcc'),
      ]).then(v => utils.determineFound('GCC', v[0], v[1]));
    }
    return Promise.resolve(['GCC', 'N/A']);
  },

  getGitInfo: () => {
    utils.log('trace', 'getGitInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('git --version').then(utils.findVersion),
        utils.run('which git'),
      ]).then(v => utils.determineFound('Git', v[0], v[1]));
    }
    return Promise.resolve(['Git', 'N/A']);
  },

  getMakeInfo: () => {
    utils.log('trace', 'getMakeInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('make --version').then(utils.findVersion),
        utils.run('which make'),
      ]).then(v => utils.determineFound('Make', v[0], v[1]));
    }
    return Promise.resolve(['Make', 'N/A']);
  },
};
