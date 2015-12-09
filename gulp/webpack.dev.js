
var gulp = require('gulp')
var gutil = require('gulp-util')
var webpack = require('webpack')
var webpackConfig = require('../webpack.config.js')

var devConfig = Object.create(webpackConfig)
devConfig.devtool = 'sourcemap'
devConfig.debug = true

gulp.task('webpack:dev', function() {
    webpack(devConfig).run(function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:dev', err)
        gutil.log('[webpack:dev]', stats.toString({
            color: true
        }))
    })
})

gulp.task('webpack', ['webpack:dev'], function() {
    gulp.watch(['./src/**/*'], ['webpack:dev'])
})