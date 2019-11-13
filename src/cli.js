const argv = require('minimist')(process.argv.slice(2));
const version = global.__VERSION__ || ''; // eslint-disable-line

argv.console = true;

if (argv.help || argv._.indexOf('help') > -1) {
  // eslint-disable-next-line
  console.log(`
  ,,',                                  ,,             ,,,,,,           ,',,
 ,,,                                                  ,,,                  ,,,
 ,,       ,,,,,    ,,,,,,   ,,,     ,,  ,,  .,,,,,,   ,,,,,,,   ,,,,,       ,,
 ,,     ,,    ,,  ,,,   ,,,  ,,    ,,,  ,,  ,,,   ,,, ,,      ,,,   ,,,     ,,
 ,,,   ,,     .,, ,,,    ,,  ,,,   ,,   ,,  ,,,    ,, ,,     ,,      ,,     ,,,
 ,,    ,,,,,,,,,, ,,,    ,,   ,,  ,,    ,,  ,,,    ,, ,,     ,,      ,,     ,,
 ,,    ,,,        ,,,    ,,    ,,,,,    ,,  ,,,    ,, ,,     ,,,    ,,,     ,,
 ,,      ,,,,,,,  ,,,    ,,     ,,,     ,,  ,,,    ,, ,,       ,,,,,,,      ,,
 ,,,                                                                       ,,,
  ,,,'                                                                  ',,,

  VERSION: ${version}

  USAGE:

    \`envinfo\` || \`npx envinfo\`

  OPTIONS:

    --system               Print general system info such as OS, CPU, Memory and Shell
    --browsers             Get version numbers of installed web browsers
    --SDKs                 Get platforms, build tools and SDKs of iOS and Android
    --IDEs                 Get version numbers of installed IDEs
    --languages            Get version numbers of installed languages such as Java, Python, PHP, etc
    --managers             Get version numbers of installed package/dependency managers
    --monorepos            Get monorepo tools
    --binaries             Get version numbers of node, npm, watchman, etc
    --npmPackages          Get version numbers of locally installed npm packages - glob, string, or comma delimited list
    --npmGlobalPackages    Get version numbers of globally installed npm packages

    --duplicates           Mark duplicate npm packages inside parentheses eg. (2.1.4)
    --fullTree             Traverse entire node_modules dependency tree, not just top level

    --markdown             Print output in markdown format
    --json                 Print output in JSON format
    --console              Print to console (defaults to on for CLI usage, off for programmatic usage)
    --showNotFound         Don't filter out values marked 'Not Found'
    --title                Give your report a top level title ie 'Environment Report'

    --clipboard            *Removed - use clipboardy or clipboard-cli directly*
  `);
} else if (argv.version || argv.v || argv._.indexOf('version') > -1) {
  console.log(version); // eslint-disable-line no-console
} else {
  require('./envinfo').cli(argv); // eslint-disable-line global-require
}
