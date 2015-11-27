
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    mcss = require('gulp-mcs'),
    exec = require('child_process').exec,
    lr = require('tiny-lr')()

// 需要配置项
var PathConfig = {
    mcssSrc: './mcss/*.mcss',
    cssDist: './css/',
    livereloadSrc: ['./js/*.js', './css/*.css', './dist/index.html'], // 自动刷新监听文件/目录
    fmppSrc: ['./template/index.ftl', './mock/index.tdd', './mock/foo.json']                  // 自动执行fmpp监听文件/目录
}

// 静态服务器
// 并开启自动刷新
gulp.task('server:connect', function() {
    connect.server({
        port: 9000,
        livereload: true,
        middleware: function(connect, opt) {
            var Proxy = require('gulp-connect-proxy');
            opt.route = '/rest'; // localhost:9000/rest/hostname.com/xxx will be proxied, no http(s) prefix..
            var proxy = new Proxy(opt);
            return [proxy];
        }
    })
});

// 通知服务器何时进行自动刷新
gulp.task('livereload:connect', function() {
    gulp.src(PathConfig.livereloadSrc)
        .pipe(watch(PathConfig.livereloadSrc))
        .pipe(connect.reload())
});

// express服务器
function startExpress() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(__dirname));

    app.get('/rest/hh', function(req, res) {
        res.json({"hello":"ws"})
    });

    var server = app.listen(8000, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('async server listening at http://%s:%s', host, port)
    });
}
function startLivereload() {
    lr.listen(35729, function() {
        console.log('livereload listen at port 35729');
    });
}
function notifyLivereload(event) {
    var fileName = require('path').relative(__dirname, event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    });   
}

gulp.task('server:express', function() {
    startExpress();
    startLivereload();
    gulp.watch(PathConfig.livereloadSrc, notifyLivereload);
});

// 自动进行fmpp
gulp.task('fmpp', function() {
    exec('fmpp', function(err, stdout, stderr) {
        if(stdout) console.log(stdout);
        if(stderr) console.log(stderr);
        if(err) console.log('exec error: ', err);
    })
})
gulp.task('watchFmpp', function() {
    gulp.watch(PathConfig.fmppSrc, ['fmpp']);
})

// mcss to css
gulp.task('mcss', function() {
    gulp.src(PathConfig.mcssSrc)
        .pipe(mcss())
        .pipe(gulp.dest(PathConfig.cssDist))
})

gulp.task('watchMcss', function() {
    gulp.watch(PathConfig.mcssSrc, ['mcss']);
})

//默认启动
gulp.task('default', ['mcss', 'fmpp', 'server:express', 'watchFmpp', 'watchMcss']);