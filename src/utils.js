module.exports.uniq = function uniq(arr) {
  return Array.from(new Set(arr));
};

module.exports.getDependencyPackageJson = function getDependencyPackageJson(dep) {
  return require(process.cwd() + '/node_modules/' + dep + '/package.json');
};
