const childProcess = require('child_process');
const os = require('os');
const osName = require('os-name');
const path = require('path');
const packages = require('./packages');
const utils = require('./utils');

module.exports = Object.assign({}, utils, packages, {
  getiOSSDKInfo: () => {
    var iOSSDKVersions;
    if (process.platform === 'darwin') {
      iOSSDKVersions = utils
        .run('xcodebuild -showsdks')
        .then(sdks => sdks.match(/[\w]+\s[\d|.]+/g))
        .then(utils.uniq)
        .catch(() => 'Unknown');
    } else {
      iOSSDKVersions = 'N/A';
    }
    return iOSSDKVersions.then(platforms => ['iOS SDK', { Platforms: platforms }]);
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
        return [
          'Android SDK',
          {
            'Build Tools': buildTools,
            'API Levels': androidAPIs,
          },
        ];
      })
      .catch(() => ({
        buildTools: ['Unknown'],
        androidAPIs: ['Unknown'],
      }));
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
        return `${linuxVersion} ${linuxBuildNumber}`;
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
        return `${windowsVersion} ${windowsBuildNumber}`;
      });
    }
    return Promise.all(['Android Studio', androidStudioVersion || 'Not Found']);
  },

  getAtomInfo: () => {
    utils.log('trace', 'getAtomInfo');
    return Promise.all(['Atom', utils.getDarwinApplicationVersion('com.github.atom'), 'N/A']);
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
      'Bash',
      utils.run('bash --version').then(utils.findVersion),
      utils.which('bash'),
    ]);
  },

  getPHPInfo: () => {
    utils.log('trace', 'getPHPInfo');
    return Promise.all(['PHP', utils.run('php -v').then(utils.findVersion), utils.which('php')]);
  },

  getParallelsInfo: () => {
    utils.log('trace', 'getParallelsInfo');
    return Promise.all([
      'Parallels',
      utils.run('prlctl --version').then(utils.findVersion),
      utils.which('prlctl'),
    ]);
  },

  getDockerInfo: () => {
    utils.log('trace', 'getDockerInfo');
    return Promise.all([
      'Docker',
      utils.run('docker --version').then(utils.findVersion),
      utils.which('docker'),
    ]);
  },

  getElixirInfo: () => {
    utils.log('trace', 'getElixirInfo');
    return Promise.all([
      'Elixir',
      utils.run('elixir --version').then(version => version.match(/[Elixir]+\s([\d+.[\d+|.]+)/)[1]),
      utils.which('elixir'),
    ]);
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
      'Sublime Text',
      utils.run('subl --version').then(version => utils.findVersion(version, /\d+/)),
      utils.which('subl'),
    ]);
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
    } else homeBrewVersion = Promise.resolve('N/A');
    return homeBrewVersion;
  },

  getGoInfo: () => {
    utils.log('trace', 'getGoInfo');
    return Promise.all(['Go', utils.run('go version').then(utils.findVersion), utils.which('go')]);
  },

  getRubyInfo: () => {
    utils.log('trace', 'getRubyInfo');
    return Promise.all(['Ruby', utils.run('ruby -v').then(utils.findVersion), utils.which('ruby')]);
  },

  getNodeInfo: () => {
    utils.log('trace', 'getNodeInfo');
    return Promise.all([
      'Node',
      utils.run('node -v').then(v => v.replace('v', '')),
      utils.which('node').then(utils.condensePath),
    ]);
  },

  getnpmInfo: () => {
    utils.log('trace', 'getnpmInfo');
    return Promise.all(['npm', utils.run('npm -v'), utils.which('npm').then(utils.condensePath)]);
  },

  getShellInfo: () => {
    utils.log('trace', 'getShellInfo');
    return Promise.all([
      'Shell',
      utils.run(`${process.env.SHELL} --version`).then(utils.findVersion),
      utils.which(process.env.SHELL),
    ]);
  },

  getOSInfo: () => {
    utils.log('trace', 'getOSInfo');
    return (process.platform === 'darwin'
      ? utils.run('sw_vers -productVersion ')
      : Promise.resolve()
    ).then(version => {
      let info = osName(os.platform(), os.release());
      if (version) info += ` ${version}`;
      return ['OS', info];
    });
  },

  getWatchmanInfo: () => {
    utils.log('trace', 'getWatchmanInfo');
    return Promise.all([
      'Watchman',
      utils.which('watchman').then(watchmanPath => utils.run(watchmanPath + ' -v')),
      utils.which('watchman'),
    ]);
  },

  getVSCodeInfo: () => {
    utils.log('trace', 'getVSCodeInfo');
    return Promise.all([
      'VSCode',
      utils.run('code --version').then(utils.findVersion),
      utils.which('code'),
    ]);
  },

  getVirtualBoxInfo: () => {
    utils.log('trace', 'getVirtualBoxInfo');
    return Promise.all([
      'VirtualBox',
      utils.run('vboxmanage --version').then(utils.findVersion),
      utils.which('vboxmanage'),
    ]);
  },

  getVMwareFusionInfo: () => {
    utils.log('trace', 'getVMwareFusionInfo');
    return Promise.all([
      'VMWare Fusion',
      utils.getDarwinApplicationVersion('com.vmware.fusion'),
      'N/A',
    ]);
  },

  getPythonInfo: () => {
    utils.log('trace', 'getPythonInfo');
    let pythonVersion;
    let pythonPath;
    try {
      pythonPath = utils.runSync('which python');
      pythonVersion = childProcess
        .execFileSync(pythonPath, ['-c', 'import platform; print(platform.python_version());'])
        .toString()
        .replace(/(\r\n|\n|\r)/gm, '');
    } catch (error) {
      pythonVersion = 'Not Found';
    }
    return Promise.resolve(['Python', pythonVersion, pythonPath]);
  },

  getXcodeInfo: () => {
    utils.log('trace', 'getXcodeInfo');
    if (process.platform === 'darwin') {
      return Promise.all([
        'Xcode',
        utils
          .which('xcodebuild')
          .then(xcodePath => utils.run(xcodePath + ' -version'))
          .then(version => `${utils.findVersion(version)} - ${version.split('Build version ')[1]}`),
        utils.which('xcodebuild'),
      ]);
    }
    return Promise.resolve(['Xcode', 'N/A']);
  },

  getYarnInfo: () => {
    utils.log('trace', 'getYarnInfo');
    return Promise.all([
      'Yarn',
      utils.run('yarn -v'),
      utils.which('yarn').then(utils.condensePath),
    ]);
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
      chromeVersion = 'N/A';
    }
    return Promise.all(['Chrome', chromeVersion, 'N/A']);
  },

  getChromeCanaryInfo: () => {
    utils.log('trace', 'getChromeCanaryInfo');
    const chromeCanaryVersion = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Chrome Canary']
    );
    return Promise.all(['Chrome Canary', chromeCanaryVersion, 'N/A']);
  },

  getFirefoxDeveloperEditionInfo: () => {
    utils.log('trace', 'getFirefoxDeveloperEditionInfo');
    const firefoxDeveloperEdition = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Firefox Developer Edition']
    );
    return Promise.all(['Firefox Developer Edition', firefoxDeveloperEdition, 'N/A']);
  },

  getSafariTechnologyPreviewInfo: () => {
    utils.log('trace', 'getSafariTechnologyPreviewInfo');
    const safariTechnologyPreview = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Safari Technology Preview']
    );
    return Promise.all(['Safari Technology Preview', safariTechnologyPreview, 'N/A']);
  },

  getSafariInfo: () => {
    utils.log('trace', 'getSafariInfo');
    const safariVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Safari);
    return Promise.all(['Safari', safariVersion, 'N/A']);
  },

  getFirefoxInfo: () => {
    utils.log('trace', 'getFirefoxInfo');
    let firefoxVersion;
    if (process.platform === 'linux') {
      firefoxVersion = utils.run('firefox --version').then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (process.platform !== 'darwin') {
      firefoxVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Firefox);
    } else {
      firefoxVersion = 'N/A';
    }
    return Promise.all(['Firefox', firefoxVersion, 'N/A']);
  },

  getFirefoxNightlyInfo: () => {
    utils.log('trace', 'getFirefoxNightlyInfo');
    let firefoxNightlyVersion;
    if (process.platform === 'linux') {
      firefoxNightlyVersion = utils
        .run('firefox-trunk --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (process.platform !== 'darwin') {
      firefoxNightlyVersion = utils.getDarwinApplicationVersion(
        utils.browserBundleIdentifiers['Firefox Nightly']
      );
    } else {
      firefoxNightlyVersion = 'N/A';
    }
    return Promise.all(['Firefox Nightly', firefoxNightlyVersion, 'N/A']);
  },
});
