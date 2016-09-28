
'use strict';

const path = require('path');

// 载入配置
const config = require('../_config.js');

let freemarker = config.freemarker;
exports.fmSrc = freemarker.src;
let mockPath = exports.mockPath = freemarker.mock;
exports.distPath = freemarker.dist;
exports.asyncPath = path.join(mockPath, 'async');
exports.syncPath = path.join(mockPath, 'sync');

exports.router = config.router;

let fms = [];
for(let r in config.router) {
    let fmsrc = config.router[r];
    if(fms.indexOf(fmsrc) > -1) continue;
    fms.push(fmsrc);
}
exports.allfms = fms;

exports.server = config.server;

exports.style = config.style;

exports.iconfont = config.iconfont;

exports.browserSync = config.browserSync;

exports.sprite = config.sprite;