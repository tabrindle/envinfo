const utils = require('../utils');

module.exports = {
  getBazelInfo: () => {
    utils.log('trace', 'getBazelInfo');
    return Promise.all([
      utils.run('bazel --version').then(utils.findVersion),
      utils.which('bazel'),
    ]).then(v => utils.determineFound('Bazel', v[0], v[1]));
  },

  getCMakeInfo: () => {
    utils.log('trace', 'getCMakeInfo');
    return Promise.all([
      utils.run('cmake --version').then(utils.findVersion),
      utils.which('cmake'),
    ]).then(v => utils.determineFound('CMake', v[0], v[1]));
  },

  getGCCInfo: () => {
    utils.log('trace', 'getGCCInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('gcc -v 2>&1').then(utils.findVersion),
        utils.which('gcc'),
      ]).then(v => utils.determineFound('GCC', v[0], v[1]));
    }
    return Promise.resolve(['GCC', 'N/A']);
  },

  getClangInfo: () => {
    utils.log('trace', 'getClangInfo');
    return Promise.all([
      utils.run('clang --version').then(utils.findVersion),
      utils.which('clang'),
    ]).then(v => utils.determineFound('Clang', v[0], v[1]));
  },

  getGitInfo: () => {
    utils.log('trace', 'getGitInfo');
    return Promise.all([
      utils.run('git --version').then(utils.findVersion),
      utils.which('git'),
    ]).then(v => utils.determineFound('Git', v[0], v[1]));
  },

  getMakeInfo: () => {
    utils.log('trace', 'getMakeInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('make --version').then(utils.findVersion),
        utils.which('make'),
      ]).then(v => utils.determineFound('Make', v[0], v[1]));
    }
    return Promise.resolve(['Make', 'N/A']);
  },

  getNinjaInfo: () => {
    utils.log('trace', 'getNinjaInfo');
    return Promise.all([
      utils.run('ninja --version').then(utils.findVersion),
      utils.which('ninja'),
    ]).then(v => utils.determineFound('Ninja', v[0], v[1]));
  },

  getMercurialInfo: () => {
    utils.log('trace', 'getMercurialInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('hg --version').then(utils.findVersion),
        utils.which('hg'),
      ]).then(v => utils.determineFound('Mercurial', v[0], v[1]));
    }
    return Promise.resolve(['Mercurial', 'N/A']);
  },

  getSubversionInfo: () => {
    utils.log('trace', 'getSubversionInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('svn --version').then(utils.findVersion),
        utils.which('svn'),
      ]).then(v => utils.determineFound('Subversion', v[0], v[1]));
    }
    return Promise.resolve(['Subversion', 'N/A']);
  },

  getFFmpegInfo: () => {
    utils.log('trace', 'getFFmpegInfo');
    return Promise.all([
      utils.run('ffmpeg -version').then(utils.findVersion),
      utils.which('ffmpeg'),
    ]).then(v => utils.determineFound('FFmpeg', v[0], v[1]));
  },

  getCurlInfo: () => {
    utils.log('trace', 'getCurlInfo');
    return Promise.all([
      utils.run('curl --version').then(utils.findVersion),
      utils.which('curl'),
    ]).then(v => utils.determineFound('Curl', v[0], v[1]));
  },

  getOpenSSLInfo: () => {
    utils.log('trace', 'getOpenSSLInfo');
    return Promise.all([
      utils.run('openssl version').then(utils.findVersion),
      utils.which('openssl'),
    ]).then(v => utils.determineFound('OpenSSL', v[0], v[1]));
  },

  getccacheInfo: () => {
    utils.log('trace', 'getccacheInfo');
    return Promise.all([
      utils.run('ccache -V').then(utils.findVersion),
      utils.which('ccache'),
    ]).then(v => utils.determineFound('ccache', v[0], v[1]));
  },
};
