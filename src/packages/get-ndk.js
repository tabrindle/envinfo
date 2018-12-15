const fs = require('fs');
const path = require('path');

function getNdkVersionFromPath(ndkDir) {
  const metaPath = path.join(ndkDir, 'source.properties');
  if (fs.existsSync(metaPath)) {
    const contents = fs.readFileSync(metaPath).toString();
    const split = contents.split('\n');
    for (let i = 0; i < split.length; i += 1) {
      const splits = split[i].split('=');
      if (splits.length === 2) {
        if (splits[0].trim() === 'Pkg.Revision') {
          return splits[1].trim();
        }
      }
    }
  }

  return undefined;
}

function getNdk() {
  if (process.env.ANDROID_NDK) {
    return getNdkVersionFromPath(process.env.ANDROID_NDK);
  }

  if (process.env.ANDROID_HOME) {
    return getNdkVersionFromPath(path.join(process.env.ANDROID_HOME, 'ndk-bundle'));
  }

  return undefined;
}

exports.getNdk = getNdk;
