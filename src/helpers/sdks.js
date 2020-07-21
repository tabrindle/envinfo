const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
  getAndroidSDKInfo: () => {
    return utils
      .run('sdkmanager --list')
      .then(output => {
        if (!output && process.env.ANDROID_HOME)
          return utils.run(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager --list`);
        return output;
      })
      .then(output => {
        if (!output && process.env.ANDROID_HOME)
          return utils.run(
            `${process.env.ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --list`
          );
        return output;
      })
      .then(output => {
        if (!output && utils.isMacOS)
          return utils.run('~/Library/Android/sdk/tools/bin/sdkmanager --list');
        return output;
      })
      .then(output => {
        const sdkmanager = utils.parseSDKManagerOutput(output);
        const getNdkVersionFromPath = ndkDir => {
          const metaPath = path.join(ndkDir, 'source.properties');
          let contents;
          try {
            contents = fs.readFileSync(metaPath, 'utf8');
          } catch (err) {
            if (err.code === 'ENOENT') {
              return undefined;
            }
            throw err;
          }

          const split = contents.split('\n');
          for (let i = 0; i < split.length; i += 1) {
            const splits = split[i].split('=');
            if (splits.length === 2) {
              if (splits[0].trim() === 'Pkg.Revision') {
                return splits[1].trim();
              }
            }
          }
          return undefined;
        };

        const getNdk = () => {
          if (process.env.ANDROID_NDK) {
            return getNdkVersionFromPath(process.env.ANDROID_NDK);
          }

          if (process.env.ANDROID_NDK_HOME) {
            return getNdkVersionFromPath(process.env.ANDROID_NDK_HOME);
          }

          if (process.env.ANDROID_HOME) {
            return getNdkVersionFromPath(path.join(process.env.ANDROID_HOME, 'ndk-bundle'));
          }

          return undefined;
        };
        const ndkVersion = getNdk();

        if (
          sdkmanager.buildTools.length ||
          sdkmanager.apiLevels.length ||
          sdkmanager.systemImages.length ||
          ndkVersion
        )
          return Promise.resolve([
            'Android SDK',
            {
              'API Levels': sdkmanager.apiLevels || utils.NotFound,
              'Build Tools': sdkmanager.buildTools || utils.NotFound,
              'System Images': sdkmanager.systemImages || utils.NotFound,
              'Android NDK': ndkVersion || utils.NotFound,
            },
          ]);
        return Promise.resolve(['Android SDK', utils.NotFound]);
      });
  },

  getiOSSDKInfo: () => {
    if (utils.isMacOS) {
      return utils
        .run('xcodebuild -showsdks')
        .then(sdks => sdks.match(/[\w]+\s[\d|.]+/g))
        .then(utils.uniq)
        .then(platforms =>
          platforms.length ? ['iOS SDK', { Platforms: platforms }] : ['iOS SDK', utils.NotFound]
        );
    }
    return Promise.resolve(['iOS SDK', 'N/A']);
  },

  getWindowsSDKInfo: () => {
    let info;
    if (utils.isWindows) {
      return utils
        .run('reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock')
        .then(out => {
          const devModeLines = out
            .split(/[\r\n]/g)
            .slice(1)
            .filter(x => x !== '');
          const devModeMap = devModeLines.reduce((m, o) => {
            const values = o.match(/[^\s]+/g);
            m[values[0]] = values[2];
            return m;
          }, {});
          info = devModeMap;
          try {
            const versions = fs.readdirSync(
              `${process.env['ProgramFiles(x86)']}/Windows Kits/10/Platforms/UAP`
            );
            info.Versions = versions;
          } catch (_) {
            // None found
          }
          return Promise.resolve(['Windows SDK', info]);
        });
    }
    return Promise.resolve(['Windows SDK', utils.NotFound]);
  },
};
