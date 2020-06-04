const utils = require('../utils');

module.exports = {
  getBashInfo: () => {
    utils.log('trace', 'getBashInfo');
    return Promise.all([
      utils.run('bash --version').then(utils.findVersion),
      utils.which('bash'),
    ]).then(v => utils.determineFound('Bash', v[0], v[1]));
  },

  getElixirInfo: () => {
    utils.log('trace', 'getElixirInfo');
    return Promise.all([
      utils
        .run('elixir --version')
        .then(v => utils.findVersion(v, /[Elixir]+\s([\d+.[\d+|.]+)/, 1)),
      utils.which('elixir'),
    ]).then(v => Promise.resolve(utils.determineFound('Elixir', v[0], v[1])));
  },

  getErlangInfo: () => {
    utils.log('trace', 'getErlangInfo');
    return Promise.all([
      utils
        // https://stackoverflow.com/a/34326368
        .run(
          `erl -eval "{ok, Version} = file:read_file(filename:join([code:root_dir(), 'releases', erlang:system_info(otp_release), 'OTP_VERSION'])), io:fwrite(Version), halt()." -noshell`
        )
        .then(utils.findVersion),
      utils.which('erl'),
    ]).then(v => Promise.resolve(utils.determineFound('Erlang', v[0], v[1])));
  },

  getGoInfo: () => {
    utils.log('trace', 'getGoInfo');
    return Promise.all([
      utils.run('go version').then(utils.findVersion),
      utils.which('go'),
    ]).then(v => utils.determineFound('Go', v[0], v[1]));
  },

  getJavaInfo: () => {
    utils.log('trace', 'getJavaInfo');
    return Promise.all([
      utils
        .run('javac -version', { unify: true })
        .then(v => utils.findVersion(v, /\d+\.[\w+|.|_|-]+/)),
      utils.run('which javac'),
    ]).then(v => utils.determineFound('Java', v[0], v[1]));
  },

  getPerlInfo: () => {
    utils.log('trace', 'getPerlInfo');
    return Promise.all([
      utils.run('perl -v').then(utils.findVersion),
      utils.which('perl'),
    ]).then(v => utils.determineFound('Perl', v[0], v[1]));
  },

  getPHPInfo: () => {
    utils.log('trace', 'getPHPInfo');
    return Promise.all([utils.run('php -v').then(utils.findVersion), utils.which('php')]).then(v =>
      utils.determineFound('PHP', v[0], v[1])
    );
  },

  getProtocInfo: () => {
    utils.log('trace', 'getProtocInfo');
    return Promise.all([
      utils.run('protoc --version').then(utils.findVersion),
      utils.run('which protoc'),
    ]).then(v => utils.determineFound('Protoc', v[0], v[1]));
  },

  getPythonInfo: () => {
    utils.log('trace', 'getPythonInfo');
    return Promise.all([
      utils.run('python -V 2>&1').then(utils.findVersion),
      utils.run('which python'),
    ]).then(v => utils.determineFound('Python', v[0], v[1]));
  },

  getPython3Info: () => {
    utils.log('trace', 'getPython3Info');
    return Promise.all([
      utils.run('python3 -V 2>&1').then(utils.findVersion),
      utils.run('which python3'),
    ]).then(v => utils.determineFound('Python3', v[0], v[1]));
  },

  getRInfo: () => {
    utils.log('trace', 'getRInfo');
    return Promise.all([
      utils.run('R --version', { unify: true }).then(utils.findVersion),
      utils.which('R'),
    ]).then(v => utils.determineFound('R', v[0], v[1]));
  },

  getRubyInfo: () => {
    utils.log('trace', 'getRubyInfo');
    return Promise.all([
      utils.run('ruby -v').then(utils.findVersion),
      utils.which('ruby'),
    ]).then(v => utils.determineFound('Ruby', v[0], v[1]));
  },

  getRustInfo: () => {
    utils.log('trace', 'getRustInfo');
    return Promise.all([
      utils.run('rustc --version').then(utils.findVersion),
      utils.run('which rustc'),
    ]).then(v => utils.determineFound('Rust', v[0], v[1]));
  },

  getScalaInfo: () => {
    utils.log('trace', 'getScalaInfo');
    if (utils.isMacOS || utils.isLinux) {
      return Promise.all([
        utils.run('scalac -version').then(utils.findVersion),
        utils.run('which scalac'),
      ]).then(v => utils.determineFound('Scala', v[0], v[1]));
    }
    return Promise.resolve(['Scala', 'N/A']);
  },
};
