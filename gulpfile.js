
var gulp = require('gulp'),
	replace = require('gulp-replace'),
	connect = require('gulp-connect'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	watch = require('gulp-watch'),
	fs = require('fs'),
	CleanCSS = require('clean-css'),
	UglifyJS = require('uglify-js')

//需要配置项
var path = {
	srcFtl: './src/index.ftl',
	inlineFtl: './template/',
	imageSrc: './img/'
}

gulp.task('inline', function() {
	gulp.src(path.srcFtl)
		.pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
			var style = fs.readFileSync(__dirname + filename, 'utf-8');
			return '<style>\n' + new CleanCSS().minify(style).styles + '\n</style>';
		}))
		.pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
			return '<script>\n' + UglifyJS.minify(__dirname + filename).code + '\n</script>';
		}))
		.pipe(gulp.dest(path.inlineFtl));
})

gulp.task('server', function() {
	connect.server({
		livereload: true
	})
})

gulp.task('image', function() {
	gulp.src(path.imageSrc + '*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(path.imageSrc))
})

gulp.task('livereload', function() {
	gulp.src(['./js/*.js', './css/*.css', './dist/index.html'])
		.pipe(watch(['./js/*.js', './css/*.css', './dist/index.html']))
		.pipe(connect.reload())
})

gulp.task('watch', function() {
	gulp.watch('./js/*.js', ['inline'])
	gulp.watch('./css/*css', ['inline'])
})

gulp.task('default', ['inline', 'server', 'livereload', 'watch'])