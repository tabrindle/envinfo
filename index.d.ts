// Definitions by James George (https://github.com/jamesgeorge007)

export function cli(e: any): any;

export function main(e: any, t: any): any;

interface Config {
	System: string[];
	Binaries: string[];
	Browsers: string[];
	npmPackages: string | string[];
	npmGlobalPackages: string[];
}

interface Options {
	json: boolean;
	console: boolean;
	showNotFound: boolean;
}

export function run(e: Config, t: Options): any;

export namespace cli {
    const prototype: {
    };

}

export namespace helpers {
    const NA: string;

    const NotFound: string;

    const browserBundleIdentifiers: {
        Chrome: string;
        "Chrome Canary": string;
        Firefox: string;
        "Firefox Developer Edition": string;
        "Firefox Nightly": string;
        Safari: string;
        "Safari Technology Preview": string;
    };

    const ideBundleIdentifiers: {
        Atom: string;
        IntelliJ: string;
        PhpStorm: string;
        "Sublime Text": string;
        WebStorm: string;
    };

    const isLinux: boolean;

    const isMacOS: boolean;

    const isWindows: boolean;

    const versionRegex: RegExp;

    function condensePath(e: any): any;

    function determineFound(e: any, t: any, n: any): any;

    function fileExists(e: any): any;

    function findDarwinApplication(e: any): any;

    function findVersion(e: any, t: any, n: any): any;

    function generatePlistBuddyCommand(e: any, t: any): any;

    function getAllPackageJsonPaths(e: any): any;

    function getAndroidSDKInfo(): any;

    function getAndroidStudioInfo(): any;

    function getApacheInfo(): any;

    function getAtomInfo(): any;

    function getBashInfo(): any;

    function getCMakeInfo(): any;

    function getCPUInfo(): any;

    function getChromeCanaryInfo(): any;

    function getChromeInfo(): any;

    function getContainerInfo(): any;

    function getDarwinApplicationVersion(e: any): any;

    function getDockerInfo(): any;

    function getEdgeInfo(): any;

    function getElixirInfo(): any;

    function getEmacsInfo(): any;

    function getFirefoxDeveloperEditionInfo(): any;

    function getFirefoxInfo(): any;

    function getFirefoxNightlyInfo(): any;

    function getGCCInfo(): any;

    function getGitInfo(): any;

    function getGoInfo(): any;

    function getHomeBrewInfo(): any;

    function getIntelliJInfo(): any;

    function getInternetExplorerInfo(): any;

    function getJavaInfo(): any;

    function getMakeInfo(): any;

    function getMemoryInfo(): any;

    function getMongoDBInfo(): any;

    function getMySQLInfo(): any;

    function getNanoInfo(): any;

    function getNginxInfo(): any;

    function getNodeInfo(): any;

    function getNvimInfo(): any;

    function getOSInfo(): any;

    function getPHPInfo(): any;

    function getPackageJsonByFullPath(e: any): any;

    function getPackageJsonByName(e: any): any;

    function getPackageJsonByPath(e: any): any;

    function getParallelsInfo(): any;

    function getPerlInfo(): any;

    function getPhpStormInfo(): any;

    function getPostgreSQLInfo(): any;

    function getPythonInfo(): any;

    function getRubyInfo(): any;

    function getRustInfo(): any;

    function getSQLiteInfo(): any;

    function getSafariInfo(): any;

    function getSafariTechnologyPreviewInfo(): any;

    function getScalaInfo(): any;

    function getShellInfo(): any;

    function getSublimeTextInfo(): any;

    function getVMwareFusionInfo(): any;

    function getVSCodeInfo(): any;

    function getVimInfo(): any;

    function getVirtualBoxInfo(): any;

    function getWatchmanInfo(): any;

    function getWebStormInfo(): any;

    function getXcodeInfo(): any;

    function getYarnInfo(): any;

    function getiOSSDKInfo(): any;

    function getnpmGlobalPackages(e: any, t: any): any;

    function getnpmInfo(): any;

    function getnpmPackages(e: any, t: any): any;

    function isObject(e: any): any;

    function log(e: any, ...args: any[]): void;

    function matchAll(e: any, t: any): any;

    function noop(e: any): any;

    function omit(e: any, t: any): any;

    function parseSDKManagerOutput(e: any): any;

    function pick(e: any, t: any): any;

    function pipe(e: any): any;

    function readFile(e: any): any;

    function requireJson(e: any): any;

    function run(e: any, ...args: any[]): any;

    function runSync(e: any): any;

    function sortObject(e: any): any;

    function toReadableBytes(e: any): any;

    function uniq(e: any): any;

    function which(e: any): any;

    namespace condensePath {
        const prototype: {
        };

    }

    namespace determineFound {
        const prototype: {
        };

    }

    namespace fileExists {
        const prototype: {
        };

    }

    namespace findDarwinApplication {
        const prototype: {
        };

    }

    namespace findVersion {
        const prototype: {
        };

    }

    namespace generatePlistBuddyCommand {
        const prototype: {
        };

    }

    namespace getAllPackageJsonPaths {
        const prototype: {
        };

    }

    namespace getAndroidSDKInfo {
        const prototype: {
        };

    }

    namespace getAndroidStudioInfo {
        const prototype: {
        };

    }

    namespace getApacheInfo {
        const prototype: {
        };

    }

