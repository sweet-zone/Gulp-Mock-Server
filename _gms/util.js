
'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const mkdirp = require('mkdirp');
const async = require('async');
const config = require('./parseConfig.js');
const logger = require('./logger.js')

let _ = module.exports;

// 根据配置建立目录
// template/mock/dist
_.mkdirs = function() {
    var arr = [config.fmSrc, config.mockPath, config.distPath, config.asyncPath, config.syncPath];

    async.eachSeries(arr, (item, callback) => {
        mkdirp(item, (err) => {
            if(err) callback(err)
            else callback(null)
        });
    }, (err) => {
        if(err) logger.warning(err);
    });
}

_.handleUrlPath = function(str) {
    if(!str) return;
    if(str[str.length - 1] === '/') {
        str = str.slice(0, str.length - 1);
    } 
    return str;
}

_.handleFilePath = function(str) {
    let basename = path.basename(str, '.ftl');
    let dirname = path.dirname(str);
    return path.join(dirname, basename);
}

_.execFmpp = function(src, callback) {
    let pathname = _.handleFilePath(src);
    let fmsrc = path.join(config.fmSrc, pathname + '.ftl');
    let fmdist = path.join(config.distPath, pathname + '.html');
    let fmmockfile = path.join('sync', pathname + '.tdd');
    let fmmock = path.join(config.syncPath, pathname + '.tdd');

    // 如果对应的data存在并且可读, 使用-D
    // 否则不使用-D
    fs.access(fmmock, fs.F_OK | fs.R_OK, (err) => {
        let args = '';
        args += 'fmpp ' + fmsrc + ' -o ' + fmdist + ' -S ' + config.fmSrc;
        if(err) {
            args += ' -s';
        } else {
            args += ' -D tdd(' + fmmockfile + ') -s --data-root=' + config.mockPath;
        }

        exec(args, (err, stdout, stderr) => {
            if(stdout) {
                if(stdout.indexOf('Failed!') > -1 || stdout.indexOf('>>> ABORTED! <<<') > -1) callback(stdout);
                else {
                    logger.success('******** compile ' + pathname + '.ftl success! ********');
                    callback();
                }
            }
            if(err) callback(err);
            if(stderr) callback(stderr);
        });
    });
}

// 遍历config.router下的所有模板
// 调用execFmpp
_.travelRouters = function() {
    let fms = config.allfms;

    if(!fms.length) return;
    async.eachSeries(fms, (item, callback) => {
        _.execFmpp(item, (err) => {
            callback(err);
        });
    }, (err) => {
        if(err) logger.warning(err);
    });
}