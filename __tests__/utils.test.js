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
  const sdkmanager = utils.parseSDKManagerOutput(output);

  expect(sdkmanager.apiLevels).toEqual(['28']);
  expect(sdkmanager.buildTools).toEqual(['28.0.3']);
  expect(sdkmanager.systemImages).toEqual(['android-28 | Google Play Intel x86 Atom']);
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
