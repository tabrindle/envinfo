const os = require('os');
const osName = require('os-name');
const path = require('path');
const packages = require('./packages');
const utils = require('./utils');

const NA = 'N/A';
const NotFound = 'Not Found';
const macos = process.platform === 'darwin';
const linux = process.platform === 'linux';
const windows = process.platform.startsWith('win');

module.exports = Object.assign({}, utils, packages, {
  getiOSSDKInfo: () => {
    if (macos) {
      return utils
        .run('xcodebuild -showsdks')
        .then(sdks => sdks.match(/[\w]+\s[\d|.]+/g))
        .then(utils.uniq)
        .then(
          platforms =>
            platforms.length ? ['iOS SDK', { Platforms: platforms }] : ['iOS SDK', NotFound]
        );
    }
    return Promise.resolve(['iOS SDK', NA]);
  },

  getAndroidSDKInfo: () => {
    var buildTools = [];
    var androidAPIs = [];
    return utils
      .run(
        process.env.ANDROID_HOME ? '$ANDROID_HOME/tools/bin/sdkmanager --list' : 'sdkmanager --list'
      )
      .then(output => {
        const installed = output.split('Available')[0];
        const getBuildVersions = /build-tools;([\d|.]+)[\S\s]/g;
        const getAPIVersions = /platforms;android-(\d+)[\S\s]/g;
        let matcher;
        // eslint-disable-next-line
        while ((matcher = getBuildVersions.exec(installed))) {
          buildTools.push(matcher[1]);
        }
        // eslint-disable-next-line
        while ((matcher = getAPIVersions.exec(installed))) {
          androidAPIs.push(matcher[1]);
        }
        if (buildTools.length || androidAPIs.length)
          return Promise.resolve([
            'Android SDK',
            {
              'Build Tools': buildTools || NotFound,
              'API Levels': androidAPIs || NotFound,
            },
          ]);
        return Promise.resolve(['Android SDK', NotFound]);
      });
  },

  getAndroidStudioInfo: () => {
    let androidStudioVersion;
    if (macos) {
      androidStudioVersion = utils
        .run(
          utils.generatePlistBuddyCommand(
            path.join('/', 'Applications', 'Android\\ Studio.app', 'Contents', 'Info.plist'),
            ['CFBundleShortVersionString', 'CFBundleVersion']
          )
        )
        .then(version => version.split('\n').join(' '));
    } else if (linux) {
      androidStudioVersion = Promise.all([
        utils
          .run('cat /opt/android-studio/bin/studio.sh | grep "$Home/.AndroidStudio" | head -1')
          .then(utils.findVersion),
        utils.run('cat /opt/android-studio/build.txt'),
      ]).then(tasks => {
        const linuxVersion = tasks[0];
        const linuxBuildNumber = tasks[1];
        return `${linuxVersion} ${linuxBuildNumber}`.trim() || NotFound;
      });
    } else if (windows) {
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
        return `${windowsVersion} ${windowsBuildNumber}`.trim() || NotFound;
      });
    }
    return androidStudioVersion.then(v => utils.determineFound('Android Studio', v));
  },

  getAtomInfo: () => {
    utils.log('trace', 'getAtomInfo');
    return Promise.all([
      utils.getDarwinApplicationVersion(utils.ideBundleIdentifiers.Atom),
      NA,
    ]).then(v => utils.determineFound('Atom', v[0], v[1]));
  },

  getMySQLInfo: () => {
    utils.log('trace', 'getMySQLInfo');
    return Promise.all([
      utils
        .run('mysql --version')
        .then(v => `${utils.findVersion(v, null, 1)}${v.includes('MariaDB') ? ' (MariaDB)' : ''}`),
      utils.which('mysql'),
    ]).then(v => utils.determineFound('MySQL', v[0], v[1]));
  },

  getMongoDBInfo: () => {
    utils.log('trace', 'getMongoDBInfo');
    return Promise.all([
      utils.run('mongo --version').then(utils.findVersion),
      utils.which('mongo'),
    ]).then(v => utils.determineFound('MongoDB', v[0], v[1]));
  },

  getSQLiteInfo: () => {
    utils.log('trace', 'getSQLiteInfo');
    return Promise.all([
      utils.run('sqlite3 --version').then(utils.findVersion),
      utils.which('sqlite3'),
    ]).then(v => utils.determineFound('SQLite', v[0], v[1]));
  },

  getPostgreSQLInfo: () => {
    utils.log('trace', 'getPostgreSQLInfo');
    return Promise.all([
      utils.run('postgres --version').then(utils.findVersion),
      utils.which('postgres'),
    ]).then(v => utils.determineFound('PostgreSQL', v[0], v[1]));
  },

  getCPUInfo: () => {
    utils.log('trace', 'getCPUInfo');
    let info;
    try {
      info = os.arch() + ' ' + os.cpus()[0].model;
    } catch (err) {
      info = 'Unknown';
    }
    return Promise.all(['CPU', info]);
  },

  getBashInfo: () => {
    utils.log('trace', 'getBashInfo');
    return Promise.all([
      utils.run('bash --version').then(utils.findVersion),
      utils.which('bash'),
    ]).then(v => utils.determineFound('Bash', v[0], v[1]));
  },

  getPHPInfo: () => {
    utils.log('trace', 'getPHPInfo');
    return Promise.all([utils.run('php -v').then(utils.findVersion), utils.which('php')]).then(v =>
      utils.determineFound('PHP', v[0], v[1])
    );
  },

  getParallelsInfo: () => {
    utils.log('trace', 'getParallelsInfo');
    return Promise.all([
      utils.run('prlctl --version').then(utils.findVersion),
      utils.which('prlctl'),
    ]).then(v => utils.determineFound('Parallels', v[0], v[1]));
  },

  getDockerInfo: () => {
    utils.log('trace', 'getDockerInfo');
    return Promise.all([
      utils.run('docker --version').then(utils.findVersion),
      utils.which('docker'),
    ]).then(v => utils.determineFound('Docker', v[0], v[1]));
  },

  getElixirInfo: () => {
    utils.log('trace', 'getElixirInfo');
    return Promise.all([
      utils
        .run('elixir --version')
        .then(v => utils.findVersion(v, /[Elixir]+\s([\d+.[\d+|.]+)/, 1)),
      utils.which('elixir'),
    ]).then(v => Promise.resolve(utils.determineFound('Elixir', v[0], v[1])));
  },

  getMemoryInfo: () => {
    utils.log('trace', 'getMemoryInfo');
    return Promise.all([
      'Memory',
      `${utils.toReadableBytes(os.freemem())} / ${utils.toReadableBytes(os.totalmem())}`,
    ]);
  },

  getSublimeTextInfo: () => {
    utils.log('trace', 'getSublimeTextInfo');
    return Promise.all([
      utils.run('subl --version').then(version => utils.findVersion(version, /\d+/)),
      utils.which('subl'),
    ])
      .then(v => {
        if (v[0] === '' && macos) {
          utils.log('trace', 'getSublimeTextInfo using plist');
          return Promise.all([
            utils.getDarwinApplicationVersion(utils.ideBundleIdentifiers['Sublime Text']),
            NA,
          ]);
        }
        return v;
      })
      .then(v => utils.determineFound('Sublime Text', v[0], v[1]));
  },

  getHomeBrewInfo: () => {
    utils.log('trace', 'getHomeBrewInfo');
    var homeBrewVersion;
    if (macos) {
      homeBrewVersion = Promise.all([
        'Homebrew',
        utils.run('brew --version').then(utils.findVersion),
        utils.which('brew'),
      ]);
    } else homeBrewVersion = Promise.all(['Homebrew', NA]);
    return homeBrewVersion;
  },

  getGoInfo: () => {
    utils.log('trace', 'getGoInfo');
    return Promise.all([utils.run('go version').then(utils.findVersion), utils.which('go')]).then(
      v => utils.determineFound('Go', v[0], v[1])
    );
  },

  getRubyInfo: () => {
    utils.log('trace', 'getRubyInfo');
    return Promise.all([utils.run('ruby -v').then(utils.findVersion), utils.which('ruby')]).then(
      v => utils.determineFound('Ruby', v[0], v[1])
    );
  },

  getNodeInfo: () => {
    utils.log('trace', 'getNodeInfo');
    return Promise.all([
      utils
        .which('node')
        .then(nodePath => (nodePath ? utils.run(nodePath + ' -v') : Promise.resolve('')))
        .then(v => v.replace('v', '')),
      utils.which('node').then(utils.condensePath),
    ]).then(v => utils.determineFound('Node', v[0], v[1]));
  },

  getnpmInfo: () => {
    utils.log('trace', 'getnpmInfo');
    return Promise.all([utils.run('npm -v'), utils.which('npm').then(utils.condensePath)]).then(v =>
      utils.determineFound('npm', v[0], v[1])
    );
  },

  getShellInfo: () => {
    utils.log('trace', 'getShellInfo', process.env);
    if (macos || linux) {
      const shell =
        process.env.SHELL || utils.runSync('getent passwd $LOGNAME | cut -d: -f7 | head -1');
      return Promise.all([
        utils.run(`${shell} --version`).then(utils.findVersion),
        utils.which(shell),
      ]).then(v => utils.determineFound('Shell', v[0] || 'Unknown', v[1]));
    }
    return Promise.resolve(['Shell', NA]);
  },

  getOSInfo: () => {
    utils.log('trace', 'getOSInfo');
    let version;
    if (macos) {
      version = utils.run('sw_vers -productVersion ');
    } else if (linux) {
      version = utils.run('cat /etc/os-release').then(v => {
        const distro = (v || '').match(/NAME="(.+)"/);
        const versionInfo = (v || '').match(/VERSION="(.+)"/);
        return `${distro[1]} ${versionInfo[1]}`.trim() || '';
      });
    } else {
      version = Promise.resolve();
    }
    return version.then(v => {
      let info = osName(os.platform(), os.release());
      if (v) info += ` ${v}`;
      return ['OS', info];
    });
  },

  getContainerInfo: () => {
    utils.log('trace', 'getContainerInfo');
    if (linux)
      return Promise.all([utils.fileExists('/.dockerenv'), utils.readFile('/proc/self/cgroup')])
        .then(results => {
          utils.log('trace', 'getContainerInfoThen', results);
          return Promise.resolve(['Container', results[0] || results[1] ? 'Yes' : NA]);
        })
        .catch(err => utils.log('trace', 'getContainerInfoCatch', err));
    return Promise.resolve(['Container', NA]);
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

  getVSCodeInfo: () => {
    utils.log('trace', 'getVSCodeInfo');
    return Promise.all([
      utils.run('code --version').then(utils.findVersion),
      utils.which('code'),
    ]).then(v => utils.determineFound('VSCode', v[0], v[1]));
  },

  getIntelliJInfo: () => {
    utils.log('trace', 'getIntelliJInfo');
    return utils
      .getDarwinApplicationVersion(utils.ideBundleIdentifiers.IntelliJ)
      .then(v => utils.determineFound('IntelliJ', v));
  },

  getPhpStormInfo: () => {
    utils.log('trace', 'getPhpStormInfo');
    return utils
      .getDarwinApplicationVersion(utils.ideBundleIdentifiers.PhpStorm)
      .then(v => utils.determineFound('PhpStorm', v));
  },

  getWebStormInfo: () => {
    utils.log('trace', 'getWebStormInfo');
    return utils
      .getDarwinApplicationVersion(utils.ideBundleIdentifiers.WebStorm)
      .then(v => utils.determineFound('WebStorm', v));
  },

  getVirtualBoxInfo: () => {
    utils.log('trace', 'getVirtualBoxInfo');
    return Promise.all([
      utils.run('vboxmanage --version').then(utils.findVersion),
      utils.which('vboxmanage'),
    ]).then(v => utils.determineFound('VirtualBox', v[0], v[1]));
  },

  getVMwareFusionInfo: () => {
    utils.log('trace', 'getVMwareFusionInfo');
    return utils
      .getDarwinApplicationVersion('com.vmware.fusion')
      .then(v => utils.determineFound('VMWare Fusion', v, NA));
  },

  getPythonInfo: () => {
    utils.log('trace', 'getPythonInfo');
    return Promise.all([
      utils.run('python -V 2>&1').then(utils.findVersion),
      utils.run('which python'),
    ]).then(v => utils.determineFound('Python', v[0], v[1]));
  },

  getXcodeInfo: () => {
    utils.log('trace', 'getXcodeInfo');
    if (macos) {
      return Promise.all([
        utils
          .which('xcodebuild')
          .then(xcodePath => utils.run(xcodePath + ' -version'))
          .then(version => `${utils.findVersion(version)}/${version.split('Build version ')[1]}`),
        utils.which('xcodebuild'),
      ]).then(v => utils.determineFound('Xcode', v[0], v[1]));
    }
    return Promise.resolve(['Xcode', NA]);
  },

  getYarnInfo: () => {
    utils.log('trace', 'getYarnInfo');
    return Promise.all([utils.run('yarn -v'), utils.which('yarn').then(utils.condensePath)]).then(
      v => utils.determineFound('Yarn', v[0], v[1])
    );
  },

  getEdgeInfo: () => {
    utils.log('trace', 'getEdgeInfo');
    let edgeVersion;
    if (windows && os.release().split('.')[0] === '10') {
      edgeVersion = utils
        .run('powershell get-appxpackage Microsoft.MicrosoftEdge')
        .then(utils.findVersion);
    } else {
      edgeVersion = Promise.resolve(NA);
    }
    return edgeVersion.then(v => utils.determineFound('Edge', v, NA));
  },

  getInternetExplorerInfo: () => {
    utils.log('trace', 'getInternetExplorerInfo');
    let explorerVersion;
    if (windows) {
      const explorerPath = [
        process.env.SYSTEMDRIVE || 'C:',
        'Program Files',
        'Internet Explorer',
        'iexplore.exe',
      ].join('\\\\');
      explorerVersion = utils
        .run(`wmic datafile where "name='${explorerPath}'" get Version`)
        .then(utils.findVersion);
    } else {
      explorerVersion = Promise.resolve(NA);
    }
    return explorerVersion.then(v => utils.determineFound('Internet Explorer', v, NA));
  },

  getChromeInfo: () => {
    utils.log('trace', 'getChromeInfo');
    let chromeVersion;
    if (linux) {
      chromeVersion = utils
        .run('google-chrome --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (macos) {
      chromeVersion = utils
        .getDarwinApplicationVersion(utils.browserBundleIdentifiers.Chrome)
        .then(utils.findVersion);
    } else {
      chromeVersion = Promise.resolve(NA);
    }
    return chromeVersion.then(v => utils.determineFound('Chrome', v, NA));
  },

  getChromeCanaryInfo: () => {
    utils.log('trace', 'getChromeCanaryInfo');
    const chromeCanaryVersion = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Chrome Canary']
    );
    return chromeCanaryVersion.then(v => utils.determineFound('Chrome Canary', v, NA));
  },

  getFirefoxDeveloperEditionInfo: () => {
    utils.log('trace', 'getFirefoxDeveloperEditionInfo');
    const firefoxDeveloperEdition = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Firefox Developer Edition']
    );
    return firefoxDeveloperEdition.then(v =>
      utils.determineFound('Firefox Developer Edition', v, NA)
    );
  },

  getSafariTechnologyPreviewInfo: () => {
    utils.log('trace', 'getSafariTechnologyPreviewInfo');
    const safariTechnologyPreview = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Safari Technology Preview']
    );
    return safariTechnologyPreview.then(v =>
      utils.determineFound('Safari Technology Preview', v, NA)
    );
  },

  getSafariInfo: () => {
    utils.log('trace', 'getSafariInfo');
    const safariVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Safari);
    return safariVersion.then(v => utils.determineFound('Safari', v, NA));
  },

  getFirefoxInfo: () => {
    utils.log('trace', 'getFirefoxInfo');
    let firefoxVersion;
    if (linux) {
      firefoxVersion = utils.run('firefox --version').then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (macos) {
      firefoxVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Firefox);
    } else {
      firefoxVersion = Promise.resolve(NA);
    }
    return firefoxVersion.then(v => utils.determineFound('Firefox', v, NA));
  },

  getFirefoxNightlyInfo: () => {
    utils.log('trace', 'getFirefoxNightlyInfo');
    let firefoxNightlyVersion;
    if (linux) {
      firefoxNightlyVersion = utils
        .run('firefox-trunk --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (macos) {
      firefoxNightlyVersion = utils.getDarwinApplicationVersion(
        utils.browserBundleIdentifiers['Firefox Nightly']
      );
    } else {
      firefoxNightlyVersion = Promise.resolve(NA);
    }

    return firefoxNightlyVersion.then(v => utils.determineFound('Firefox Nightly', v, NA));
  },

  getGitInfo: () => {
    utils.log('trace', 'getGitInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('git --version').then(utils.findVersion),
        utils.run('which git'),
      ]).then(v => utils.determineFound('Git', v[0], v[1]));
    }
    return Promise.resolve(['Git', NA]);
  },

  getMakeInfo: () => {
    utils.log('trace', 'getMakeInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('make --version').then(utils.findVersion),
        utils.run('which make'),
      ]).then(v => utils.determineFound('Make', v[0], v[1]));
    }
    return Promise.resolve(['Make', NA]);
  },

  getCMakeInfo: () => {
    utils.log('trace', 'getCMakeInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('cmake --version').then(utils.findVersion),
        utils.run('which cmake'),
      ]).then(v => utils.determineFound('CMake', v[0], v[1]));
    }
    return Promise.resolve(['CMake', NA]);
  },

  getGCCInfo: () => {
    utils.log('trace', 'getGCCInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('gcc -v 2>&1').then(utils.findVersion),
        utils.run('which gcc'),
      ]).then(v => utils.determineFound('GCC', v[0], v[1]));
    }
    return Promise.resolve(['GCC', NA]);
  },

  getNanoInfo: () => {
    utils.log('trace', 'getNanoInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('nano --version').then(utils.findVersion),
        utils.run('which nano'),
      ]).then(v => utils.determineFound('Nano', v[0], v[1]));
    }
    return Promise.resolve(['Nano', NA]);
  },

  getEmacsInfo: () => {
    utils.log('trace', 'getEmacsInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('emacs --version').then(utils.findVersion),
        utils.run('which emacs'),
      ]).then(v => utils.determineFound('Emacs', v[0], v[1]));
    }
    return Promise.resolve(['Emacs', NA]);
  },

  getVimInfo: () => {
    utils.log('trace', 'getVimInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('vim --version').then(utils.findVersion),
        utils.run('which vim'),
      ]).then(v => utils.determineFound('Vim', v[0], v[1]));
    }
    return Promise.resolve(['Vim', NA]);
  },

  getRustInfo: () => {
    utils.log('trace', 'getRustInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('rustup --version').then(utils.findVersion),
        utils.run('which rustup'),
      ]).then(v => utils.determineFound('Rust', v[0], v[1]));
    }
    return Promise.resolve(['Rust', NA]);
  },

  getScalaInfo: () => {
    utils.log('trace', 'getScalaInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('scalac -version').then(utils.findVersion),
        utils.run('which scalac'),
      ]).then(v => utils.determineFound('Scala', v[0], v[1]));
    }
    return Promise.resolve(['Scala', NA]);
  },

  getJavaInfo: () => {
    utils.log('trace', 'getJavaInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('javac -version 2>&1').then(utils.findVersion),
        utils.run('which javac'),
      ]).then(v => utils.determineFound('Java', v[0], v[1]));
    }
    return Promise.resolve(['Java', NA]);
  },

  getApacheInfo: () => {
    utils.log('trace', 'getApacheInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('apachectl -v').then(utils.findVersion),
        utils.run('which apachectl'),
      ]).then(v => utils.determineFound('Apache', v[0], v[1]));
    }
    return Promise.resolve(['Apache', NA]);
  },

  getNginxInfo: () => {
    utils.log('trace', 'getNginxInfo');
    if (macos || linux) {
      return Promise.all([
        utils.run('nginx -v 2>&1').then(utils.findVersion),
        utils.run('which nginx'),
      ]).then(v => utils.determineFound('Nginx', v[0], v[1]));
    }
    return Promise.resolve(['Nginx', NA]);
  },
});
