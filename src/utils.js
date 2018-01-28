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

function requireJson(filePath) {
  var packageJson;
  if (fs.existsSync(filePath)) {
    try {
      packageJson = require(filePath); // eslint-disable-line global-require
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

module.exports = {
  run: run,
  getPackageJsonByName: getPackageJsonByName,
  getPackageJsonByPath: getPackageJsonByPath,
  requireJson: requireJson,
  toReadableBytes: toReadableBytes,
  uniq: uniq,
};
