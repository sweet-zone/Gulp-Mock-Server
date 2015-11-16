
var gulp = require('gulp'),
	clean = require('gulp-clean'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch'),
	exec = require('child_process').exec

// 需要配置项
var PathConfig = {
	ftlSrc: './src/index.ftl',  // Freemarker模板
	inlineDist: './template/',     // 压缩js, css后更改引用后的模板的所在目录
	livereloadSrc: ['./js/*.js', './css/*.css', './dist/index.html'], // 自动刷新监听文件/目录
	fmppSrc: ['./src/index.ftl', './mock/index.tdd'],                 // 自动执行fmpp监听文件/目录
}

// 静态服务器
// 并开启自动刷新
gulp.task('webserver', function() {
	connect.server({
		livereload: true
	})
})

// 通知服务器何时进行自动刷新
gulp.task('livereload', function() {
	gulp.src(PathConfig.livereloadSrc)
		.pipe(watch(PathConfig.livereloadSrc))
		.pipe(connect.reload())
})

gulp.task('clean', function() {
	return gulp.src('./dist/index.html', { read: false, force: true })
			.pipe(clean());
});
// 自动进行fmpp
gulp.task('watchFmpp', ['clean'], function() {
	gulp.watch(PathConfig.fmppSrc, function() {
		exec('fmpp', function(err) {
			if(err) throw err;
			else console.log('ftl to html successfully!')
		});
	});
});

gulp.task('default', ['webserver', 'livereload', 'watchFmpp'])