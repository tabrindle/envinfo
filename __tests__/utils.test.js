const utils = require('../src/utils');
const cases = {
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
};

describe('Matching version strings against real world cases', () => {
  Object.keys(cases).map(c =>
    test(`${c} returns expected version`, () =>
      expect(utils.findVersion(cases[c].string, cases[c].regex, cases[c].index)).toEqual(
        cases[c].version
      ))
  );
});

describe('Extracting info from sdkmanager', () => {
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
