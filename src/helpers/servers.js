const utils = require('../utils');

module.exports = {
  getApacheInfo: () => {
    utils.log('trace', 'getApacheInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('apachectl -v').then(utils.findVersion),
        utils.run('which apachectl'),
      ]).then(v => utils.determineFound('Apache', v[0], v[1]));
    }
    return Promise.resolve(['Apache', 'N/A']);
  },

  getNginxInfo: () => {
    utils.log('trace', 'getNginxInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('nginx -v 2>&1').then(utils.findVersion),
        utils.run('which nginx'),
      ]).then(v => utils.determineFound('Nginx', v[0], v[1]));
    }
    return Promise.resolve(['Nginx', 'N/A']);
  },
};
