var path = require('path');
var fs = require('fs');

module.exports.uniq = function uniq(arr) {
  return Array.from(new Set(arr));
};

module.exports.getDependencyPackageJson = function getDependencyPackageJson(dep) {
  var filePath = path.join(process.cwd(), '/node_modules/', dep, '/package.json');
  if (fs.existsSync(filePath)) return require(filePath);
  return false;
};
