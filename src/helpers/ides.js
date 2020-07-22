const path = require('path');
const utils = require('../utils');

module.exports = {
  getAndroidStudioInfo: () => {
    let androidStudioVersion = Promise.resolve('N/A');
    if (utils.isMacOS) {
      androidStudioVersion = utils
        .run(
          utils.generatePlistBuddyCommand(
            path.join('/', 'Applications', 'Android\\ Studio.app', 'Contents', 'Info.plist'),
            ['CFBundleShortVersionString', 'CFBundleVersion']
          )
        )
        .then(version => {
          if (!version) {
            return utils.run(
              utils.generatePlistBuddyCommand(
                path.join(
                  '~',
                  'Applications',
                  'JetBrains\\ Toolbox',
                  'Android\\ Studio.app',
                  'Contents',
                  'Info.plist'
                ),
                ['CFBundleShortVersionString', 'CFBundleVersion']
              )
            );
          }
          return version;
        })
        .then(version => version.split('\n').join(' '));
    } else if (utils.isLinux) {
      androidStudioVersion = Promise.all([
        utils
          .run('cat /opt/android-studio/bin/studio.sh | grep "$Home/.AndroidStudio" | head -1')
          .then(utils.findVersion),
        utils.run('cat /opt/android-studio/build.txt'),
      ]).then(tasks => {
        const linuxVersion = tasks[0];
        const linuxBuildNumber = tasks[1];
        return `${linuxVersion} ${linuxBuildNumber}`.trim() || utils.NotFound;
      });
    } else if (utils.isWindows) {
      androidStudioVersion = Promise.all([
        utils
          .run(
            'wmic datafile where name="C:\\\\Program Files\\\\Android\\\\Android Studio\\\\bin\\\\studio.exe" get Version'
          )
          .then(version => version.replace(/(\r\n|\n|\r)/gm, '')),
        utils
          .run('type "C:\\\\Program Files\\\\Android\\\\Android Studio\\\\build.txt"')
          .then(version => version.replace(/(\r\n|\n|\r)/gm, '')),
      ]).then(tasks => {
        const windowsVersion = tasks[0];
        const windowsBuildNumber = tasks[1];
        return `${windowsVersion} ${windowsBuildNumber}`.trim() || utils.NotFound;
      });
    }
    return androidStudioVersion.then(v => utils.determineFound('Android Studio', v));
  },

  getAtomInfo: () => {
    utils.log('trace', 'getAtomInfo');
    return Promise.all([
      utils.getDarwinApplicationVersion(utils.ideBundleIdentifiers.Atom),
      'N/A',
    ]).then(v => utils.determineFound('Atom', v[0], v[1]));
  },

  getEmacsInfo: () => {
    utils.log('trace', 'getEmacsInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('emacs --version').then(utils.findVersion),
        utils.run('which emacs'),
      ]).then(v => utils.determineFound('Emacs', v[0], v[1]));
    }
    return Promise.resolve(['Emacs', 'N/A']);
  },

  getIntelliJInfo: () => {
    utils.log('trace', 'getIntelliJInfo');
    return utils
      .getDarwinApplicationVersion(utils.ideBundleIdentifiers.IntelliJ)
      .then(v => utils.determineFound('IntelliJ', v));
  },

  getNanoInfo: () => {
    utils.log('trace', 'getNanoInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('nano --version').then(utils.findVersion),
        utils.run('which nano'),
      ]).then(v => utils.determineFound('Nano', v[0], v[1]));
    }
    return Promise.resolve(['Nano', 'N/A']);
  },

  getNvimInfo: () => {
    utils.log('trace', 'getNvimInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('nvim --version').then(utils.findVersion),
        utils.run('which nvim'),
      ]).then(v => utils.determineFound('Nvim', v[0], v[1]));
    }
    return Promise.resolve(['Vim', 'N/A']);
  },

  getPhpStormInfo: () => {
    utils.log('trace', 'getPhpStormInfo');
    return utils
      .getDarwinApplicationVersion(utils.ideBundleIdentifiers.PhpStorm)
      .then(v => utils.determineFound('PhpStorm', v));
  },

  getSublimeTextInfo: () => {
    utils.log('trace', 'getSublimeTextInfo');
    return Promise.all([
      utils.run('subl --version').then(version => utils.findVersion(version, /\d+/)),
      utils.which('subl'),
    ])
      .then(v => {
        if (v[0] === '' && utils.isMacOS) {
          utils.log('trace', 'getSublimeTextInfo using plist');
          return Promise.all([
            utils.getDarwinApplicationVersion(utils.ideBundleIdentifiers['Sublime Text']),
            'N/A',
          ]);
        }
        return v;
      })
      .then(v => utils.determineFound('Sublime Text', v[0], v[1]));
  },

  getVimInfo: () => {
    utils.log('trace', 'getVimInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('vim --version').then(utils.findVersion),
        utils.run('which vim'),
      ]).then(v => utils.determineFound('Vim', v[0], v[1]));
    }
    return Promise.resolve(['Vim', 'N/A']);
  },

  getVSCodeInfo: () => {
    utils.log('trace', 'getVSCodeInfo');
    return Promise.all([
      utils.run('code --version').then(utils.findVersion),
      utils.which('code'),
    ]).then(v => utils.determineFound('VSCode', v[0], v[1]));
  },

  getVisualStudioInfo: () => {
    utils.log('trace', 'getVisualStudioInfo');
    if (utils.isWindows) {
      return utils
        .run(
          `"${process.env['ProgramFiles(x86)']}/Microsoft Visual Studio/Installer/vswhere.exe" -format json -prerelease`
        )
        .then(jsonText => {
          const instances = JSON.parse(jsonText).map(vsInstance => {
            return {
              Version: vsInstance.installationVersion,
              DisplayName: vsInstance.displayName,
            };
          });
          return utils.determineFound(
            'Visual Studio',
            instances.map(v => `${v.Version} (${v.DisplayName})`)
          );
        })
        .catch(() => {
          return Promise.resolve(['Visual Studio', utils.NotFound]);
        });
    }
    return Promise.resolve(['Visual Studio', utils.NA]);
  },

  getWebStormInfo: () => {
    utils.log('trace', 'getWebStormInfo');
    return utils
      .getDarwinApplicationVersion(utils.ideBundleIdentifiers.WebStorm)
      .then(v => utils.determineFound('WebStorm', v));
  },

  getXcodeInfo: () => {
    utils.log('trace', 'getXcodeInfo');
    if (utils.isMacOS) {
      return Promise.all([
        utils
          .which('xcodebuild')
          .then(xcodePath => utils.run(xcodePath + ' -version'))
          .then(version => `${utils.findVersion(version)}/${version.split('Build version ')[1]}`),
        utils.which('xcodebuild'),
      ]).then(v => utils.determineFound('Xcode', v[0], v[1]));
    }
    return Promise.resolve(['Xcode', 'N/A']);
  },
};
