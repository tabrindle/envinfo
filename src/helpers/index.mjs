import binaries from './binaries.mjs';
import browsers from './browsers.mjs';
import databases from './databases.mjs';
import ides from './ides.mjs';
import languages from './languages.mjs';
import managers from './managers.mjs';
import monorepos from './monorepos.mjs';
import packages from '../packages.mjs';
import sdks from './sdks.mjs';
import servers from './servers.mjs';
import system from './system.mjs';
import utilities from './utilities.mjs';
import utils from '../utils.mjs';
import virtualization from './virtualization.mjs';

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
