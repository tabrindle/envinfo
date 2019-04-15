const utils = require('../utils');

module.exports = {
  getMongoDBInfo: () => {
    utils.log('trace', 'getMongoDBInfo');
    return Promise.all([
      utils.run('mongo --version').then(utils.findVersion),
      utils.which('mongo'),
    ]).then(v => utils.determineFound('MongoDB', v[0], v[1]));
  },

  getMySQLInfo: () => {
    utils.log('trace', 'getMySQLInfo');
    return Promise.all([
      utils
        .run('mysql --version')
        .then(v => `${utils.findVersion(v, null, 1)}${v.includes('MariaDB') ? ' (MariaDB)' : ''}`),
      utils.which('mysql'),
    ]).then(v => utils.determineFound('MySQL', v[0], v[1]));
  },

  getPostgreSQLInfo: () => {
    utils.log('trace', 'getPostgreSQLInfo');
    return Promise.all([
      utils.run('postgres --version').then(utils.findVersion),
      utils.which('postgres'),
    ]).then(v => utils.determineFound('PostgreSQL', v[0], v[1]));
  },

  getSQLiteInfo: () => {
    utils.log('trace', 'getSQLiteInfo');
    return Promise.all([
      utils.run('sqlite3 --version').then(utils.findVersion),
      utils.which('sqlite3'),
    ]).then(v => utils.determineFound('SQLite', v[0], v[1]));
  },
};
