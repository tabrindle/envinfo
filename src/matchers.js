module.exports = {
  androidSystemImages: /system-images;([\S \t]+)/g,
  androidAPILevels: /platforms;android-(\d+)[\S\s]/g,
  androidBuildTools: /build-tools;([\d|.]+)[\S\s]/g,
  androidCliPackages: /^[ \t]*((?:build-tools|platforms|system-images)\/\S+)[ \t]+\S+(?:[ \t]+->[ \t]+\S+)?[ \t]+([^\r\n]+)/gm,
};
