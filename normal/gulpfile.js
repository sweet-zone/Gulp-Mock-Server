
var gulp = require('gulp'),
	clean = require('gulp-clean'),
	replace = require('gulp-replace'),
	connect = require('gulp-connect'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
	mcss = require('gulp-mcs'),
	exec = require('child_process').exec

// 需要配置项
var PathConfig = {
	mcssSrc: './mcss/*.mcss',
	ftlSrc: './src/index.ftl',  // Freemarker模板
	inlineDist: './template/',  // 压缩js, css后更改引用后的模板的所在目录
	imageSrc: './img/',         // 图片目录
	livereloadSrc: ['./js/*.js', './css/*.css', './dist/index.html'], // 自动刷新监听文件/目录
	liveInlineSrc: ['./src/index.ftl', './js/*.js', './css/*css'],    // 自动改变模板监听文件/目录
	fmppSrc: ['./src/index.ftl', './mock/index.tdd'],                 // 自动执行fmpp监听文件/目录
	
	cssSrc: [],                 // 合并压缩CSS源文件, 根据ftlSrc自动识别
	jsSrc: [],					// 合并压缩JS源文件, 根据ftlSrc自动识别
	minCSS: 'index.min.css',    // 合并压缩后的CSS文件名
	minJS: 'index.min.js',      // 合并压缩后的JS文件名
	mapDist: './maps/',         // sourcemap文件目录
	compressDist: './pub/'      // js/css压缩后的目录
}

// 静态服务器
// 并开启自动刷新
gulp.task('webserver', function() {
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

// 自动进行fmpp
gulp.task('watchFmpp', function() {
	gulp.watch(PathConfig.fmppSrc, function() {
		exec('fmpp', function(err) {
			if(err) throw err;
			else console.log('ftl to html successfully!')
		});
	});
});

// mcss to css
gulp.task('mcss', function() {
	gulp.src(PathConfig.mcssSrc)
		.pipe(mcss())
		.pipe(gulp.dest('./css/'))
})

gulp.task('watchMcss', function() {
	gulp.watch(PathConfig.mcssSrc, ['mcss']);
})

// 分析模板
// 压缩资源到指定目录
// 然后内嵌到模板文件
// 每次合并压缩前先删除原来的文件
gulp.task('extract', function() {
	return gulp.src(PathConfig.ftlSrc)
		.pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
			PathConfig.cssSrc.push(__dirname + filename);
			return s;
		}))
		.pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
			PathConfig.jsSrc.push(__dirname + filename);
			return s;
		}))
		.pipe(gulp.dest(PathConfig.inlineDist));
});

gulp.task('cleanCSS', function() {
	var p = PathConfig.compressDist
	return gulp.src([p + '*.css', p + 'maps/*.min.css.map', p + '*.css.json'], { read: false })
			.pipe(clean());
});
gulp.task('compressCSS', ['extract', 'cleanCSS'], function() {
	return gulp.src(PathConfig.cssSrc)
		.pipe(sourcemaps.init())
		.pipe(concat(PathConfig.minCSS))
		.pipe(minifyCSS())
		.pipe(rev())
		.pipe(sourcemaps.write(PathConfig.mapDist))
		.pipe(gulp.dest(PathConfig.compressDist))
		.pipe(rev.manifest('manifest.css.json'))
		.pipe(gulp.dest(PathConfig.compressDist));
});
gulp.task('cleanJS', function() {
	var p = PathConfig.compressDist
	return gulp.src([p + '*.js', p + 'maps/*.min.js.map', p + '*.js.json'], { read: false })
			.pipe(clean());
});
gulp.task('compressJS', ['extract', 'cleanJS'], function() {
	return gulp.src(PathConfig.jsSrc)
		.pipe(sourcemaps.init())
		.pipe(concat(PathConfig.minJS))
		.pipe(uglify())
		.pipe(rev())
		.pipe(sourcemaps.write(PathConfig.mapDist))
		.pipe(gulp.dest(PathConfig.compressDist))
		.pipe(rev.manifest('manifest.js.json'))
		.pipe(gulp.dest(PathConfig.compressDist));
});

gulp.task('inline', ['compressJS', 'compressCSS'], function() {
	var p = PathConfig.compressDist.replace('.', '');
	return gulp.src(PathConfig.ftlSrc)
		.pipe(replace(/(\s*<link.+href=".+\.css".*>\s*)+/g, function(s, filename) {
			return '\n<link rel="stylesheet" type="text/css" href="' + p + PathConfig.minCSS + '">\n';
		}))
		.pipe(replace(/(\s*<script.+src="(.+\.js)".*><\/script>\s*)+/g, function(s, filename) {
			return '\n<script src="' + p + PathConfig.minJS + '"></script>\n';
		}))
		.pipe(gulp.dest(PathConfig.inlineDist));
});

gulp.task('rev', ['inline'], function() {
	gulp.src(['./pub/*.json', PathConfig.inlineDist + '*.ftl'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest(PathConfig.inlineDist));
});

// 自动进行内联操作
gulp.task('watchRev', function() {
	gulp.watch(PathConfig.liveInlineSrc, ['rev']);
});

gulp.task('default', ['rev', 'webserver', 'livereload', 'watchRev', 'watchFmpp']);
gulp.task('server', ['mcss', 'webserver', 'livereload', 'watchFmpp', 'watchMcss']);
gulp.task('compress', ['rev', 'watchRev']);