const packages = require('../packages');
const utils = require('../utils');

const binaries = require('./binaries');
const browsers = require('./browsers');
const databases = require('./databases');
const ides = require('./ides');
const languages = require('./languages');
const sdks = require('./sdks');
const servers = require('./servers');
const system = require('./system');
const utilities = require('./utilities');
const virtualization = require('./virtualization');

module.exports = Object.assign({}, utils, packages, {
  ...binaries,
  ...browsers,
  ...databases,
  ...ides,
  ...languages,
  ...sdks,
  ...servers,
  ...system,
  ...utilities,
  ...virtualization,
});
