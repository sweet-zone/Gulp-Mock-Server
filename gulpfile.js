
'use strict';

let gulp = require('gulp');
let connect = require('gulp-connect');
let watch = require('gulp-watch');
let mcss = require('gulp-mcs');
let lr = require('tiny-lr')();
let exec = require('child_process').exec;
let iconfont = require('gulp-iconfont');
let iconfontCss = require('gulp-iconfont-css');

let express = require('express');
let app = express();

// Path Setting
let PathConfig = {
    mcssSrc: ['./src/mcss/**/*', '!./src/mcss/common/*.mcss'],
    cssDist: './src/css/',
    livereloadSrc: ['./src/js/*.js', './src/css/*.css', './dist/*.html'], 
    fmppSrc: ['./template/index.ftl', './mock/index.tdd', './mock/foo.json'],
    svgSrc: './src/svg/*.svg',
    fontDist: './src/fonts/'                  
}

let runTimestamp = Math.round(Date.now()/1000);

// express server setting
const EXPRESS_ROOT = __dirname;
const EXPRESS_PORT = 9000;
const APICONFIG = './mock/async.api.js';
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

// express服务器
function startExpress() {
    let bodyParser = require('body-parser');
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

   let apis = require(APICONFIG);
   for(let key in apis) {
       let method = key.split(/\s+/)[0].toLowerCase(),
           url = key.split(/\s+/)[1];

       app[method](url, apis[key]);
   }

    let server = app.listen(EXPRESS_PORT, function() {
        let host = server.address().address;
        let port = server.address().port;
        console.log('async server listening at http://%s:%s', host, port)
    });
}
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
    startExpress();
    startLivereload();
    gulp.watch(PathConfig.livereloadSrc, notifyLivereload);
});

gulp.task('fmpp:compile', () => {
    return exec('fmpp -C mock/config.fmpp', function(err, stdout, stderr) {
        if(stdout) console.log(stdout);
        if(stderr) console.log(stderr);
        if(err) console.log('exec error: ', err);
    });
});
gulp.task('fmpp', ['fmpp:compile'], () => {
    gulp.watch(PathConfig.fmppSrc, ['fmpp:compile']);
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

//默认启动
gulp.task('default', ['mcss', 'fmpp', 'server:express']);