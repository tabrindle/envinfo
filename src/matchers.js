module.exports = {
  // ANSI escape sequences: CSI (colors, erasing a line, moving the cursor), OSC, and two-character escapes
  // such as selecting a character set.
  // eslint-disable-next-line no-control-regex
  ansiEscapes: /(?:\u001b\[|\u009b)[0-?]*[ -/]*[@-~]|\u001b\][^\u0007\u001b\r\n]*(?:\u0007|\u001b\\)?|\u001b[ -/]*[0-~]/g,
  // A whitespace-separated row of the Android CLI's `sdkmanager --list`: the package path, then its version,
  // `<installed> -> <update>` when an update is available, and its description.
  androidSDKCliRow: /^(\S+)(?:\s+\S+(?:\s+->\s+\S+)?(?:\s+(.*))?)?$/,
  // A package path, separated with `;` by the legacy sdkmanager and with `/` by the Android CLI.
  androidSDKPackage: /^(build-tools|platforms|system-images)[;/](\S+)$/,
  androidSDKPathSeparator: /[;/]/,
  // `android-35`, `android-36.1`, and SDK extensions such as `android-35-ext14`.
  androidAPILevel: /^android-(\d+(?:\.\d+)?)(?:-|$)/,
};
