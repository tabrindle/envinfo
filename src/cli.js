#!/usr/bin/env node

var envinfo = require('./envinfo.js');
var argv = require('minimist')(process.argv.slice(2));

envinfo.print(argv);
