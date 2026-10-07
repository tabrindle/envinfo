// Type definitions for envinfo.
//
// These are checked against the JavaScript sources by `yarn test:types`
// (test-d/contract.test-d.ts): adding a helper, category item or preset in src/ without
// updating this file fails the build, and the error names what is missing.

/** Items that can be requested for each category, as listed in `presets.defaults`. */
export interface CategoryItems {
  System: 'OS' | 'CPU' | 'Memory' | 'Container' | 'Shell';
  Binaries: 'Node' | 'Yarn' | 'npm' | 'pnpm' | 'bun' | 'Deno' | 'Watchman';
  Managers:
    | 'Apt'
    | 'Cargo'
    | 'CocoaPods'
    | 'Composer'
    | 'Gradle'
    | 'Homebrew'
    | 'Maven'
    | 'pip2'
    | 'pip3'
    | 'RubyGems'
    | 'Yum';
  Utilities:
    | '7z'
    | 'Bazel'
    | 'CMake'
    | 'Make'
    | 'GCC'
    | 'Git'
    | 'Git LFS'
    | 'gh'
    | 'glab'
    | 'jq'
    | 'ripgrep'
    | 'Clang'
    | 'Ninja'
    | 'Mercurial'
    | 'Subversion'
    | 'FFmpeg'
    | 'Curl'
    | 'OpenSSL'
    | 'ccache'
    | 'Calibre'
    | 'Clash Meta';
  Servers: 'Apache' | 'Nginx';
  Virtualization: 'Docker' | 'Docker Compose' | 'Parallels' | 'VirtualBox' | 'VMware Fusion';
  SDKs: 'iOS SDK' | 'Android SDK' | 'Windows SDK';
  IDEs:
    | 'Android Studio'
    | 'Atom'
    | 'Emacs'
    | 'IntelliJ'
    | 'Nvim'
    | 'Nano'
    | 'PhpStorm'
    | 'Sublime Text'
    | 'VSCode'
    | 'Cursor'
    | 'Cursor Agent'
    | 'Claude Code'
    | 'Codex'
    | 'opencode'
    | 'Visual Studio'
    | 'Vim'
    | 'WebStorm'
    | 'Xcode';
  Languages:
    | 'Bash'
    | 'Go'
    | 'Elixir'
    | 'Erlang'
    | 'Java'
    | 'Perl'
    | 'PHP'
    | 'Protoc'
    | 'Python'
    | 'Python3'
    | 'R'
    | 'Ruby'
    | 'Rust'
    | 'Scala'
    | 'Zig';
  Databases: 'MongoDB' | 'MySQL' | 'PostgreSQL' | 'SQLite';
  Browsers:
    | 'Brave Browser'
    | 'Chrome'
    | 'Chrome Canary'
    | 'Chromium'
    | 'Edge'
    | 'Firefox'
    | 'Firefox Developer Edition'
    | 'Firefox Nightly'
    | 'Internet Explorer'
    | 'Safari'
    | 'Safari Technology Preview';
  Monorepos: 'Yarn Workspaces' | 'Lerna';
}

export type Category = keyof CategoryItems;

/**
 * Which packages to report: `true` for all of them, a glob such as `'*webpack*'`,
 * a comma-separated string, or a list of package names.
 */
export type PackageQuery = boolean | string | ReadonlyArray<string>;

type CategoryConfig = { [K in Category]?: ReadonlyArray<CategoryItems[K]> | undefined };

/** What to collect. Passing an empty object collects every default category. */
export interface Config extends CategoryConfig {
  npmPackages?: PackageQuery | undefined;
  npmGlobalPackages?: PackageQuery | undefined;
  pnpmGlobalPackages?: PackageQuery | undefined;
}

export type PresetName =
  | 'cssnano'
  | 'jest'
  | 'react-native'
  | 'nyc'
  | 'webpack'
  | 'styled-components'
  | 'create-react-app'
  | 'apollo'
  | 'react-native-web'
  | 'babel'
  | 'playwright';

/** A `Config`, or a built-in preset. Other keys are ignored when `preset` is set. */
export type RunConfig = Config | { preset: PresetName };

export interface Options {
  /** Format the report as JSON. */
  json?: boolean | undefined;
  /** Format the report as Markdown. */
  markdown?: boolean | undefined;
  /** Also print the report to the console. */
  console?: boolean | undefined;
  /** Top level title of the report, e.g. 'Environment Report'. */
  title?: string | undefined;
  /** Keep values marked 'Not Found' instead of filtering them out. */
  showNotFound?: boolean | undefined;
  /** Traverse the entire node_modules tree, not just the top level. */
  fullTree?: boolean | undefined;
  /** Mark duplicate npm packages inside parentheses, e.g. (2.1.4). */
  duplicates?: boolean | undefined;
  /** @deprecated Removed; use clipboardy or clipboard-cli directly. */
  clipboard?: boolean | undefined;
}

/**
 * Command line flags, as parsed by minimist. Category flags are matched case-insensitively
 * by substring, so `{ system: true }` and `{ ides: true }` both work.
 */
