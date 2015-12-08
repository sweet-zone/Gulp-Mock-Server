
var gulp = require('gulp')
var gutil = require('gulp-util')
var del = require('del')
var webpack = require('webpack')
var gutil = require('gulp-util')
var md5 = require('gulp-md5-plus')
var gulpSequence = require('gulp-sequence')
var CleanCSS = require('clean-css')
var webpackConfig = require('../../webpack.config.js')
var path = require('path')

var config = require('../../gulp.config.js');
var pathConfig = config.tasks.webpack

gulp.task('webpack:clean', function() {
    return del.sync([path.join(pathConfig.pub, '/**/*.js'), path.join(pathConfig.dest, '/**/*.ftl')])
});
gulp.task('webpack:build', function() {

    var buildConfig = Object.create(webpackConfig);
    buildConfig.plugins = buildConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );
    buildConfig.output.path = path.join(__dirname, pathConfig.pub.replace('.', ''))

    webpack(buildConfig, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString({
            color: true
        }));
    });
});

gulp.task('replace', function() {
    return gulp.src(pathConfig.src)
        .pipe(replace(/<script.+src="\/(dev)\/.+\.js".*><\/script>/g, function(s, dev) {
            return s.replace(dev, pathConfig.pub.replace('./', ''));
        }))
        .pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
            var style = fs.readFileSync(__dirname + filename, 'utf-8');
            return '<style>\n' + new CleanCSS().minify(style).styles + '\n</style>';
        }))
        .pipe(gulp.dest(pathConfig.dest))
});

gulp.task('md5', function() {
    gulp.src(path.join(pathConfig.pub, '/**/*.js'))
        .pipe(md5(10, path.join(pathConfig.dest, '/**/*.ftl')))
        .pipe(gulp.dest(pathConfig.pub))
});

gulp.task('build', gulpSequence('webpack:clean', 'webpack:build', 'replace', 'md5'));