
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch'),
	mcss = require('gulp-mcs'),
	exec = require('child_process').exec

// 需要配置项
var PathConfig = {
	mcssSrc: './mcss/*.mcss',
	cssDist: './css/',
	livereloadSrc: ['./js/*.js', './css/*.css', './dist/index.html'], // 自动刷新监听文件/目录
	fmppSrc: ['./src/index.ftl', './mock/index.tdd', './mock/foo.json']                  // 自动执行fmpp监听文件/目录
}

// 静态服务器
// 并开启自动刷新
gulp.task('webserver', function() {
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
})

// 通知服务器何时进行自动刷新
gulp.task('livereload', function() {
	gulp.src(PathConfig.livereloadSrc)
		.pipe(watch(PathConfig.livereloadSrc))
		.pipe(connect.reload())
})

// 自动进行fmpp
gulp.task('fmpp', function() {
	exec('fmpp', function(err) {
		if(err) throw err;
		else console.log('ftl to html successfully!')
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

gulp.task('default', ['mcss', 'fmpp', 'webserver', 'livereload', 'watchFmpp', 'watchMcss']);