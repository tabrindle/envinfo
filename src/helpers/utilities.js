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

  getGitLFSInfo: () => {
    utils.log('trace', 'getGitLFSInfo');
    return Promise.all([
      utils.run('git lfs version').then(utils.findVersion),
      utils.which('git-lfs'),
    ]).then(v => utils.determineFound('Git LFS', v[0], v[1]));
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

  get7zInfo: () => {
    utils.log('trace', 'get7zInfo');
    const candidates = ['7z', '7zz'];

    const findFirstWhich = () =>
      Promise.all(candidates.map(bin => utils.which(bin))).then(paths => {
        const idx = paths.findIndex(Boolean);
        return idx >= 0 ? { bin: candidates[idx], path: paths[idx] } : null;
      });

    if (utils.isWindows) {
      // Try default install location first
      return utils.windowsExeExists('7-Zip/7z.exe').then(filePath => {
        if (filePath) {
          return Promise.all([
            utils.run(`powershell "& '${filePath}' i | Write-Output"`).then(utils.findVersion),
            Promise.resolve(filePath),
          ]).then(v => utils.determineFound('7z', v[0], v[1]));
        }
        // Fallback to PATH candidates
        return findFirstWhich().then(found => {
          if (!found) return utils.determineFound('7z', '', undefined);
          return Promise.all([
            utils.run(`${found.bin} i`).then(utils.findVersion),
            Promise.resolve(found.path),
          ]).then(v => utils.determineFound('7z', v[0], v[1]));
        });
      });
    }

    // macOS/Linux: find on PATH among common names
    return findFirstWhich().then(found => {
      if (!found) return utils.determineFound('7z', '', undefined);
      return Promise.all([
        utils.run(`${found.bin} i`).then(utils.findVersion),
        Promise.resolve(found.path),
      ]).then(v => utils.determineFound('7z', v[0], v[1]));
    });
  },

  getClashMetaInfo: () => {
    utils.log('trace', 'getClashMetaInfo');
    const candidates = ['mihomo'];

    const findFirstWhich = () =>
      Promise.all(candidates.map(bin => utils.which(bin))).then(paths => {
        const idx = paths.findIndex(Boolean);
        return idx >= 0 ? { bin: candidates[idx], path: paths[idx] } : null;
      });

    return findFirstWhich().then(found => {
      if (!found) return utils.determineFound('Clash Meta', '', undefined);
      return Promise.all([
        utils.run(`${found.bin} -v`).then(utils.findVersion),
        Promise.resolve(found.path),
      ]).then(v => utils.determineFound('Clash Meta', v[0], v[1]));
    });
  },

  getCalibreInfo: () => {
    utils.log('trace', 'getCalibreInfo');
    return Promise.all([
      utils.run('ebook-convert --version').then(utils.findVersion),
      utils.which('calibre'),
    ]).then(v => utils.determineFound('Calibre', v[0], v[1]));
  },
};
