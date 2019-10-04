const os = require('os');
const utils = require('../utils');

module.exports = {
  getBraveBrowserInfo: () => {
    utils.log('trace', 'getBraveBrowser');
    let braveVersion;
    if (utils.isLinux) {
      braveVersion = utils.run('brave --version').then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (utils.isMacOS) {
      braveVersion = utils
        .getDarwinApplicationVersion(utils.browserBundleIdentifiers['Brave Browser'])
        .then(utils.findVersion);
    } else {
      braveVersion = Promise.resolve('N/A');
    }
    return braveVersion.then(v => utils.determineFound('Brave Browser', v, 'N/A'));
  },

  getChromeInfo: () => {
    utils.log('trace', 'getChromeInfo');
    let chromeVersion;
    if (utils.isLinux) {
      chromeVersion = utils
        .run('google-chrome --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (utils.isMacOS) {
      chromeVersion = utils
        .getDarwinApplicationVersion(utils.browserBundleIdentifiers.Chrome)
        .then(utils.findVersion);
    } else {
      chromeVersion = Promise.resolve('N/A');
    }
    return chromeVersion.then(v => utils.determineFound('Chrome', v, 'N/A'));
  },

  getChromeCanaryInfo: () => {
    utils.log('trace', 'getChromeCanaryInfo');
    const chromeCanaryVersion = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Chrome Canary']
    );
    return chromeCanaryVersion.then(v => utils.determineFound('Chrome Canary', v, 'N/A'));
  },

  getEdgeInfo: () => {
    utils.log('trace', 'getEdgeInfo');
    let edgeVersion;
    if (utils.isWindows && os.release().split('.')[0] === '10') {
      edgeVersion = utils
        .run('powershell get-appxpackage Microsoft.MicrosoftEdge')
        .then(utils.findVersion);
    } else {
      edgeVersion = Promise.resolve('N/A');
    }
    return edgeVersion.then(v => utils.determineFound('Edge', v, 'N/A'));
  },

  getFirefoxInfo: () => {
    utils.log('trace', 'getFirefoxInfo');
    let firefoxVersion;
    if (utils.isLinux) {
      firefoxVersion = utils.run('firefox --version').then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (utils.isMacOS) {
      firefoxVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Firefox);
    } else {
      firefoxVersion = Promise.resolve('N/A');
    }
    return firefoxVersion.then(v => utils.determineFound('Firefox', v, 'N/A'));
  },

  getFirefoxDeveloperEditionInfo: () => {
    utils.log('trace', 'getFirefoxDeveloperEditionInfo');
    const firefoxDeveloperEdition = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Firefox Developer Edition']
    );
    return firefoxDeveloperEdition.then(v =>
      utils.determineFound('Firefox Developer Edition', v, 'N/A')
    );
  },

  getFirefoxNightlyInfo: () => {
    utils.log('trace', 'getFirefoxNightlyInfo');
    let firefoxNightlyVersion;
    if (utils.isLinux) {
      firefoxNightlyVersion = utils
        .run('firefox-trunk --version')
        .then(v => v.replace(/^.* ([^ ]*)/g, '$1'));
    } else if (utils.isMacOS) {
      firefoxNightlyVersion = utils.getDarwinApplicationVersion(
        utils.browserBundleIdentifiers['Firefox Nightly']
      );
    } else {
      firefoxNightlyVersion = Promise.resolve('N/A');
    }

    return firefoxNightlyVersion.then(v => utils.determineFound('Firefox Nightly', v, 'N/A'));
  },

  getInternetExplorerInfo: () => {
    utils.log('trace', 'getInternetExplorerInfo');
    let explorerVersion;
    if (utils.isWindows) {
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
      explorerVersion = Promise.resolve('N/A');
    }
    return explorerVersion.then(v => utils.determineFound('Internet Explorer', v, 'N/A'));
  },

  getSafariTechnologyPreviewInfo: () => {
    utils.log('trace', 'getSafariTechnologyPreviewInfo');
    const safariTechnologyPreview = utils.getDarwinApplicationVersion(
      utils.browserBundleIdentifiers['Safari Technology Preview']
    );
    return safariTechnologyPreview.then(v =>
      utils.determineFound('Safari Technology Preview', v, 'N/A')
    );
  },

  getSafariInfo: () => {
    utils.log('trace', 'getSafariInfo');
    const safariVersion = utils.getDarwinApplicationVersion(utils.browserBundleIdentifiers.Safari);
    return safariVersion.then(v => utils.determineFound('Safari', v, 'N/A'));
  },
};
