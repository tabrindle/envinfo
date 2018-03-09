var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');

function run(cmd) {
  return (
    childProcess
      .execSync(cmd, {
        stdio: [0, 'pipe', 'ignore'],
      })
      .toString() || ''
  ).trim();
}

function customGenericVersionFunction(fn, msg) {
  if (!msg) msg = 'Not Found';
  var version;
  try {
    version = fn();
  } catch (error) {
    version = msg;
  }
  return version;
}

function uniq(arr) {
  return Array.from(new Set(arr)); // eslint-disable-line no-undef
}

function toReadableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (!bytes && '0 Bytes') ||
    (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB'][i]
  );
}

const isObject = val => typeof val === 'object' && !Array.isArray(val);
const pipe = fns => x => fns.reduce((v, f) => f(v), x);

function requireJson(filePath) {
  var packageJson;
  if (fs.existsSync(filePath)) {
    try {
      packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return null;
    }
    return packageJson;
  }
  return null;
}

function getPackageJsonByName(dep) {
  return this.requireJson(path.join(process.cwd(), 'node_modules', dep, 'package.json'));
}

function getPackageJsonByPath(filePath) {
  return this.requireJson(path.join(process.cwd(), filePath));
}

const noop = d => d;

module.exports = {
  customGenericVersionFunction: customGenericVersionFunction,
  getPackageJsonByName: getPackageJsonByName,
  getPackageJsonByPath: getPackageJsonByPath,
  isObject: isObject,
  noop: noop,
  pipe: pipe,
  requireJson: requireJson,
  run: run,
  toReadableBytes: toReadableBytes,
  uniq: uniq,
};
