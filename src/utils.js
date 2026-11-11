const path = require('path');
const fs = require('fs');
const os = require('os');
const childProcess = require('child_process');
const libWhich = require('which');
const glob = require('glob');
const matchers = require('./matchers');

const run = (cmd, { unify = false } = {}) => {
  return new Promise(resolve => {
    childProcess.exec(
      cmd,
      {
        stdio: [0, 'pipe', 'ignore'],
      },
      (err, stdout, stderr) => {
        let output = ``;
        if (unify) {
          output = stdout.toString() + stderr.toString();
        } else {
          output = stdout.toString();
        }
        resolve((err ? '' : output).trim());
      }
    );
  });
};

const log = function log(level) {
  const args = Object.values(Array.prototype.slice.call(arguments).slice(1));
  if ((process.env.ENVINFO_DEBUG || '').toLowerCase() === level)
    console.log(level, JSON.stringify(args)); // eslint-disable-line no-console
};

const fileExists = filePath => {
  return new Promise(resolve => {
    fs.stat(filePath, err => (err ? resolve(null) : resolve(filePath)));
  });
};

const windowsExeExists = relExeFilePath => {
  return new Promise(resolve => {
    let absPath;
    fs.access(
      (absPath = path.join(process.env.ProgramFiles, `${relExeFilePath}`)),
      fs.constants.R_OK,
      err1 => {
        if (err1) {
          fs.access(
            (absPath = path.join(process.env['ProgramFiles(x86)'], `${relExeFilePath}`)),
            fs.constants.X_OK,
            err2 => {
              resolve(err2 ? null : absPath);
            }
          );
        } else resolve(absPath);
      }
    );
  });
};

const readFile = filePath => {
  return new Promise(fileResolved => {
    fs.readFile(filePath, 'utf8', (err, file) => (file ? fileResolved(file) : fileResolved(null)));
  });
};

const requireJson = filePath => {
  return readFile(filePath).then(file => (file ? JSON.parse(file) : null));
};

const versionRegex = /\d+\.[\d+|.]+/g;

const findDarwinApplication = id => {
  log('trace', 'findDarwinApplication', id);
  const command = `mdfind "kMDItemCFBundleIdentifier=='${id}'"`;
  log('trace', command);
  return run(command).then(v => v.replace(/(\s)/g, '\\ '));
};

// Like findDarwinApplication, but returns every match as an array of raw
// (unescaped) paths. mdfind prints one path per line; multiple apps can share
// a bundle identifier (e.g. several Android Studio versions side by side).
const findDarwinApplications = id => {
  log('trace', 'findDarwinApplications', id);
  const command = `mdfind "kMDItemCFBundleIdentifier=='${id}'"`;
  log('trace', command);
  return run(command).then(output =>
    output
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean)
  );
};

// Compares two version-ish strings ('2025.2', '2022.3.1.18', '4.1 AI-201.8743.12.41.7042882')
// by their numeric groups. Returns negative when a < b, positive when a > b, 0 when equal.
const compareVersions = (a, b) => {
  const toParts = v => (String(v).match(/\d+/g) || []).map(Number);
  const partsA = toParts(a);
  const partsB = toParts(b);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
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

const matchAll = (regex, text) => {
  const matches = [];
  let match = null;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    matches.push(match);
  }
  return matches;
};

const uniq = arr => {
  return Array.from(new Set(arr)); // eslint-disable-line no-undef
};

// Splits a row of `sdkmanager --list` into its package path and description. The legacy sdkmanager
// separates the columns with `|`. The Android CLI, which sdkmanager runs since the command-line tools 23.0,
// separates them with spaces.
const parseSDKManagerRow = line => {
  if (line.indexOf('|') >= 0) {
    const columns = line.split('|').map(column => column.trim());
    return { path: columns[0], description: columns[2] || '' };
  }
  const row = matchers.androidSDKCliRow.exec(line);
  return row ? { path: row[1], description: row[2] || '' } : null;
};

const parseSDKManagerOutput = output => {
  const apiLevels = [];
  const buildTools = [];
  const systemImages = [];
  const lines = output.replace(matchers.ansiEscapes, '').split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    // Available updates and packages follow the installed packages.
    if (line.indexOf('Available') === 0) break;
    const row = parseSDKManagerRow(line);
    const pkg = row && matchers.androidSDKPackage.exec(row.path);
    if (pkg) {
      const segments = pkg[2].split(matchers.androidSDKPathSeparator);
      if (pkg[1] === 'build-tools') {
        buildTools.push(segments[0]);
      } else if (pkg[1] === 'platforms') {
        const level = matchers.androidAPILevel.exec(segments[0]);
        if (level) apiLevels.push(level[1]);
      } else if (pkg[1] === 'system-images') {
        const image = row.description.split(' System Image')[0] || segments.slice(1).join('/');
        systemImages.push(image ? segments[0] + ' | ' + image : segments[0]);
      }
    }
  }

  return {
    apiLevels: uniq(apiLevels),
    buildTools: uniq(buildTools),
    systemImages: uniq(systemImages),
  };
};

module.exports = {
  run: run,
  log: log,
  fileExists: fileExists,
  windowsExeExists: windowsExeExists,
  readFile: readFile,
  requireJson: requireJson,
  versionRegex: versionRegex,
  findDarwinApplication: findDarwinApplication,
  findDarwinApplications: findDarwinApplications,
  compareVersions: compareVersions,
  generatePlistBuddyCommand: generatePlistBuddyCommand,
  matchAll: matchAll,
  parseSDKManagerOutput: parseSDKManagerOutput,

  isLinux: process.platform === 'linux',
  isMacOS: process.platform === 'darwin',
  NA: 'N/A',
  NotFound: 'Not Found',
  isWindows: process.platform.startsWith('win'),

  isObject: val => typeof val === 'object' && !Array.isArray(val),
  noop: d => d,
  pipe: fns => x => fns.reduce((v, f) => f(v), x),

  browserBundleIdentifiers: {
    'Brave Browser': 'com.brave.Browser',
    Chrome: 'com.google.Chrome',
    'Chrome Canary': 'com.google.Chrome.canary',
    Firefox: 'org.mozilla.firefox',
    'Firefox Developer Edition': 'org.mozilla.firefoxdeveloperedition',
    'Firefox Nightly': 'org.mozilla.nightly',
    'Microsoft Edge': 'com.microsoft.edgemac',
    Safari: 'com.apple.Safari',
    'Safari Technology Preview': 'com.apple.SafariTechnologyPreview',
  },

  ideBundleIdentifiers: {
    'Android Studio': 'com.google.android.studio',
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

  uniq: uniq,

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
      const cb = (err, res) => resolve(res.map(path.normalize) || []);
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
    log('trace', 'findVersion', versionString, regex, index);
    const idx = index || 0;
    const matcher = regex || versionRegex;
    const matched = versionString.match(matcher);
    return matched ? matched[idx] : versionString;
  },

  condensePath: pathString => {
    return (pathString || '').replace(os.homedir(), '~');
  },

  determineFound: (name, version, appPath) => {
    log('trace', 'determineFound', name, version, appPath);
    if (version === 'N/A') {
      return Promise.resolve([name, 'N/A']);
    }
    if (!version || Object.keys(version).length === 0) return Promise.resolve([name, 'Not Found']);
    if (!appPath) return Promise.resolve([name, version]);
    return Promise.resolve([name, version, appPath]);
  },
};
