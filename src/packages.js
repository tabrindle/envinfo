const glob = require('glob');
const utils = require('./utils');

function getAllPackageJsonPaths() {
  return glob.sync('node_modules/**/package.json');
}

function getPackageDuplicates(dependency, allPackageJsonPaths) {
  const duplicates = allPackageJsonPaths
    // filter by which dependency we are looking for
    .filter(packagePath => {
      return packagePath.includes(`/${dependency.name}/package.json`);
    })
    // map over each occurrence of that dependency in the tree
    .map(packageJsonPath => {
      var packageJson = utils.getPackageJsonByPath(packageJsonPath);
      if (packageJson) return packageJson.version;
      return false;
    })
    .filter(Boolean)
    // remove duplicates
    .reduce((p, c) => {
      if (!p.includes(c)) p.push(c);
      return p;
    }, []);

  // if there is more than one version found, push the duplicates
  if (duplicates.length > 1) dependency.duplicates = duplicates;

  return dependency;
}

function getPackageVersion(packageName) {
  var name = packageName.trim();
  var dependencyPackageJson = utils.getPackageJsonByName(name);
  var installed = dependencyPackageJson ? dependencyPackageJson.version : 'Not Found';

  return installed;
}

function packageReducer(list, dependency) {
  const value = dependency.duplicates
    ? {
        [dependency.name]: {
          wanted: dependency.wanted,
          installed: getPackageVersion(dependency.name),
          duplicates: dependency.duplicates,
        },
      }
    : {
        [dependency.name]: {
          wanted: dependency.wanted,
          installed: getPackageVersion(dependency.name),
        },
      };
  return Object.assign(list, value);
}

function getPackageFullTree(allPackageJsonPaths) {
  return allPackageJsonPaths
    .map(filePath => {
      var packageJson = utils.getPackageJsonByPath(filePath);
      return {
        name: packageJson.name,
        installed: packageJson.version,
      };
    })
    .reduce((acc, val) => {
      return Object.assign(acc, {
        [val.name]: acc[val.name] ? acc[val.name].concat([val.installed]) : [val.installed],
      });
    }, {});
}

function mapTopLevelDependencies(dependency) {
  return {
    name: dependency[0],
    wanted: dependency[1],
  };
}

function mapFullPackageTree(dependency) {
  return {
    name: dependency[0],
    installed: dependency[1],
  };
}

function assignWantedVersion(dependency, topLevelDependencies) {
  const idx = Object.keys(topLevelDependencies).indexOf(dependency.name);
  if (idx > -1) {
    return Object.assign(dependency, {
      wanted: Object.values(topLevelDependencies)[idx],
    });
  }
  return dependency;
}

function getPackageInfo(packages, options) {
  if (!options) options = {};
  if (typeof packages === 'string') {
    packages = packages.split(',');
  }

  // get the package.json files from the full tree for either option
  var allPackageJsonPaths = (options.duplicates || options.fullTree) && getAllPackageJsonPaths();

  // load top level package.json for the dependencies
  var packageJson = utils.getPackageJsonByPath('package.json') || {};
  var topLevelDependencies = Object.assign(
    {},
    packageJson.devDependencies || {},
    packageJson.dependencies || {}
  );

  if (Array.isArray(packages)) {
    if (options.duplicates) {
      // --packages minimist,which --duplicates
      // only specified top level packages with duplicates, wanted and installed
      return Object.entries(topLevelDependencies)
        .map(mapTopLevelDependencies)
        .filter(d => packages.includes(d.name))
        .map(d => getPackageDuplicates(d, allPackageJsonPaths))
        .reduce(packageReducer, {});
    }

    // --packages minimist,which
    // only specified top level packages with wanted and installed
    return Object.entries(topLevelDependencies)
      .map(mapTopLevelDependencies)
      .filter(d => packages.includes(d.name))
      .reduce(packageReducer, {});
  }

  if (typeof packages === 'boolean') {
    if (options.duplicates && options.fullTree) {
      // --packages --duplicates --fullTree
      // full tree with installed, duplicates and wanted for top level
      return Object.entries(getPackageFullTree(allPackageJsonPaths))
        .map(mapFullPackageTree)
        .map(d => assignWantedVersion(d, topLevelDependencies))
        .map(d => getPackageDuplicates(d, allPackageJsonPaths))
        .reduce(packageReducer, {});
    }

    if (options.duplicates) {
      // --packages --duplicates
      // top level packages with installed, wanted, and duplicates
      return Object.entries(topLevelDependencies)
        .map(mapTopLevelDependencies)
        .map(dep => getPackageDuplicates(dep, allPackageJsonPaths))
        .reduce(packageReducer, {});
    }

    if (options.fullTree) {
      // --packages --fullTree
      // all packages with installed and wanted if top level
      return Object.entries(getPackageFullTree(allPackageJsonPaths))
        .map(mapFullPackageTree)
        .map(d => assignWantedVersion(d, topLevelDependencies))
        .reduce(packageReducer, {});
    }

    // --packages
    // top level wanted and installed
    return Object.entries(topLevelDependencies)
      .map(mapTopLevelDependencies)
      .reduce(packageReducer, {});
  }

  return {};
}

function getNpmGlobalPackages(packages) {
  if (typeof packages === 'string') {
    packages = packages.split(',');
  }

  var npmGlobalPackages;
  try {
    npmGlobalPackages = utils.run('npm list -g --depth=0 --json');
    npmGlobalPackages = JSON.parse(npmGlobalPackages);
    npmGlobalPackages = Object.entries(npmGlobalPackages.dependencies).reduce((acc, dep) => {
      const name = dep[0];
      const info = dep[1];
      if (packages.some(p => p.toLowerCase() === name.toLowerCase()))
        return Object.assign(acc, {
          [name]: info.version,
        });
      return acc;
    }, {});
  } catch (error) {
    npmGlobalPackages = 'Not Found';
  }
  return npmGlobalPackages;
}

module.exports = {
  getPackageInfo: getPackageInfo,
  getNpmGlobalPackages: getNpmGlobalPackages,
};
