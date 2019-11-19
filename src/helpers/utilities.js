const utils = require('../utils');

module.exports = {
  getCMakeInfo: () => {
    utils.log('trace', 'getCMakeInfo');
    return Promise.all([
      utils.run('cmake --version').then(utils.findVersion),
      utils.run('which cmake'),
    ]).then(v => utils.determineFound('CMake', v[0], v[1]));
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

  getClangInfo: () => {
    utils.log('trace', 'getClangInfo');
    return Promise.all([
      utils.run('clang --version').then(v => {
        if (utils.isMacOS) {
          return (v.match(/clang-(.*)\)/) || [])[1];
        }

        return (v.match(/([0-9].*) /) || [])[1];
      }),
      utils.which('clang'),
    ]).then(v => utils.determineFound('Clang', v[0], v[1]));
  },

  getGitInfo: () => {
    utils.log('trace', 'getGitInfo');
    return Promise.all([
      utils.run('git --version').then(utils.findVersion),
      utils.run('which git'),
    ]).then(v => utils.determineFound('Git', v[0], v[1]));
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

  getMercurialInfo: () => {
    utils.log('trace', 'getMercurialInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('hg --version').then(utils.findVersion),
        utils.run('which hg'),
      ]).then(v => utils.determineFound('Mercurial', v[0], v[1]));
    }
    return Promise.resolve(['Mercurial', 'N/A']);
  },

  getSubversionInfo: () => {
    utils.log('trace', 'getSubversionInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('svn --version').then(utils.findVersion),
        utils.run('which svn'),
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
};
