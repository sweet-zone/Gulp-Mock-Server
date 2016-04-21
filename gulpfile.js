
'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const watch = require('gulp-watch');
const mcss = require('gulp-mcs');
const nodemon = require('gulp-nodemon');
const lr = require('tiny-lr')();
const exec = require('child_process').exec;
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const express = require('express');
let app = express();

// Path Setting
let PathConfig = {
    mcssSrc: ['./src/mcss/**/*', '!./src/mcss/common/*.mcss'],
    cssDist: './src/css/',
    livereloadSrc: ['./src/js/*.js', './src/css/*.css', './dist/*.html'], 
    fmppSrc: ['./template/**/*.ftl', './mock/sync/**/*.tdd'],
    svgSrc: './src/svg/*.svg',
    fontDist: './src/fonts/'                  
}

let runTimestamp = Math.round(Date.now()/1000);

// express server setting
const EXPRESS_ROOT = __dirname;
const EXPRESS_PORT = 9000;
const APICONFIG = './mock/async/';
const LIVEPORT = 35729;

// iconfont setting
let fontName = 'myicon';
let fontClass = 'myiconfont';

// 静态服务器
// 并开启自动刷新
gulp.task('server:connect', () => {
    connect.server({
        port: 9000,
        livereload: true
    });
});

// 通知服务器何时进行自动刷新
gulp.task('livereload:connect', () => {
    gulp.src(PathConfig.livereloadSrc)
        .pipe(watch(PathConfig.livereloadSrc))
        .pipe(connect.reload())
});




// -------- express服务器 ----------------
function startLivereload() {
    lr.listen(LIVEPORT, function() {
        console.log('livereload listen at port ' + LIVEPORT);
    });
}
function notifyLivereload(event) {
    let fileName = require('path').relative(EXPRESS_ROOT, event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    });   
}

gulp.task('server:express', () => {
    nodemon({
        script: './server.js',
        ignore: ['node_modules/', 'src/', 'dist/', 'gulpfile.js']
    }).on('restart', function() {
        console.log('server restarted...');
    });
    startLivereload();
    gulp.watch(PathConfig.livereloadSrc, notifyLivereload);
});



// fmpp编译freemarker
// 第一次会把template下的ftl全部编译
// 之后watch改变的文件
gulp.task('fmpp:compile', () => {
    travelDir('./template', function(pathname) {
        if(path.extname(pathname) === '.ftl') {
            let file = pathname.slice(9).slice(0, -4).replace('\\', '/');
            execFmpp(file);
        }
    });
});

gulp.task('fmpp', ['fmpp:compile'], () => {
    gulp.watch(PathConfig.fmppSrc, function(event) {
        let pathname = event.path;
        if(pathname.indexOf('mock') > 0) {
            let index = pathname.indexOf('mock');
            pathname = pathname.slice(index + 5, -4);
        } else if(pathname.indexOf('template') > 0) {
            let index = pathname.indexOf('template');
            pathname = pathname.slice(index + 9, -4);
        }
        execFmpp(pathname);
    });
});

gulp.task('mcss:compile', () => {
    return gulp.src(PathConfig.mcssSrc)
        .pipe(mcss())
        .pipe(gulp.dest(PathConfig.cssDist));
});

gulp.task('mcss', ['mcss:compile'], () => {
    gulp.watch(PathConfig.mcssSrc[0], ['mcss:compile']);
});

gulp.task('iconfont', () => {
    return gulp.src(PathConfig.svgSrc)
        .pipe(iconfontCss({
            fontName: fontName,
            path: './src/fonts/_icontpl.mcss',
            targetPath: '../mcss/iconfont.mcss',
            fontPath: '../fonts/',
            cssClass: fontClass
        }))
        .pipe(iconfont({
            fontName: fontName,
            prependUnicode: true,
            normalize:true,
            fontHeight: 1001,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            timestamp: runTimestamp
        }))
        .pipe(gulp.dest(PathConfig.fontDist));
});

function execFmpp(src) {
    console.log(chalk.blue('------- fmpp compiling ' + src + '.ftl -------'))
    let mockdata = './mock/sync/' + src + '.tdd';
    let args = '';

    // 如果对应的data存在并且可读, 使用-D
    // 否则不使用-D
    fs.access(mockdata, fs.F_OK | fs.R_OK, (err) => {
        let args = '';
        if(err) {
            args = 'fmpp template/' + src + '.ftl -o dist/' + src + '.html -S template -s';
        } else {
            args = 'fmpp template/' + src + '.ftl -o dist/' + src + '.html -D tdd(../mock/sync/' + src + '.tdd) -S template -s';
        }
        exec(args, function(err, stdout, stderr) {
            if(stdout) {
                console.log(chalk.yellow('------- fmpp compiled ' + src + '.ftl ended-------'))
                console.log(chalk.green(stdout))
            }
            if(err) console.log(chalk.red('exec error: ', err));
        });
    });
} 

function travelDir(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        let pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory() && pathname.indexOf('common') < 0) {
            travelDir(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

//默认启动
gulp.task('default', ['mcss', 'fmpp', 'server:express']);