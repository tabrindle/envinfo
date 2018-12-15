import * as fs from 'fs';
import * as path from 'path';

export function getNdk() {
  if (process.env.ANDROID_NDK) {
    return getNdkVersionFromPath(process.env.ANDROID_NDK)
  }

  if (process.env.ANDROID_HOME) {
    return getNdkVersionFromPath(path.join(process.env.ANDROID_HOME, 'ndk-bundle'));
  }

  return undefined
}

export function getNdkVersionFromPath(ndkDir) {
  const metaPath = path.join(ndkDir, 'source.properties')
  if (fs.existsSync(metaPath)) {
    const contents = fs.readFileSync(metaPath).toString();
    const split = contents.split("\n");
    for (const i of split) {
      const splits = i.split('=');
      if (splits.length === 2) {
        if (splits[0].trim() === 'Pkg.Revision') {
          return splits[1].trim();
        }
      }
    }
  }

  return undefined
}
