// Usage checks for index.d.ts: valid calls compile, invalid ones carry @ts-expect-error.
import envinfo, { cli, helpers, main, run } from '..';
import type { CategoryItems, HelperResult, RunConfig } from '..';
import type { Equal, Expect } from './utils';

// The README example, with a default import.
const report = envinfo.run(
  {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: ['Chrome', 'Firefox', 'Safari'],
    npmPackages: ['styled-components', 'babel-plugin-styled-components'],
  },
  { json: true, showNotFound: true }
);
type _report = Expect<Equal<typeof report, Promise<string>>>;

// Category items are checked by name.
run({ Utilities: ['gh', 'glab', 'ripgrep', 'Git LFS'], IDEs: ['Nvim', 'Claude Code'] });
// @ts-expect-error item names are case-sensitive
run({ Utilities: ['Ripgrep'] });
// @ts-expect-error items belong to a single category
run({ Utilities: ['Chrome'] });
// @ts-expect-error unknown category
run({ Utility: ['gh'] });
type _utilities = Expect<Equal<Extract<CategoryItems['Utilities'], 'gh' | 'glab'>, 'gh' | 'glab'>>;

// Readonly arrays are accepted.
const system = ['OS', 'CPU'] as const;
run({ System: system });

// Package queries.
run({ npmPackages: true, npmGlobalPackages: '*webpack*', pnpmGlobalPackages: ['typescript'] });
// @ts-expect-error not a package query
run({ npmPackages: 1 });

// Presets.
run({ preset: 'jest' });
// @ts-expect-error unknown preset
run({ preset: 'vite' });
const config: RunConfig = { preset: 'react-native' };
run(config, { markdown: true });

// Options, including explicit undefined under exactOptionalPropertyTypes.
run({}, { json: undefined, title: 'Environment Report', fullTree: true, duplicates: true });
// @ts-expect-error json is a boolean
run({}, { json: 'yes' });
// @ts-expect-error unknown option
run({}, { jsonn: true });

// main() requires a config; an empty one collects every default category.
type _main = Expect<Equal<ReturnType<typeof main>, Promise<string>>>;
main({});
// @ts-expect-error config is required
main();

// cli() mirrors the command line flags.
cli({ all: true, json: true });
cli({ system: true, ides: true, npmPackages: 'react,react-native' });
cli({ raw: '{"System":["OS"]}' });
cli({ helper: 'Node' });
cli({ preset: 'react-native', duplicates: true });
// @ts-expect-error raw is a JSON string
cli({ raw: true });
type _cli = Expect<Equal<ReturnType<typeof cli>, Promise<string> | Promise<void> | undefined>>;

// helpers resolve to [name, version, path?].
const node = helpers.getNodeInfo();
type _helper = Expect<Equal<typeof node, Promise<HelperResult>>>;
helpers.getghInfo().then(([name, version, path]) => {
  type _name = Expect<Equal<typeof name, string>>;
  type _path = Expect<Equal<typeof path, string | undefined>>;
  return version;
});
// @ts-expect-error unknown helper
helpers.getTeaInfo();
