const utils = require('../src/utils');
const cases = {
  apt: {
    string: 'apt 1.4.9 (amd64)',
    version: '1.4.9',
  },
  cargo: {
    string: 'cargo 1.31.0 (339d9f9c8 2018-11-16)',
    version: '1.31.0',
  },
  composer: {
    string: '\u001b[32mComposer\u001b[39m version \u001b[33m1.8.6\u001b[39m 2019-06-11 15:03:05',
    version: '1.8.6',
  },
  gradle: {
    string: '---------------------\nGradle 5.5\n---------------------',
    version: '5.5',
  },
  homebrew: {
    string:
      'Homebrew 2.1.7\nHomebrew/homebrew-core (git revision 3507d; last commit 2019-07-08)\nHomebrew/homebrew-cask (git revision 983c4; last commit 2019-07-08)',
    version: '2.1.7',
  },
  maven: {
    string:
      'Apache Maven 3.6.1 (d66c9c0b3152b2e69ee9bac180bb8fcc8e6af555; 2019-04-04T15:00:29-04:00)',
    version: '3.6.1',
  },
  pip: {
    string: 'pip 19.0.3 from /usr/local/lib/python2.7/site-packages/pip (python 2.7)',
    version: '19.0.3',
  },
  yum: {
    string: '3.4.3\n  Installed: rpm-4.11.3-35.el7.x86_64 at 2019-03-05 17:35\n',
    version: '3.4.3',
  },
  ash: {
    string: `
    BusyBox v1.31.1 () multi-call binary.

    Usage: ash [-/+OPTIONS] [-/+o OPT]... [-c 'SCRIPT' [ARG0 [ARGS]] / FILE [ARGS] / -s [ARGS]]`,
    version: '1.31.1',
  },
  bash: {
    string: 'GNU bash, version 4.4.12(1)-release (x86_64-apple-darwin17.0.0)',
    version: '4.4.12',
  },
  php: {
    string: 'PHP 7.1.7 (cli) (built: Jul 15 2017 18:08:09) ( NTS )',
    version: '7.1.7',
  },
  docker: {
    string: 'Docker version 18.03.0-ce, build 0520e24',
    version: '18.03.0',
  },
  edge: {
    string: `
    Name              : Microsoft.MicrosoftEdge
    Version           : 20.10240.17146.0
    PackageFullName   : Microsoft.MicrosoftEdge_20.10240.17146.0_neutral__8wekyb3d8bbwe
    InstallLocation   : C:\Windows\SystemApps\Microsoft.MicrosoftEdge_8wekyb3d8bbwe
    PackageFamilyName : Microsoft.MicrosoftEdge_8wekyb3d8bbwe
    PublisherId       : 8wekyb3d8bbwe`,
    version: '20.10240.17146.0',
  },
  elixir: {
    regex: /[Elixir]+\s([\d+.[\d+|.]+)/,
    index: 1,
    string: `Erlang/OTP 20 [erts-9.2.1] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:10] [hipe] [kernel-poll:false] [dtrace]
  Elixir 1.6.2 (compiled with OTP 20)`,
    version: '1.6.2',
  },
  explorer: {
    string: `Version
    11.0.10240.17443`,
    version: '11.0.10240.17443',
  },
  ffmpeg: {
    string: `ffmpeg version 4.2 Copyright (c) 2000-2019 the FFmpeg developers
built with gcc 9.1.1 (GCC) 20190807`,
    version: '4.2',
  },
  go: {
    string: 'go version go1.9.3 darwin/amd64',
    version: '1.9.3',
  },
  java: {
    regex: /\d+\.[\w+|.|_|-]+/,
    string: 'javac 1.8.0_192-b12',
    version: '1.8.0_192-b12',
  },
  R: {
    string: `R version 3.0.2 (2013-09-25) -- "Frisbee Sailing"
Copyright (C) 2013 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu (64-bit)

R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under the terms of the
GNU General Public License versions 2 or 3.
For more information about these matters see
http://www.gnu.org/licenses/.
`,
    version: '3.0.2',
  },
  mariadb: {
    index: 1,
    string: 'mysql  Ver 15.1 Distrib 10.2.14-MariaDB, for osx10.13 (x86_64) using readline 5.1',
    version: '10.2.14',
  },
  mongodb: {
    string: `MongoDB shell version v3.6.4
    git version: d0181a711f7e7f39e60b5aeb1dc7097bf6ae5856
    OpenSSL version: OpenSSL 1.0.2o  27 Mar 2018`,
    version: '3.6.4',
  },
  mysql: {
    index: 1,
    string: 'mysql  Ver 14.14 Distrib 5.7.21, for osx10.13 (x86_64) using  EditLine wrapper',
    version: '5.7.21',
  },
  postgres: {
    string: 'postgres (PostgreSQL) 10.3',
    version: '10.3',
  },
  ruby: {
    regex: /\d+\.[\d+|.|p]+/,
    string: 'ruby 2.3.7p456 (2018-03-28 revision 63024) [universal.x86_64-darwin18]',
    version: '2.3.7p456',
  },
  rust: {
    string: 'rustc 1.31.1 (b6c32da9b 2018-12-18)',
    version: '1.31.1',
  },
  cursorAgent: {
    string: '2026.06.02-8c11d9f',
    regex: /\d+\.\d+\.\d+(?:-[0-9a-z]+)?/i,
    version: '2026.06.02-8c11d9f',
  },
  gh: {
    string: 'gh version 2.100.0 (2026-09-03)\nhttps://github.com/cli/cli/releases/tag/v2.100.0',
    version: '2.100.0',
  },
  glab: {
    string: 'glab 1.62.0 (f4b5a2c8)',
    version: '1.62.0',
  },
  ripgrep: {
    string: 'ripgrep 14.1.1 (rev 4649aa9700)',
    version: '14.1.1',
  },
  sqlite: {
    string:
      '3.19.4 2017-08-18 19:28:12 605907e73adb4533b12d22be8422f17a8dc125b5c37bb391756a11fc3a8c4d10',
    version: '3.19.4',
  },
  clang: {
    string: `clang version 7.0.0-3 (tags/RELEASE_700/final)
Target: x86_64-pc-linux-gnu
Thread model: posix
InstalledDir: /usr/bin`,
    regex: /([0-9].*) /,
    index: 1,
    version: '7.0.0-3',
  },
  sublime: {
    regex: /\d+/,
    string: 'Sublime Text Build 3143',
    version: '3143',
  },
  virtualbox: {
    string: '5.2.8r121009',
    version: '5.2.8',
  },
  xcodebuild: {
    string: `Xcode 9.0
  Build version 9A235`,
    version: '9.0',
  },
  glibc: {
    string: `ldd (Ubuntu GLIBC 2.30-0ubuntu2) 2.30`,
    version: '2.30'
  }
};

describe('findVersion - Matching version strings against real world cases', () => {
  Object.keys(cases).map(c =>
    test(`${c} returns expected version`, () =>
      expect(utils.findVersion(cases[c].string, cases[c].regex, cases[c].index)).toEqual(
        cases[c].version
      ))
  );
});

describe('parseSDKManagerOutput - Extracting info from sdkmanager', () => {
  test('reads the | separated table of the legacy sdkmanager', () => {
    const output = `
    Path                                                                              | Version | Description                                     | Location
    -------                                                                           | ------- | -------                                         | -------
    build-tools;28.0.3                                                                | 28.0.3  | Android SDK Build-Tools 28.0.3                  | build-tools/28.0.3/
    platform-tools                                                                    | 28.0.1  | Android SDK Platform-Tools                      | platform-tools/
    platforms;android-28                                                              | 6       | Android SDK Platform 28                         | platforms/android-28/
    sources;android-28                                                                | 1       | Sources for Android 28                          | sources/android-28/
    system-images;android-28;google_apis_playstore;x86                                | 5       | Google Play Intel x86 Atom System Image         | system-images/android-28/google_apis_playstore/x86/
    tools                                                                             | 26.1.1  | Android SDK Tools                               | tools/

  Available Packages:
  `;

    expect(utils.parseSDKManagerOutput(output)).toEqual({
      apiLevels: ['28'],
      buildTools: ['28.0.3'],
      systemImages: ['android-28 | Google Play Intel x86 Atom'],
    });
  });

  test('reads minor API levels, SDK extensions and preview build tools from the legacy sdkmanager', () => {
    const output = [
      'Installed packages:',
      '  Path                       | Version | Description                    | Location',
      '  -------                    | ------- | -------                        | -------',
      '  build-tools;36.0.0-rc1     | 36.0.0 rc1 | Android SDK Build-Tools 36-rc1 | build-tools/36.0.0-rc1',
      '  platforms;android-35       | 2       | Android SDK Platform 35        | platforms/android-35',
      '  platforms;android-35-ext14 | 1       | Android SDK Platform 35-ext14  | platforms/android-35-ext14',
      '  platforms;android-36.1     | 1       | Android SDK Platform 36.1      | platforms/android-36.1',
    ].join('\n');

    expect(utils.parseSDKManagerOutput(output)).toEqual({
      apiLevels: ['35', '36.1'],
      buildTools: ['36.0.0-rc1'],
      systemImages: [],
    });
  });

  test('skips lines of the legacy sdkmanager that are not table rows', () => {
    const output = [
      "Warning: Observed package id 'system-images;android-30;google_apis;x86' in inconsistent location '/sdk/system-images/android-30/google_apis/x86-2' (Expected '/sdk/system-images/android-30/google_apis/x86')",
      'Installed packages:',
      '  Path                                     | Version | Description                    | Location',
      '  -------                                  | ------- | -------                        | -------',
      '  system-images;android-30;google_apis;x86 | 9       | Google APIs Intel x86 Atom System Image | system-images/android-30/google_apis/x86-2',
    ].join('\n');

    expect(utils.parseSDKManagerOutput(output)).toEqual({
      apiLevels: [],
      buildTools: [],
      systemImages: ['android-30 | Google APIs Intel x86 Atom'],
    });
  });

  test('reads the installed packages table from Android CLI', () => {
    const output = [
      'Installed packages:',
      '\u001b[32m  build-tools/36.0.0  36.0.0  Android SDK Build-Tools 36\u001b[39m\u001b[0m',
      '\u001b[32m  platforms/android-36.1  2.0.0  Android SDK Platform 36.1\u001b[0m',
      '\u001b[33m  system-images/android-26/google_apis/x86_64  15.0.0  ->  16.0.0  Google APIs Intel x86_64 Atom System Image\u001b[0m',
      'Available packages:',
      '  build-tools/37.0.0  37.0.0  Android SDK Build-Tools 37',
      '  platforms/android-37  1.0.0  Android SDK Platform 37',
    ].join('\r\n');

    expect(utils.parseSDKManagerOutput(output)).toEqual({
      apiLevels: ['36.1'],
      buildTools: ['36.0.0'],
      systemImages: ['android-26 | Google APIs Intel x86_64 Atom'],
    });
  });

  test('reads the sdkmanager --list of the command-line tools 23.0', () => {
    // Rows from the list attached to #308, with less padding.
    const output = [
      'Installed packages:',
      '\u001b[32m  build-tools/35.0.0                                         35.0.0          Android SDK Build-Tools 35                                  \u001b[39m\u001b[0m',
      '\u001b[32m  build-tools/36.1.0                                         36.1.0          Android SDK Build-Tools 36.1                                \u001b[39m\u001b[0m',
      '\u001b[32m  cmake/3.22.1                                               3.22.1          CMake 3.22.1                                                \u001b[39m\u001b[0m',
      '\u001b[32m  ndk/27.0.12077973                                          27.0.12077973   NDK (Side by side) 27.0.12077973                            \u001b[39m\u001b[0m',
      '\u001b[33m  platform-tools                                             36.0.2   ->  37.0.1  Android SDK Platform-Tools                          \u001b[39m\u001b[0m',
      '\u001b[32m  platforms/android-33                                       3.0.0           Android SDK Platform 33                                     \u001b[39m\u001b[0m',
      '\u001b[32m  platforms/android-35                                       2.0.0           Android SDK Platform 35                                     \u001b[39m\u001b[0m',
      '\u001b[32m  platforms/android-35-ext14                                 1.0.0           Android SDK Platform 35-ext14                               \u001b[39m\u001b[0m',
      '\u001b[32m  platforms/android-35-ext15                                 1.0.0           Android SDK Platform 35-ext15                               \u001b[39m\u001b[0m',
      '\u001b[32m  platforms/android-37.0                                     2.0.0           Android SDK Platform 37.0                                   \u001b[39m\u001b[0m',
      '\u001b[32m  sources/android-35                                         1.0.0           Sources for Android 35                                      \u001b[39m\u001b[0m',
      '\u001b[32m  system-images/android-26/google_apis/x86_64                16.0.0          Google APIs Intel x86_64 Atom System Image                  \u001b[39m\u001b[0m',
      '\u001b[32m  system-images/android-36.1/google_apis_playstore/x86_64    4.0.0           Google Play Intel x86_64 Atom System Image                  \u001b[39m\u001b[0m',
      '\u001b[32m  system-images/android-36.1/google_apis_playstore_ps16k/x86_64  4.0.0      16 KB Page Size Google Play Intel x86_64 Atom System Image  \u001b[39m\u001b[0m',
      'Available packages:',
      '  add-ons/addon-google_apis-google-10                        2.0.0           Google APIs                                                 ',
      '  platforms/android-38                                       1.0.0           Android SDK Platform 38                                     ',
    ].join('\n');

    expect(utils.parseSDKManagerOutput(output)).toEqual({
      apiLevels: ['33', '35', '37.0'],
      buildTools: ['35.0.0', '36.1.0'],
      systemImages: [
        'android-26 | Google APIs Intel x86_64 Atom',
        'android-36.1 | Google Play Intel x86_64 Atom',
        'android-36.1 | 16 KB Page Size Google Play Intel x86_64 Atom',
      ],
    });
  });

  test('reads Android CLI rows without colors, with updates and with other escape sequences', () => {
    const output = [
      'Installed packages:',
      '\u001b[2K\u001b[32m  build-tools/36.0.0  35.0.0  ->  36.0.0  Android SDK Build-Tools 36\u001b(B\u001b[m',
      '  platforms/android-36  1.0.0  ->  2.0.0  Android SDK Platform 36',
      '\u001b]0;sdkmanager\u0007  system-images/android-28/google_apis/x86_64  11.0.0    ',
      '  system-images/android-26/google_apis/x86_64  16.0.0',
    ].join('\n');

    expect(utils.parseSDKManagerOutput(output)).toEqual({
      apiLevels: ['36'],
      buildTools: ['36.0.0'],
      systemImages: ['android-28 | google_apis/x86_64', 'android-26 | google_apis/x86_64'],
    });
  });

  test('returns empty lists for empty output', () => {
    expect(utils.parseSDKManagerOutput('')).toEqual({
      apiLevels: [],
      buildTools: [],
      systemImages: [],
    });
  });
});

describe('generatePlistBuddyCommand', () => {
  test('default options array', () => {
    expect(utils.generatePlistBuddyCommand('/Applications/Firefox.app')).toBe(
      '/usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString /Applications/Firefox.app'
    );
  });

  test('options array argument', () => {
    expect(
      utils.generatePlistBuddyCommand('/Applications/Firefox.app', [
        'CFBundleShortVersionString',
        'CFBundleVersion',
      ])
    ).toBe(
      '/usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString -c Print:CFBundleVersion /Applications/Firefox.app'
    );
  });
});

describe('toReadableBytes', () => {
  test('formats bytes correctly', () => {
    expect(utils.toReadableBytes(1337)).toBe('1.31 KB');
  });

  test('handles falsy value for bytes', () => {
    expect(utils.toReadableBytes()).toBe('0 Bytes');
  });
});

describe('omit', () => {
  test('emits properties from object', () => {
    expect(utils.omit({ one: true, two: true }, ['two'])).toEqual({ one: true });
  });
});

describe('pick', () => {
  test('picks properties from object', () => {
    expect(utils.pick({ one: true, two: true }, ['two'])).toEqual({ two: true });
  });
});

describe('compareVersions', () => {
  test('orders simple versions', () => {
    expect(utils.compareVersions('2022.3', '2025.2')).toBeLessThan(0);
    expect(utils.compareVersions('2025.2', '2022.3')).toBeGreaterThan(0);
    expect(utils.compareVersions('2025.2', '2025.2')).toBe(0);
  });

  test('compares segment by segment, not lexicographically', () => {
    expect(utils.compareVersions('4.10', '4.9')).toBeGreaterThan(0);
    expect(utils.compareVersions('2022.3.1.18', '2022.3.1.8')).toBeGreaterThan(0);
  });

  test('treats missing trailing segments as zero', () => {
    expect(utils.compareVersions('2025.2', '2025.2.0')).toBe(0);
    expect(utils.compareVersions('2025.2.1', '2025.2')).toBeGreaterThan(0);
  });

  test('handles Android Studio version with build number suffix', () => {
    expect(
      utils.compareVersions('2025.2 AI-252.25557.131.2521.14432022', '2022.3 AI-223.8836.35.2231.10811636')
    ).toBeGreaterThan(0);
  });

  test('sorts a list newest-last', () => {
    const versions = ['2022.3', '2025.2', '4.1'];
    expect([...versions].sort(utils.compareVersions)).toEqual(['4.1', '2022.3', '2025.2']);
  });
});
