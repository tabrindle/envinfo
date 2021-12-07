import binaries from './binaries.js';
import browsers from './browsers.js';
import databases from './databases.js';
import ides from './ides.js';
import languages from './languages.js';
import managers from './managers.js';
import monorepos from './monorepos.js';
import packages from '../packages.js';
import sdks from './sdks.js';
import servers from './servers.js';
import system from './system.js';
import utilities from './utilities.js';
import utils from '../utils.js';
import virtualization from './virtualization.js';

export default Object.assign({}, utils, packages, {
  ...binaries,
  ...browsers,
  ...databases,
  ...ides,
  ...languages,
  ...managers,
  ...monorepos,
  ...sdks,
  ...servers,
  ...system,
  ...utilities,
  ...virtualization,
});
