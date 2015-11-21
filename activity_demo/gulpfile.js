
var gulp = require('gulp'),
	replace = require('gulp-replace'),
	connect = require('gulp-connect'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	watch = require('gulp-watch'),

	jshint = require('gulp-jshint'),

	fs = require('fs'),
	CleanCSS = require('clean-css'),
	UglifyJS = require('uglify-js'),
	exec = require('child_process').exec

// 需要配置项
var PathConfig = {
	ftlSrc: './src/index.ftl',  // Freemarker模板
	inlineDist: './template/',  // 内联js, css后生成的模板的所在目录
	imageSrc: './img/',         // 图片目录
	livereloadSrc: ['./js/index.js', './css/index.css', './dist/index.html'], // 自动刷新监听文件/目录
	liveInlineSrc: ['./src/index.ftl', './js/*.js', './css/*css'],    // 自动内联监听文件/目录
	fmppSrc: ['./src/index.ftl', './mock/index.json'],                 // 自动执行fmpp监听文件/目录
	lintSrc: './js/*.js'        // jshint检查文件目录
}

// 模板内联js, css到指定文件
// 替换link的href以及script的src, 并执行压缩
gulp.task('inline', function() {
	gulp.src(PathConfig.ftlSrc)
		.pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
			var style = fs.readFileSync(__dirname + filename, 'utf-8');
			return '<style>\n' + new CleanCSS().minify(style).styles + '\n</style>';
		}))
		.pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
			return '<script>\n' + UglifyJS.minify(__dirname + filename).code + '\n</script>';
		}))
		.pipe(gulp.dest(PathConfig.inlineDist));
})

// 静态服务器
// 并开启自动刷新
gulp.task('server', function() {
	connect.server({
		livereload: true
	})
})

// 压缩图片
gulp.task('image', function() {
	gulp.src(PathConfig.imageSrc + '*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(PathConfig.imageSrc))
})

// 通知服务器何时进行自动刷新
gulp.task('livereload', function() {
	gulp.src(PathConfig.livereloadSrc)
		.pipe(watch(PathConfig.livereloadSrc))
		.pipe(connect.reload())
})

// 自动进行内联操作
gulp.task('watchInline', function() {
	gulp.watch(PathConfig.liveInlineSrc, ['inline']);
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

// jshint静态代码检查
gulp.task('lint', function() {
	gulp.src(PathConfig.lintSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
})

gulp.task('default', ['fmpp', 'inline', 'server', 'livereload', 'watchInline', 'watchFmpp'])