export interface CliOptions extends Options {
  /** Collect every category, including npm and pnpm global packages. */
  all?: boolean | undefined;
  /** A JSON encoded `Config`, e.g. '{"System":["OS"]}'. */
  raw?: string | undefined;
  /** Run a single helper and print its result, e.g. 'Node' or 'getNodeInfo'. */
  helper?: string | undefined;
  preset?: PresetName | undefined;
  npmPackages?: PackageQuery | undefined;
  npmGlobalPackages?: PackageQuery | undefined;
  pnpmGlobalPackages?: PackageQuery | undefined;
  [flag: string]: unknown;
}

export type HelperNames =
  | 'get7zInfo'
  | 'getAndroidSDKInfo'
  | 'getAndroidStudioInfo'
  | 'getApacheInfo'
  | 'getAptInfo'
  | 'getAtomInfo'
  | 'getBashInfo'
  | 'getBazelInfo'
  | 'getBraveBrowserInfo'
  | 'getbunInfo'
  | 'getCalibreInfo'
  | 'getCargoInfo'
  | 'getccacheInfo'
  | 'getChromeCanaryInfo'
  | 'getChromeInfo'
  | 'getChromiumInfo'
  | 'getClangInfo'
  | 'getClashMetaInfo'
  | 'getClaudeCodeInfo'
  | 'getCMakeInfo'
  | 'getCocoaPodsInfo'
  | 'getCodexInfo'
  | 'getComposerInfo'
  | 'getContainerInfo'
  | 'getCPUInfo'
  | 'getCurlInfo'
  | 'getCursorAgentInfo'
  | 'getCursorInfo'
  | 'getDenoInfo'
  | 'getDockerComposeInfo'
  | 'getDockerInfo'
  | 'getEdgeInfo'
  | 'getElixirInfo'
  | 'getEmacsInfo'
  | 'getErlangInfo'
  | 'getFFmpegInfo'
  | 'getFirefoxDeveloperEditionInfo'
  | 'getFirefoxInfo'
  | 'getFirefoxNightlyInfo'
  | 'getGCCInfo'
  | 'getghInfo'
  | 'getGitInfo'
  | 'getGitLFSInfo'
  | 'getglabInfo'
  | 'getGLibcInfo'
  | 'getGoInfo'
  | 'getGradleInfo'
  | 'getHomebrewInfo'
  | 'getIntelliJInfo'
  | 'getInternetExplorerInfo'
  | 'getiOSSDKInfo'
  | 'getJavaInfo'
  | 'getjqInfo'
  | 'getLernaInfo'
  | 'getMakeInfo'
  | 'getMavenInfo'
  | 'getMemoryInfo'
  | 'getMercurialInfo'
  | 'getMongoDBInfo'
  | 'getMySQLInfo'
  | 'getNanoInfo'
  | 'getNginxInfo'
  | 'getNinjaInfo'
  | 'getNodeInfo'
  | 'getnpmInfo'
  | 'getNvimInfo'
  | 'getopencodeInfo'
  | 'getOpenSSLInfo'
  | 'getOSInfo'
  | 'getParallelsInfo'
  | 'getPerlInfo'
  | 'getPHPInfo'
  | 'getPhpStormInfo'
  | 'getpip2Info'
  | 'getpip3Info'
  | 'getpnpmInfo'
  | 'getPodmanInfo'
  | 'getPostgreSQLInfo'
  | 'getProtocInfo'
  | 'getPython3Info'
  | 'getPythonInfo'
  | 'getRInfo'
  | 'getripgrepInfo'
  | 'getRubyGemsInfo'
  | 'getRubyInfo'
  | 'getRustInfo'
  | 'getSafariInfo'
  | 'getSafariTechnologyPreviewInfo'
  | 'getScalaInfo'
  | 'getShellInfo'
  | 'getSQLiteInfo'
  | 'getSublimeTextInfo'
  | 'getSubversionInfo'
  | 'getVimInfo'
  | 'getVirtualBoxInfo'
  | 'getVisualStudioInfo'
  | 'getVMwareFusionInfo'
  | 'getVSCodeInfo'
  | 'getWatchmanInfo'
  | 'getWebStormInfo'
  | 'getWindowsSDKInfo'
  | 'getXcodeInfo'
  | 'getYarnInfo'
  | 'getYarnWorkspacesInfo'
  | 'getYumInfo'
  | 'getZigInfo';

/**
 * `[name, version, path?]`. The version is 'Not Found' when the tool is missing and 'N/A'
 * when it is not supported on this platform. Some helpers, such as the SDK ones, resolve
 * to structured data instead of a version string.
 */
export type HelperResult = [string, string | string[] | { [key: string]: unknown }, string?];

export type Helpers = Record<HelperNames, () => Promise<HelperResult>>;

/** Collects the requested info and resolves to a YAML (default), JSON or Markdown report. */
export function run(config: RunConfig, options?: Options): Promise<string>;

/** Like `run()`, without preset support. */
export function main(config: Config, options?: Options): Promise<string>;

/**
 * The `envinfo` command. Resolves to the report, or to nothing when `helper` is set (the
 * result is printed instead). Returns undefined when the preset or helper does not exist.
 */
export function cli(options: CliOptions): Promise<string> | Promise<void> | undefined;

export const helpers: Helpers;
