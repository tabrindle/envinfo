const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const libWhich = require('which');
const glob = require('glob');

const run = cmd => {
  return new Promise(resolve => {
    childProcess.exec(
      cmd,
      {
        stdio: [0, 'pipe', 'ignore'],
      },
      (err, out) => {
        resolve((err ? '' : out.toString() || '').trim());
      }
    );
  });
};

const log = function log(level) {
  const args = Object.values(Array.prototype.slice.call(arguments).slice(1));
  if ((process.env.ENVINFO_DEBUG || '').toLowerCase() === level)
    console.log(level, JSON.stringify(args));
};

const fileExists = filePath => {
  return new Promise(resolve => {
    fs.stat(filePath, err => (err ? resolve(null) : resolve(filePath)));
  });
};

const readFile = filePath => {
  return new Promise(fileResolved => {
    if (!filePath) fileResolved(null);
    fs.readFile(filePath, 'utf8', (err, file) => (file ? fileResolved(file) : fileResolved(null)));
  });
};

const requireJson = filePath => {
  return fileExists(filePath)
    .then(readFile)
    .then(file => (file ? JSON.parse(file) : null));
};

const versionRegex = /\d+\.[\d+|.]+/g;

const findDarwinApplication = id => {
  log('trace', 'findDarwinApplication', id);
  const command = `mdfind "kMDItemCFBundleIdentifier=='${id}'"`;
  log('trace', command);
  return run(command).then(v => v.replace(/(\s)/g, '\\ '));
};

const generatePlistBuddyCommand = (appPath, options) => {
  var optionsArray = (options || ['CFBundleShortVersionString']).map(function optionsMap(option) {
    return '-c Print:' + option;
  });
  return ['/usr/libexec/PlistBuddy']
    .concat(optionsArray)
    .concat([appPath])
    .join(' ');
};

module.exports = {
  run: run,
  log: log,
  fileExists: fileExists,
  readFile: readFile,
  requireJson: requireJson,
  versionRegex: versionRegex,
  findDarwinApplication: findDarwinApplication,
  generatePlistBuddyCommand: generatePlistBuddyCommand,

  isObject: val => typeof val === 'object' && !Array.isArray(val),
  noop: d => d,
  pipe: fns => x => fns.reduce((v, f) => f(v), x),

  browserBundleIdentifiers: {
    Chrome: 'com.google.Chrome',
    'Chrome Canary': 'com.google.Chrome.canary',
    Firefox: 'org.mozilla.firefox',
    'Firefox Developer Edition': 'org.mozilla.firefoxdeveloperedition',
    'Firefox Nightly': 'org.mozilla.nightly',
    Safari: 'com.apple.Safari',
    'Safari Technology Preview': 'com.apple.SafariTechnologyPreview',
  },

  ideBundleIdentifiers: {
    Atom: 'com.github.atom',
    IntelliJ: 'com.jetbrains.intellij',
    PhpStorm: 'com.jetbrains.PhpStorm',
    'Sublime Text': 'com.sublimetext.3',
    WebStorm: 'com.jetbrains.WebStorm',
  },

  runSync: cmd => {
    return (
      childProcess
        .execSync(cmd, {
          stdio: [0, 'pipe', 'ignore'],
        })
        .toString() || ''
    ).trim();
  },

  which: binary => {
    return new Promise(resolve => libWhich(binary, (err, binaryPath) => resolve(binaryPath)));
  },

  getDarwinApplicationVersion: bundleIdentifier => {
    log('trace', 'getDarwinApplicationVersion', bundleIdentifier);
    var version;
    if (process.platform !== 'darwin') {
      version = 'N/A';
    } else {
      version = findDarwinApplication(bundleIdentifier).then(appPath =>
        run(
          generatePlistBuddyCommand(path.join(appPath, 'Contents', 'Info.plist'), [
            'CFBundleShortVersionString',
          ])
        )
      );
    }
    return Promise.resolve(version);
  },

  uniq: arr => {
    return Array.from(new Set(arr)); // eslint-disable-line no-undef
  },

  toReadableBytes: bytes => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      (!bytes && '0 Bytes') ||
      (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB'][i]
    );
  },

  omit: (obj, props) => {
    return Object.keys(obj)
      .filter(key => props.indexOf(key) < 0)
      .reduce((acc, key) => Object.assign(acc, { [key]: obj[key] }), {});
  },

  pick: (obj, props) => {
    return Object.keys(obj)
      .filter(key => props.indexOf(key) >= 0)
      .reduce((acc, key) => Object.assign(acc, { [key]: obj[key] }), {});
  },

  getPackageJsonByName: name => {
    return requireJson(path.join(process.cwd(), 'node_modules', name, 'package.json'));
  },

  getPackageJsonByPath: filePath => {
    return requireJson(path.join(process.cwd(), filePath));
  },

  getPackageJsonByFullPath: fullPath => {
    log('trace', 'getPackageJsonByFullPath', fullPath);
    return requireJson(fullPath);
  },

  getAllPackageJsonPaths: packageGlob => {
    log('trace', 'getAllPackageJsonPaths', packageGlob);
    return new Promise(resolve => {
      const cb = (err, res) => resolve(res || []);
      if (packageGlob) return glob(path.join('node_modules', packageGlob, 'package.json'), cb);
      return glob(path.join('node_modules', '**', 'package.json'), cb);
    });
  },

  sortObject: obj => {
    return Object.keys(obj)
      .sort()
      .reduce((acc, val) => {
        acc[val] = obj[val];
        return acc;
      }, {});
  },

  findVersion: (versionString, regex, index) => {
    const idx = index || 0;
    const matcher = regex || versionRegex;
    const matched = versionString.match(matcher);
    return matched ? matched[idx] : versionString;
  },

  condensePath: pathString => {
    return (pathString || '').replace(process.env.HOME, '~');
  },

  determineFound: (name, version, appPath) => {
    log('trace', 'clean', name, version, appPath);
    if (!version || version === 'N/A' || (version === 'N/A' && appPath === 'N/A'))
      return Promise.resolve([name, 'Not Found']);
    if (!appPath) return Promise.resolve([name, version]);
    return Promise.resolve([name, version, appPath]);
  },
};
