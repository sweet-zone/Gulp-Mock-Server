
var gulp = require('gulp')
var gutil = require('gulp-util')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackConfig = require('../../webpack.config.js')

var serverConfig = Object.create(webpackConfig)
gulp.task('webpack-dev-server', function() {
    new WebpackDevServer(webpack(serverConfig), {
        stats: {
            color: true
        }
    }).listen(8080, '0.0.0.0', function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    })
});