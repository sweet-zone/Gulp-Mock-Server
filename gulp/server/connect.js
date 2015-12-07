
var config = require('../../gulp.config.js')
if(!config.tasks.server) return

var gulp = require('gulp')
var connect = require('gulp-connect')
var watch = require('gulp-watch')

var server = config.tasks.server
var livereloadSrc = server.livereloadSrc

// 静态服务器
// 并开启自动刷新
gulp.task('server:connect', function() {
    connect.server({
        root: server.root,
        port: server.port,
        livereload: true
    })
})

// 通知服务器何时进行自动刷新
gulp.task('livereload:connect', function() {
    gulp.src(livereloadSrc)
        .pipe(watch(livereloadSrc))
        .pipe(connect.reload())
})

gulp.task('connect', ['server:connect', 'livereload:connect']);