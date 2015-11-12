
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

//需要配置项
var PathConfig = {
	ftlSrc: './src/index.ftl',
	inlineDist: './template/',
	imageSrc: './img/',
	livereloadSrc: ['./js/*.js', './css/*.css', './dist/index.html'],
	liveInlineSrc: ['./src/index.ftl', './js/*.js', './css/*css'],
	fmppSrc: ['./src/index.ftl', './mock/index.tdd'],
	lintSrc: './js/*.js'
}

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

gulp.task('server', function() {
	connect.server({
		livereload: true
	})
})

gulp.task('image', function() {
	gulp.src(PathConfig.imageSrc + '*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(PathConfig.imageSrc))
})

gulp.task('livereload', function() {
	gulp.src(PathConfig.livereloadSrc)
		.pipe(watch(PathConfig.livereloadSrc))
		.pipe(connect.reload())
})

gulp.task('watchInline', function() {
	gulp.watch(PathConfig.liveInlineSrc, ['inline']);
})

gulp.task('watchFmpp', function() {
	gulp.watch(PathConfig.fmppSrc, function() {
		exec('fmpp', function(err) {
			if(err) throw err;
			else console.log('ftl to html successfully!')
		})
	})
})

gulp.task('lint', function() {
	gulp.src(PathConfig.lintSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
})

gulp.task('default', ['inline', 'server', 'livereload', 'watchInline', 'watchFmpp'])