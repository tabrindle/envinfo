const osName = require('os-name');
const utils = require('../utils');
const os = require('os');

module.exports = {
  getContainerInfo: () => {
    utils.log('trace', 'getContainerInfo');
    if (utils.isLinux)
      return Promise.all([utils.fileExists('/.dockerenv'), utils.readFile('/proc/self/cgroup')])
        .then(results => {
          utils.log('trace', 'getContainerInfoThen', results);
          return Promise.resolve(['Container', results[0] || results[1] ? 'Yes' : 'N/A']);
        })
        .catch(err => utils.log('trace', 'getContainerInfoCatch', err));
    return Promise.resolve(['Container', 'N/A']);
  },

  getCPUInfo: () => {
    utils.log('trace', 'getCPUInfo');
    let info;
    try {
      const cpus = os.cpus();
      info = '(' + cpus.length + ') ' + os.arch() + ' ' + cpus[0].model;
    } catch (err) {
      info = 'Unknown';
    }
    return Promise.all(['CPU', info]);
  },

  getMemoryInfo: () => {
    utils.log('trace', 'getMemoryInfo');
    return Promise.all([
      'Memory',
      `${utils.toReadableBytes(os.freemem())} / ${utils.toReadableBytes(os.totalmem())}`,
    ]);
  },

  getOSInfo: () => {
    utils.log('trace', 'getOSInfo');
    let version;
    if (utils.isMacOS) {
      version = utils.run('sw_vers -productVersion ');
    } else if (utils.isLinux) {
      version = utils.run('cat /etc/os-release').then(v => {
        const distro = (v || '').match(/NAME="(.+)"/) || '';
        const versionInfo = (v || '').match(/VERSION="(.+)"/) || ['', ''];
        const versionStr = versionInfo !== null ? versionInfo[1] : '';
        return `${distro[1]} ${versionStr}`.trim() || '';
      });
    } else if (utils.isWindows) {
      version = Promise.resolve(os.release());
    } else {
      version = Promise.resolve();
    }
    return version.then(v => {
      let info = osName(os.platform(), os.release());
      if (v) info += ` ${v}`;
      return ['OS', info];
    });
  },

  getShellInfo: () => {
    utils.log('trace', 'getShellInfo', process.env);
    if (utils.isMacOS || utils.isLinux) {
      const shell =
        process.env.SHELL || utils.runSync('getent passwd $LOGNAME | cut -d: -f7 | head -1');

      let command = `${shell} --version 2>&1`;
      if (shell.match('/bin/ash')) command = `${shell} --help 2>&1`;

      return Promise.all([utils.run(command).then(utils.findVersion), utils.which(shell)]).then(v =>
        utils.determineFound('Shell', v[0] || 'Unknown', v[1])
      );
    }
    return Promise.resolve(['Shell', 'N/A']);
  },

  getGLibcInfo: () => {
    utils.log('trace', 'getGLibc');
    if (utils.isLinux) {
      return Promise.all([utils.run(`ldd --version`).then(utils.findVersion)]).then(v =>
        utils.determineFound('GLibc', v[0] || 'Unknown')
      );
    }
    return Promise.resolve(['GLibc', 'N/A']);
  },
};
