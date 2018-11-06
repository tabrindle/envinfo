module.exports = {
  androidSystemImages: /system-images;([\S \t]+)/g,
  androidAPILevels: /platforms;android-(\d+)[\S\s]/g,
  androidBuildTools: /build-tools;([\d|.]+)[\S\s]/g,
};
