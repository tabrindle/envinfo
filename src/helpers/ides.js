const path = require('path');
const utils = require('../utils');

module.exports = {
  getAndroidStudioInfo: () => {
    let androidStudioVersion = Promise.resolve('N/A');
    if (utils.isMacOS) {
      const paths = [
        path.join('/', 'Applications', 'Android Studio.app', 'Contents', 'Info.plist'),
        path.join(process.env.HOME, 'Applications', 'Android Studio.app', 'Contents', 'Info.plist'),
        path.join(
          '/',
          'Applications',
          'JetBrains Toolbox',
          'Android Studio.app',
          'Contents',
          'Info.plist'
        ),
        path.join(
          process.env.HOME,
          'Applications',
          'JetBrains Toolbox',
          'Android Studio.app',
          'Contents',
          'Info.plist'
        ),
      ];
      androidStudioVersion = Promise.all(
        paths.map(p => {
          return utils.fileExists(p).then(exists => {
            if (!exists) {
              return null;
            }
            const command = utils.generatePlistBuddyCommand(p.replace(/ /g, '\\ '), [
              'CFBundleShortVersionString',
              'CFBundleVersion',
            ]);
            return utils.run(command).then(version => {
              return version.split('\n').join(' ');
            });
          });
        })
      ).then(versions => {
        return versions.find(version => version !== null) || utils.NotFound;
      });
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
        utils.which('emacs'),
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
    if (utils.isLinux) {
      return Promise.all([
        utils.run('nano --version').then(utils.findVersion),
        utils.which('nano'),
      ]).then(v => utils.determineFound('Nano', v[0], v[1]));
    }
    return Promise.resolve(['Nano', 'N/A']);
  },

  getNvimInfo: () => {
    utils.log('trace', 'getNvimInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('nvim --version').then(utils.findVersion),
        utils.which('nvim'),
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
        utils.which('vim'),
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

  getCursorInfo: () => {
    utils.log('trace', 'getCursorInfo');
    return Promise.all([
      utils.run('cursor --version').then(utils.findVersion),
      utils.which('cursor'),
    ]).then(v => utils.determineFound('Cursor', v[0], v[1]));
  },

  getClaudeCodeInfo: () => {
    utils.log('trace', 'getClaudeCodeInfo');
    return Promise.all([
      utils.run('claude --version').then(utils.findVersion),
      utils.which('claude'),
    ]).then(v => utils.determineFound('Claude Code', v[0], v[1]));
  },

  getopencodeInfo: () => {
    utils.log('trace', 'getopencodeInfo');
    return Promise.all([
      utils.run('opencode --version').then(utils.findVersion),
      utils.which('opencode'),
    ]).then(v => utils.determineFound('opencode', v[0], v[1]));
  },

  getCodexInfo: () => {
    utils.log('trace', 'getCodexInfo');
    return Promise.all([
      utils.run('codex --version').then(utils.findVersion),
      utils.which('codex'),
    ]).then(v => utils.determineFound('Codex', v[0], v[1]));
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