    namespace getAtomInfo {
        const prototype: {
        };

    }

    namespace getBashInfo {
        const prototype: {
        };

    }

    namespace getCMakeInfo {
        const prototype: {
        };

    }

    namespace getCPUInfo {
        const prototype: {
        };

    }

    namespace getChromeCanaryInfo {
        const prototype: {
        };

    }

    namespace getChromeInfo {
        const prototype: {
        };

    }

    namespace getContainerInfo {
        const prototype: {
        };

    }

    namespace getDarwinApplicationVersion {
        const prototype: {
        };

    }

    namespace getDockerInfo {
        const prototype: {
        };

    }

    namespace getEdgeInfo {
        const prototype: {
        };

    }

    namespace getElixirInfo {
        const prototype: {
        };

    }

    namespace getEmacsInfo {
        const prototype: {
        };

    }

    namespace getFirefoxDeveloperEditionInfo {
        const prototype: {
        };

    }

    namespace getFirefoxInfo {
        const prototype: {
        };

    }

    namespace getFirefoxNightlyInfo {
        const prototype: {
        };

    }

    namespace getGCCInfo {
        const prototype: {
        };

    }

    namespace getGitInfo {
        const prototype: {
        };

    }

    namespace getGoInfo {
        const prototype: {
        };

    }

    namespace getHomeBrewInfo {
        const prototype: {
        };

    }

    namespace getIntelliJInfo {
        const prototype: {
        };

    }

    namespace getInternetExplorerInfo {
        const prototype: {
        };

    }

    namespace getJavaInfo {
        const prototype: {
        };

    }

    namespace getMakeInfo {
        const prototype: {
        };

    }

    namespace getMemoryInfo {
        const prototype: {
        };

    }

    namespace getMongoDBInfo {
        const prototype: {
        };

    }

    namespace getMySQLInfo {
        const prototype: {
        };

    }

    namespace getNanoInfo {
        const prototype: {
        };

    }

    namespace getNginxInfo {
        const prototype: {
        };

    }

    namespace getNodeInfo {
        const prototype: {
        };

    }

    namespace getNvimInfo {
        const prototype: {
        };

    }

    namespace getOSInfo {
        const prototype: {
        };

    }

    namespace getPHPInfo {
        const prototype: {
        };

    }

    namespace getPackageJsonByFullPath {
        const prototype: {
        };

    }

    namespace getPackageJsonByName {
        const prototype: {
        };

    }

    namespace getPackageJsonByPath {
        const prototype: {
        };

    }

    namespace getParallelsInfo {
        const prototype: {
        };

    }

    namespace getPerlInfo {
        const prototype: {
        };

    }

    namespace getPhpStormInfo {
        const prototype: {
        };

    }

    namespace getPostgreSQLInfo {
        const prototype: {
        };

    }

    namespace getPythonInfo {
        const prototype: {
        };

    }

    namespace getRubyInfo {
        const prototype: {
        };

    }

    namespace getRustInfo {
        const prototype: {
        };

    }

    namespace getSQLiteInfo {
        const prototype: {
        };

    }

    namespace getSafariInfo {
        const prototype: {
        };

    }

    namespace getSafariTechnologyPreviewInfo {
        const prototype: {
        };

    }

    namespace getScalaInfo {
        const prototype: {
        };

    }

    namespace getShellInfo {
        const prototype: {
        };

    }

    namespace getSublimeTextInfo {
        const prototype: {
        };

    }

    namespace getVMwareFusionInfo {
        const prototype: {
        };

    }

    namespace getVSCodeInfo {
        const prototype: {
        };

    }

    namespace getVimInfo {
        const prototype: {
        };

    }

    namespace getVirtualBoxInfo {
        const prototype: {
        };

    }

    namespace getWatchmanInfo {
        const prototype: {
        };

    }

    namespace getWebStormInfo {
        const prototype: {
        };

    }

    namespace getXcodeInfo {
        const prototype: {
        };

    }

    namespace getYarnInfo {
        const prototype: {
        };

    }

    namespace getiOSSDKInfo {
        const prototype: {
        };

    }

    namespace getnpmGlobalPackages {
        const prototype: {
        };

    }

    namespace getnpmInfo {
        const prototype: {
        };

    }

    namespace getnpmPackages {
        const prototype: {
        };

    }

    namespace isObject {
        const prototype: {
        };

    }

    namespace log {
        const prototype: {
        };

    }

    namespace matchAll {
        const prototype: {
        };

    }

    namespace noop {
        const prototype: {
        };

    }

    namespace omit {
        const prototype: {
        };

    }

    namespace parseSDKManagerOutput {
        const prototype: {
        };

    }

    namespace pick {
        const prototype: {
        };

    }

    namespace pipe {
        const prototype: {
        };

    }

    namespace readFile {
        const prototype: {
        };

    }

    namespace requireJson {
        const prototype: {
        };

    }

    namespace run {
        const prototype: {
        };

    }

    namespace runSync {
        const prototype: {
        };

    }

    namespace sortObject {
        const prototype: {
        };

    }

    namespace toReadableBytes {
        const prototype: {
        };

    }

    namespace uniq {
        const prototype: {
        };

    }

    namespace which {
        const prototype: {
        };

    }

}

export namespace main {
    const prototype: {
    };

}

export namespace run {
    const prototype: {
    };

}
