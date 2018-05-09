const glob = require('glob');
const path = require('path');
const utils = require('./utils');

function getnpmPackages(packages, options) {
  utils.log('trace', 'getnpmPackages');
  if (!options) options = {};

  let packageGlob = null;
  let tld = null;

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

  return Promise.all([
    'npmPackages',
    utils
      .getPackageJsonByPath('package.json')
      .then(packageJson =>
        Object.assign(
          {},
          (packageJson || {}).devDependencies || {},
          (packageJson || {}).dependencies || {}
        )
      )
      // determine which paths to get
      .then(packageJsonDependencies => {
        tld = packageJsonDependencies;
        if (options.fullTree || options.duplicates || packageGlob) {
          return utils.getAllPackageJsonPaths(packageGlob);
        }
        return Promise.resolve(
          Object.keys(packageJsonDependencies || []).map(dep =>
            path.join('node_modules', dep, 'package.json')
          )
        );
      })
      // filter by glob or selection
      .then(packageJsonPaths => {
        if ((packageGlob || typeof packages === 'boolean') && !options.fullTree) {
          return Promise.resolve(
            (packageJsonPaths || []).filter(p =>
              Object.keys(tld || []).includes(p.split('/').slice(-2)[0])
            )
          );
        }
        if (Array.isArray(packages)) {
          return Promise.resolve(
            (packageJsonPaths || []).filter(p => packages.includes(p.split('/').slice(-2)[0]))
          );
        }
        return Promise.resolve(packageJsonPaths);
      })
      .then(paths =>
        Promise.all([
          paths,
          Promise.all(paths.map(filePath => utils.getPackageJsonByPath(filePath))),
        ])
      )
      // conglomerate the data
      .then(result => {
        const paths = result[0];
        const files = result[1];

        return files.reduce((acc, d, idx) => {
          // if the file is a test stub, or doesn't have a name, ignore it.
          if (!d || !d.name) return acc;
          // create object if its not already created
          if (!acc[d.name]) acc[d.name] = {};
          // set duplicates if flag set, if version not already there, && !== installed
          if (options.duplicates) {
            if (acc[d.name].installed && acc[d.name].installed !== d.version) {
              utils.uniq(
                (acc[d.name].duplicates = (acc[d.name].duplicates || []).concat(d.version))
              );
            }
          }
          // set the installed version, if its installed top level
          if ((paths[idx].match(/node_modules/g) || []).length === 1)
            acc[d.name].installed = d.version;
          // if it is a top level dependency, get the wanted version
          if (tld[d.name]) acc[d.name].wanted = tld[d.name];
          return acc;
        }, {});
      })
      .then(versions => {
        if (options.showNotFound) {
          packages.forEach(p => {
            if (!versions[p]) {
              versions[p] = 'Not Found';
            }
          });
        }
        return versions;
      })
      .then(versions => utils.sortObject(versions)),
  ]);
}

function getnpmGlobalPackages(packages, options) {
  utils.log('trace', 'getnpmGlobalPackages', packages);

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
  } else if (!Array.isArray(packages)) {
    packages = true;
  }

  return Promise.all([
    'npmGlobalPackages',
    utils
      // get the location of the npm global node_modules
      .run('npm get prefix --global')
      // glob all of the package.json files in that directory
      .then(
        prefix =>
          new Promise((resolve, reject) =>
            glob(
              // sub packageGlob in to only get globbed packages if not null
              path.join(prefix, 'lib', 'node_modules', packageGlob || '*', 'package.json'),
              (err, files) => {
                if (!err) resolve(files);
                reject(err);
              }
            )
          )
      )
      .then(globResults =>
        Promise.all(
          globResults
            // filter out package paths not in list provided in options
            .filter(
              globbedPath =>
                typeof packages === 'boolean' ||
                packageGlob !== null ||
                packages.includes(globbedPath.split('/').slice(-2)[0])
            )
            // get all the package.json by path, return promises
            .map(packageJson => utils.getPackageJsonByFullPath(packageJson))
        )
      )
      // accumulate all the package info in one object.
      .then(allPackages =>
        allPackages.reduce(
          (acc, json) => (json ? Object.assign(acc, { [json.name]: json.version }) : acc),
          {}
        )
      )
      .then(versions => {
        if (options.showNotFound) {
          packages.forEach(p => {
            if (!versions[p]) {
              versions[p] = 'Not Found';
            }
          });
        }
        return versions;
      }),
  ]);
}

module.exports = {
  getnpmPackages: getnpmPackages,
  getnpmGlobalPackages: getnpmGlobalPackages,
};
