#!/usr/bin/env node
"use strict";module.exports=function(n){var t={};function e(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}return e.m=n,e.c=t,e.d=function(n,t,o){e.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:o})},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,t){if(1&t&&(n=e(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var o=Object.create(null);if(e.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var r in n)e.d(o,r,function(t){return n[t]}.bind(null,r));return o},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=195)}({0:function(n,t){var e=n.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},1:function(n,t,e){var o=e(3);n.exports=function(n){if(!o(n))throw TypeError(n+" is not an object!");return n}},12:function(n,t,e){var o=e(1),r=e(42),i=e(35),u=Object.defineProperty;t.f=e(5)?Object.defineProperty:function(n,t,e){if(o(n),t=i(t,!0),o(e),r)try{return u(n,t,e)}catch(n){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(n[t]=e.value),n}},14:function(n,t){var e=n.exports={version:"2.6.12"};"number"==typeof __e&&(__e=e)},15:function(n,t,e){var o=e(12),r=e(22);n.exports=e(5)?function(n,t,e){return o.f(n,t,r(1,e))}:function(n,t,e){return n[t]=e,n}},16:function(n,t,e){var o=e(0),r=e(15),i=e(19),u=e(23)("src"),s=e(53),c=(""+s).split("toString");e(14).inspectSource=function(n){return s.call(n)},(n.exports=function(n,t,e,s){var a="function"==typeof e;a&&(i(e,"name")||r(e,"name",t)),n[t]!==e&&(a&&(i(e,u)||r(e,u,n[t]?""+n[t]:c.join(String(t)))),n===o?n[t]=e:s?n[t]?n[t]=e:r(n,t,e):(delete n[t],r(n,t,e)))})(Function.prototype,"toString",(function(){return"function"==typeof this&&this[u]||s.call(this)}))},17:function(n,t,e){var o=e(25);n.exports=function(n,t,e){if(o(n),void 0===t)return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,o){return n.call(t,e,o)};case 3:return function(e,o,r){return n.call(t,e,o,r)}}return function(){return n.apply(t,arguments)}}},18:function(n,t,e){var o=e(26),r=Math.min;n.exports=function(n){return n>0?r(o(n),9007199254740991):0}},19:function(n,t){var e={}.hasOwnProperty;n.exports=function(n,t){return e.call(n,t)}},195:function(n,t,e){e(41);var o=e(196)(process.argv.slice(2));o.console=!0,o.help||o._.indexOf("help")>-1?console.log("\n  ,,',                                  ,,             ,,,,,,           ,',,\n ,,,                                                  ,,,                  ,,,\n ,,       ,,,,,    ,,,,,,   ,,,     ,,  ,,  .,,,,,,   ,,,,,,,   ,,,,,       ,,\n ,,     ,,    ,,  ,,,   ,,,  ,,    ,,,  ,,  ,,,   ,,, ,,      ,,,   ,,,     ,,\n ,,,   ,,     .,, ,,,    ,,  ,,,   ,,   ,,  ,,,    ,, ,,     ,,      ,,     ,,,\n ,,    ,,,,,,,,,, ,,,    ,,   ,,  ,,    ,,  ,,,    ,, ,,     ,,      ,,     ,,\n ,,    ,,,        ,,,    ,,    ,,,,,    ,,  ,,,    ,, ,,     ,,,    ,,,     ,,\n ,,      ,,,,,,,  ,,,    ,,     ,,,     ,,  ,,,    ,, ,,       ,,,,,,,      ,,\n ,,,                                                                       ,,,\n  ,,,'                                                                  ',,,\n\n  VERSION: 7.8.0\n\n  USAGE:\n\n    `envinfo` || `npx envinfo`\n\n  OPTIONS:\n\n    --system               Print general system info such as OS, CPU, Memory and Shell\n    --browsers             Get version numbers of installed web browsers\n    --SDKs                 Get platforms, build tools and SDKs of iOS and Android\n    --IDEs                 Get version numbers of installed IDEs\n    --languages            Get version numbers of installed languages such as Java, Python, PHP, etc\n    --managers             Get version numbers of installed package/dependency managers\n    --monorepos            Get monorepo tools\n    --binaries             Get version numbers of node, npm, watchman, etc\n    --npmPackages          Get version numbers of locally installed npm packages - glob, string, or comma delimited list\n    --npmGlobalPackages    Get version numbers of globally installed npm packages\n\n    --duplicates           Mark duplicate npm packages inside parentheses eg. (2.1.4)\n    --fullTree             Traverse entire node_modules dependency tree, not just top level\n\n    --markdown             Print output in markdown format\n    --json                 Print output in JSON format\n    --console              Print to console (defaults to on for CLI usage, off for programmatic usage)\n    --showNotFound         Don't filter out values marked 'Not Found'\n    --title                Give your report a top level title ie 'Environment Report'\n\n    --clipboard            *Removed - use clipboardy or clipboard-cli directly*\n  "):o.version||o.v||o._.indexOf("version")>-1?console.log("7.8.0"):e(197).cli(o)},196:function(n,t){function e(n){return"number"==typeof n||(!!/^0x[0-9a-f]+$/i.test(n)||/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(n))}n.exports=function(n,t){t||(t={});var o={bools:{},strings:{},unknownFn:null};"function"==typeof t.unknown&&(o.unknownFn=t.unknown),"boolean"==typeof t.boolean&&t.boolean?o.allBools=!0:[].concat(t.boolean).filter(Boolean).forEach((function(n){o.bools[n]=!0}));var r={};Object.keys(t.alias||{}).forEach((function(n){r[n]=[].concat(t.alias[n]),r[n].forEach((function(t){r[t]=[n].concat(r[n].filter((function(n){return t!==n})))}))})),[].concat(t.string).filter(Boolean).forEach((function(n){o.strings[n]=!0,r[n]&&(o.strings[r[n]]=!0)}));var i=t.default||{},u={_:[]};Object.keys(o.bools).forEach((function(n){c(n,void 0!==i[n]&&i[n])}));var s=[];function c(n,t,i){if(!i||!o.unknownFn||function(n,t){return o.allBools&&/^--[^=]+$/.test(t)||o.strings[n]||o.bools[n]||r[n]}(n,i)||!1!==o.unknownFn(i)){var s=!o.strings[n]&&e(t)?Number(t):t;a(u,n.split("."),s),(r[n]||[]).forEach((function(n){a(u,n.split("."),s)}))}}function a(n,t,e){for(var r=n,i=0;i<t.length-1;i++){if("__proto__"===(u=t[i]))return;void 0===r[u]&&(r[u]={}),r[u]!==Object.prototype&&r[u]!==Number.prototype&&r[u]!==String.prototype||(r[u]={}),r[u]===Array.prototype&&(r[u]=[]),r=r[u]}var u;"__proto__"!==(u=t[t.length-1])&&(r!==Object.prototype&&r!==Number.prototype&&r!==String.prototype||(r={}),r===Array.prototype&&(r=[]),void 0===r[u]||o.bools[u]||"boolean"==typeof r[u]?r[u]=e:Array.isArray(r[u])?r[u].push(e):r[u]=[r[u],e])}function f(n){return r[n].some((function(n){return o.bools[n]}))}-1!==n.indexOf("--")&&(s=n.slice(n.indexOf("--")+1),n=n.slice(0,n.indexOf("--")));for(var l=0;l<n.length;l++){var p=n[l];if(/^--.+=/.test(p)){var d=p.match(/^--([^=]+)=([\s\S]*)$/),v=d[1],y=d[2];o.bools[v]&&(y="false"!==y),c(v,y,p)}else if(/^--no-.+/.test(p)){c(v=p.match(/^--no-(.+)/)[1],!1,p)}else if(/^--.+/.test(p)){v=p.match(/^--(.+)/)[1];void 0===(g=n[l+1])||/^-/.test(g)||o.bools[v]||o.allBools||r[v]&&f(v)?/^(true|false)$/.test(g)?(c(v,"true"===g,p),l++):c(v,!o.strings[v]||"",p):(c(v,g,p),l++)}else if(/^-[^-]+/.test(p)){for(var b=p.slice(1,-1).split(""),m=!1,h=0;h<b.length;h++){var g;if("-"!==(g=p.slice(h+2))){if(/[A-Za-z]/.test(b[h])&&/=/.test(g)){c(b[h],g.split("=")[1],p),m=!0;break}if(/[A-Za-z]/.test(b[h])&&/-?\d+(\.\d*)?(e-?\d+)?$/.test(g)){c(b[h],g,p),m=!0;break}if(b[h+1]&&b[h+1].match(/\W/)){c(b[h],p.slice(h+2),p),m=!0;break}c(b[h],!o.strings[b[h]]||"",p)}else c(b[h],g,p)}v=p.slice(-1)[0];m||"-"===v||(!n[l+1]||/^(-|--)[^-]/.test(n[l+1])||o.bools[v]||r[v]&&f(v)?n[l+1]&&/^(true|false)$/.test(n[l+1])?(c(v,"true"===n[l+1],p),l++):c(v,!o.strings[v]||"",p):(c(v,n[l+1],p),l++))}else if(o.unknownFn&&!1===o.unknownFn(p)||u._.push(o.strings._||!e(p)?p:Number(p)),t.stopEarly){u._.push.apply(u._,n.slice(l+1));break}}return Object.keys(i).forEach((function(n){var t,e,o;t=u,e=n.split("."),o=t,e.slice(0,-1).forEach((function(n){o=o[n]||{}})),e[e.length-1]in o||(a(u,n.split("."),i[n]),(r[n]||[]).forEach((function(t){a(u,t.split("."),i[n])})))})),t["--"]?(u["--"]=new Array,s.forEach((function(n){u["--"].push(n)}))):s.forEach((function(n){u._.push(n)})),u}},197:function(n,t){n.exports=require("./envinfo")},2:function(n,t,e){var o=e(0),r=e(14),i=e(15),u=e(16),s=e(17),c=function(n,t,e){var a,f,l,p,d=n&c.F,v=n&c.G,y=n&c.S,b=n&c.P,m=n&c.B,h=v?o:y?o[t]||(o[t]={}):(o[t]||{}).prototype,g=v?r:r[t]||(r[t]={}),_=g.prototype||(g.prototype={});for(a in v&&(e=t),e)l=((f=!d&&h&&void 0!==h[a])?h:e)[a],p=m&&f?s(l,o):b&&"function"==typeof l?s(Function.call,l):l,h&&u(h,a,l,n&c.U),g[a]!=l&&i(g,a,p),b&&_[a]!=l&&(_[a]=l)};o.core=r,c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,n.exports=c},20:function(n,t){var e={}.toString;n.exports=function(n){return e.call(n).slice(8,-1)}},22:function(n,t){n.exports=function(n,t){return{enumerable:!(1&n),configurable:!(2&n),writable:!(4&n),value:t}}},23:function(n,t){var e=0,o=Math.random();n.exports=function(n){return"Symbol(".concat(void 0===n?"":n,")_",(++e+o).toString(36))}},24:function(n,t){n.exports=!1},25:function(n,t){n.exports=function(n){if("function"!=typeof n)throw TypeError(n+" is not a function!");return n}},26:function(n,t){var e=Math.ceil,o=Math.floor;n.exports=function(n){return isNaN(n=+n)?0:(n>0?o:e)(n)}},29:function(n,t,e){var o=e(14),r=e(0),i=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(n.exports=function(n,t){return i[n]||(i[n]=void 0!==t?t:{})})("versions",[]).push({version:o.version,mode:e(24)?"pure":"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"})},3:function(n,t){n.exports=function(n){return"object"==typeof n?null!==n:"function"==typeof n}},34:function(n,t,e){var o=e(3),r=e(0).document,i=o(r)&&o(r.createElement);n.exports=function(n){return i?r.createElement(n):{}}},35:function(n,t,e){var o=e(3);n.exports=function(n,t){if(!o(n))return n;var e,r;if(t&&"function"==typeof(e=n.toString)&&!o(r=e.call(n)))return r;if("function"==typeof(e=n.valueOf)&&!o(r=e.call(n)))return r;if(!t&&"function"==typeof(e=n.toString)&&!o(r=e.call(n)))return r;throw TypeError("Can't convert object to primitive value")}},38:function(n,t,e){var o=e(0).document;n.exports=o&&o.documentElement},41:function(n,t,e){var o=e(2),r=e(38),i=e(20),u=e(44),s=e(18),c=[].slice;o(o.P+o.F*e(6)((function(){r&&c.call(r)})),"Array",{slice:function(n,t){var e=s(this.length),o=i(this);if(t=void 0===t?e:t,"Array"==o)return c.call(this,n,t);for(var r=u(n,e),a=u(t,e),f=s(a-r),l=new Array(f),p=0;p<f;p++)l[p]="String"==o?this.charAt(r+p):this[r+p];return l}})},42:function(n,t,e){n.exports=!e(5)&&!e(6)((function(){return 7!=Object.defineProperty(e(34)("div"),"a",{get:function(){return 7}}).a}))},44:function(n,t,e){var o=e(26),r=Math.max,i=Math.min;n.exports=function(n,t){return(n=o(n))<0?r(n+t,0):i(n,t)}},5:function(n,t,e){n.exports=!e(6)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},53:function(n,t,e){n.exports=e(29)("native-function-to-string",Function.toString)},6:function(n,t){n.exports=function(n){try{return!!n()}catch(n){return!0}}}});