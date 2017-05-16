
'use strict';


const config = require('./_gms/parseConfig.js');
const path = require('path');
const gulp = require('gulp');
const watch = require('gulp-watch');
const mcss = require('gulp-mcs');
const nodemon = require('gulp-nodemon');
const lr = require('tiny-lr')();
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const gulpSequence = require('gulp-sequence').use(gulp);
const logger = require('./_gms/logger.js');
const _ = require('./_gms/util.js');
const express = require('express');
let app = express();

let allfms = config.allfms.slice();
allfms = allfms.map(function(af) {
    return path.join(config.fmSrc, af);
});


let runTimestamp = Math.round(Date.now()/1000);

// -------- 生成项目模板 ----------------
gulp.task('init', () => {
    _.mkdirs();
});




// -------- 服务器 ----------------
// nodemon 自动重启
// 自动刷新
gulp.task('server', () => {
    nodemon({
        script: './_gms/server.js',
        watch: [config.asyncPath]
    }).on('restart', function() {
        logger.info('\n server restarted.. ');
    });
    startLivereload();
    gulp.watch(config.server.livereload.concat(_.handleUrlPath(config.distPath) + '/**/*.html'), notifyLivereload);
});

function startLivereload() {
    lr.listen(35729, function() {
        logger.muted('livereload listen at port ' + 35729);
    });
}
function notifyLivereload(event) {
    let fileName = path.relative(config.server.root, event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    });  
}



// fmpp编译freemarker
// 第一次会把template下的ftl全部编译
// 之后watch改变的文件
gulp.task('fmpp:compile', () => {
    _.travelRouters();
});

gulp.task('fmpp', ['fmpp:compile'], () => {
    gulp.watch(allfms.concat(_.handleUrlPath(config.syncPath) + '/**/*.tdd'), (event) => {
        let pathname = event.path;
        let ext = path.extname(pathname);
        pathname = ext === '.tdd' ? path.relative(config.syncPath, pathname) : path.relative(config.fmSrc, pathname);
        pathname = _.handleFilePath(pathname);
        _.execFmpp(pathname, function(err) {
            if(err) logger.warning(err);
        });
    });
});


// ----------  style -------------------------
let mcssSrc = _.handleUrlPath(config.style.src);
gulp.task('mcss:compile', () => {
    return gulp.src([ mcssSrc + '/**/*.mcss', '!' + mcssSrc + '/**/_*.mcss' ])
        .pipe(mcss())
        .pipe(gulp.dest(config.style.dist));
});

gulp.task('mcss', ['mcss:compile'], () => {
    gulp.watch(mcssSrc + '/**/*.mcss', ['mcss:compile']);
});

// -------- iconfont -----------------------
let targetPath = path.relative(config.iconfont.dist, path.join(mcssSrc, config.iconfont.cssName));
let fontPath = path.relative(targetPath, config.iconfont.dist);
gulp.task('iconfont', () => {
    return gulp.src(config.iconfont.src)
        .pipe(iconfontCss({
            fontName: config.iconfont.fontName,
            path: config.iconfont.cssTpl,
            targetPath: targetPath,
            fontPath: fontPath,
            cssClass: config.iconfont.fontClass
        }))
        .pipe(iconfont({
            fontName: config.iconfont.fontName,
            prependUnicode: true,
            normalize: true,
            fontHeight: 1001,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            timestamp: runTimestamp
        }))
        .pipe(gulp.dest(config.iconfont.dist));
}); 



// All gulp tasks
gulp.task('default', gulpSequence('mcss', 'fmpp', 'server'));