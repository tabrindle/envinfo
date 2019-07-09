const utils = require('../utils');

module.exports = {
  getAptInfo: () => {
    utils.log('trace', 'getAptInfo');
    if (utils.isLinux)
      return Promise.all([
        utils.run('apt --version').then(utils.findVersion),
        utils.which('apt'),
      ]).then(v => utils.determineFound('Apt', v[0], v[1]));
    return Promise.all(['Apt', 'N/A']);
  },

  getCargoInfo: () => {
    utils.log('trace', 'getCargoInfo');
    return Promise.all([
      utils.run('cargo --version').then(utils.findVersion),
      utils.which('cargo').then(utils.condensePath),
    ]).then(v => utils.determineFound('Cargo', v[0], v[1]));
  },

  getCocoaPodsInfo: () => {
    utils.log('trace', 'getCocoaPodsInfo');
    if (utils.isMacOS)
      return Promise.all([
        utils.run('pod --version').then(utils.findVersion),
        utils.which('pod'),
      ]).then(v => utils.determineFound('CocoaPods', v[0], v[1]));
    return Promise.all(['CocoaPods', 'N/A']);
  },

  getComposerInfo: () => {
    utils.log('trace', 'getComposerInfo');
    return Promise.all([
      utils.run('composer --version').then(utils.findVersion),
      utils.which('composer').then(utils.condensePath),
    ]).then(v => utils.determineFound('Composer', v[0], v[1]));
  },

  getGradleInfo: () => {
    utils.log('trace', 'getGradleInfo');
    return Promise.all([
      utils.run('gradle --version').then(utils.findVersion),
      utils.which('gradle').then(utils.condensePath),
    ]).then(v => utils.determineFound('Gradle', v[0], v[1]));
  },

  getHomebrewInfo: () => {
    utils.log('trace', 'getHomebrewInfo');
    if (utils.isMacOS)
      return Promise.all([
        utils.run('brew --version').then(utils.findVersion),
        utils.which('brew'),
      ]).then(v => utils.determineFound('Homebrew', v[0], v[1]));
    return Promise.all(['Homebrew', 'N/A']);
  },

  getMavenInfo: () => {
    utils.log('trace', 'getMavenInfo');
    return Promise.all([
      utils.run('mvn --version').then(utils.findVersion),
      utils.which('mvn').then(utils.condensePath),
    ]).then(v => utils.determineFound('Maven', v[0], v[1]));
  },

  getpip2Info: () => {
    utils.log('trace', 'getpip2Info');
    return Promise.all([
      utils.run('pip2 --version').then(utils.findVersion),
      utils.which('pip2').then(utils.condensePath),
    ]).then(v => utils.determineFound('pip2', v[0], v[1]));
  },

  getpip3Info: () => {
    utils.log('trace', 'getpip3Info');
    return Promise.all([
      utils.run('pip3 --version').then(utils.findVersion),
      utils.which('pip3').then(utils.condensePath),
    ]).then(v => utils.determineFound('pip3', v[0], v[1]));
  },

  getRubyGemsInfo: () => {
    utils.log('trace', 'getRubyGemsInfo');
    return Promise.all([
      utils.run('gem --version').then(utils.findVersion),
      utils.which('gem'),
    ]).then(v => utils.determineFound('RubyGems', v[0], v[1]));
  },

  getYumInfo: () => {
    utils.log('trace', 'getYumInfo');
    if (utils.isLinux)
      return Promise.all([
        utils.run('yum --version').then(utils.findVersion),
        utils.which('yum'),
      ]).then(v => utils.determineFound('Yum', v[0], v[1]));
    return Promise.all(['Yum', 'N/A']);
  },
};
