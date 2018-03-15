const glob = require('glob');
const utils = require('./utils');

function getAllPackageJsonPaths(packageGlob) {
  if (packageGlob) return glob.sync(`node_modules/${packageGlob}/package.json`);
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

  let packageGlob = null;

  if (typeof packages === 'string') {
    if (
      // detect characters that are not allowed in npm names, but are in globs
      // wont work if the exactly once glob @ is used by itself, because of npm namespacing
      packages.includes('*') ||
      packages.includes('?') ||
      packages.includes('+') ||
      packages.includes('!')
    ) {
      packageGlob = packages;
    } else {
      packages = packages.split(',');
    }
  }
  // get the package.json files from the full tree for either option
  const allPackageJsonPaths =
    (packageGlob || options.duplicates || options.fullTree) && getAllPackageJsonPaths();

  // get the globbed packages if the packageGlob is truthy
  const globbedPackageJsonPaths = packageGlob && getAllPackageJsonPaths(packageGlob);

  // load top level package.json for the dependencies
  const packageJson = utils.getPackageJsonByPath('package.json') || {};
  const topLevelDependencies = Object.assign(
    {},
    packageJson.devDependencies || {},
    packageJson.dependencies || {}
  );
  const topLevelPackageNames = Object.keys(topLevelDependencies);

  // filter the globbed paths by whats actually in your root package.json
  const globbedTopLevelDependencies = (globbedPackageJsonPaths || []).filter(p => {
    return topLevelPackageNames.includes(p.match(/(?:node_modules)\/(.+)\/(?:.*)/)[1]);
  });

  if (packageGlob) {
    // --npmPackages "eslint-*" (--duplicates) (--fullTree)
    // matches packages against given glob, optionally adding duplicates, or crawling the fullTree
    return utils.sortObject(
      Object.entries(
        options.fullTree
          ? getPackageFullTree(globbedPackageJsonPaths)
          : getPackageFullTree(globbedTopLevelDependencies)
      )
        .map(options.fullTree ? mapFullPackageTree : mapTopLevelDependencies)
        .map(d => assignWantedVersion(d, topLevelDependencies))
        .map(d => (options.duplicates ? getPackageDuplicates(d, allPackageJsonPaths) : d))
        .reduce(packageReducer, {})
    );
  }

  if (Array.isArray(packages)) {
    // --npmPackages minimist,which (--duplicates)
    // only specified top level packages (with duplicates) with wanted and installed
    return utils.sortObject(
      Object.entries(topLevelDependencies)
        .map(mapTopLevelDependencies)
        .filter(d => packages.includes(d.name))
        .map(d => (options.duplicates ? getPackageDuplicates(d, allPackageJsonPaths) : d))
        .reduce(packageReducer, {})
    );
  }

  if (typeof packages === 'boolean') {
    // --npmPackages (--duplicates) (--fullTree)
    // print all packages (with duplicates) with wanted and installed, optionally crawling full tree
    return utils.sortObject(
      Object.entries(
        options.fullTree ? getPackageFullTree(allPackageJsonPaths) : topLevelDependencies
      )
        .map(options.fullTree ? mapFullPackageTree : mapTopLevelDependencies)
        .map(d => assignWantedVersion(d, topLevelDependencies))
        .map(d => (options.duplicates ? getPackageDuplicates(d, allPackageJsonPaths) : d))
        .reduce(packageReducer, {})
    );
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
  } catch (error) {
    if (error.stdout) npmGlobalPackages = JSON.parse(error.stdout.toString());
    if (!npmGlobalPackages) return 'Not Found';
  }

  npmGlobalPackages = Object.entries(npmGlobalPackages.dependencies).reduce((acc, dep) => {
    const name = dep[0];
    const info = dep[1];
    if (!Array.isArray(packages) || packages.some(p => p.toLowerCase() === name.toLowerCase()))
      return Object.assign(acc, {
        [name]: info.version,
      });
    return acc;
  }, {});

  return npmGlobalPackages;
}

module.exports = {
  getPackageInfo: getPackageInfo,
  getNpmGlobalPackages: getNpmGlobalPackages,
};
