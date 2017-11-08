var path = require('path');
var fs = require('fs');

module.exports.uniq = function uniq(arr) {
  return Array.from(new Set(arr));
};

module.exports.requireJson = function requireJson(filePath) {
  if (fs.existsSync(filePath)) return require(filePath);
  return false;
};

module.exports.getPackageJsonByName = function getPackageJsonByName(dep) {
  return this.requireJson(path.join(process.cwd(), '/node_modules/', dep, '/package.json'));
};

module.exports.getPackageJsonByPath = function getPackageJsonByPath(filePath) {
  return this.requireJson(path.join(process.cwd(), filePath));
};
