const os = require('os');
const osName = require('os-name');
const path = require('path');
const packages = require('./packages');
const utils = require('./utils');

const NA = 'N/A';
const NotFound = 'Not Found';

module.exports = Object.assign({}, utils, packages, {
  getiOSSDKInfo: () => {
    if (process.platform === 'darwin') {
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
    if (process.platform === 'darwin') {
      androidStudioVersion = utils
        .run(
          utils.generatePlistBuddyCommand(
            path.join('/', 'Applications', 'Android\\ Studio.app', 'Contents', 'Info.plist'),
            ['CFBundleShortVersionString', 'CFBundleVersion']
          )
        )
        .then(version => version.split('\n').join(' '));
    } else if (process.platform === 'linux') {
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
    } else if (process.platform.startsWith('win')) {
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
    return Promise.all([utils.getDarwinApplicationVersion('com.github.atom'), NA]).then(v =>
      utils.determineFound('Atom', v[0], v[1])
    );
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
    ]).then(v => utils.determineFound('Sublime Text', v[0], v[1]));
  },

  getHomeBrewInfo: () => {
    utils.log('trace', 'getHomeBrewInfo');
    var homeBrewVersion;
    if (process.platform === 'darwin') {
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
    if (process.platform === 'darwin' || process.platform === 'linux') {
      const shell =
        process.env.SHELL || utils.runSync('getent passwd $LOGNAME | cut -d: -f7 | head -1');
      return Promise.all([
        utils.run(`${shell} --version`).then(utils.findVersion),
        utils.which(shell),
      ]).then(v => utils.determineFound('Shell', v[0] || 'Unknown', v[1]));
    }
    return Promise.resolve(['Shell', 'N/A']);
  },

  getOSInfo: () => {
    utils.log('trace', 'getOSInfo');
    let version;
    if (process.platform === 'darwin') {
      version = utils.run('sw_vers -productVersion ');
    } else if (process.platform === 'linux') {
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
    if (process.platform === 'linux')
      return Promise.all([utils.fileExists('/.dockerenv'), utils.readFile('/proc/self/cgroup')])
        .then(results => {
          utils.log('trace', 'getContainerInfoThen', results);
          return Promise.resolve(['Container', results[0] || results[1] ? 'Yes' : 'No']);
        })
        .catch(err => utils.log('trace', 'getContainerInfoCatch', err));
    return Promise.resolve(['Container', 'N/A']);
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
    if (process.platform === 'darwin') {
      return Promise.all([
        utils
          .which('xcodebuild')
          .then(xcodePath => utils.run(xcodePath + ' -version'))
          .then(version => `${utils.findVersion(version)} - ${version.split('Build version ')[1]}`),
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
    if (process.platform.startsWith('win') && os.release().split('.')[0] === '10') {
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
    if (process.platform.startsWith('win')) {
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
    if (process.platform === 'linux') {
      chromeVersion = utils
        .run('google-chrome --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (process.platform === 'darwin') {
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
    if (process.platform === 'linux') {
      firefoxVersion = utils.run('firefox --version').then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (process.platform === 'darwin') {
      firefoxVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Firefox);
    } else {
      firefoxVersion = Promise.resolve(NA);
    }
    return firefoxVersion.then(v => utils.determineFound('Firefox', v, NA));
  },

  getFirefoxNightlyInfo: () => {
    utils.log('trace', 'getFirefoxNightlyInfo');
    let firefoxNightlyVersion;
    if (process.platform === 'linux') {
      firefoxNightlyVersion = utils
        .run('firefox-trunk --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (process.platform === 'darwin') {
      firefoxNightlyVersion = utils.getDarwinApplicationVersion(
        utils.browserBundleIdentifiers['Firefox Nightly']
      );
    } else {
      firefoxNightlyVersion = Promise.resolve(NA);
    }

    return firefoxNightlyVersion.then(v => utils.determineFound('Firefox Nightly', v, NA));
  },
});
