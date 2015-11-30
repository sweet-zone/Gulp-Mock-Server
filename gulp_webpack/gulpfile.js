
var gulp = require('gulp');
var gutil = require('gulp-util');
var md5 = require('gulp-md5-plus');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var path = require('path');
var lr = require('tiny-lr')();

var express = require('express');
var app = express();

var EXPRESS_ROOT = __dirname;
var EXPRESS_PORT = 8000;
var APICONFIG = './async.api.js';
var LIVEPORT = 35729;

// 需要配置项
var PathConfig = {
	fmppSrc: ['./template/index.ftl', './mock/index.tdd', './mock/plus.json'],     // 自动执行fmpp监听文件/目录
	livereloadSrc: './dist/**/*'              // 自动刷新监听文件/目录
}

// 自动进行fmpp
gulp.task('fmpp', function() {
	exec('fmpp', function(err, stdout, stderr) {
		if(stdout) console.log(stdout);
		if(stderr) console.log(stderr);
		if(err) console.log('exec error: ', err);
	})
})
gulp.task('watchFmpp', function() {
	gulp.watch(PathConfig.fmppSrc, ['fmpp']);
})

// webpack dev build
var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'sourcemap';
devConfig.debug = true;

gulp.task('webpack:dev', function() {
	webpack(devConfig).run(function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:dev', err);
		gutil.log('[webpack:dev]', stats.toString({
			color: true
		}));
	})
})

gulp.task('dev', ['webpack:dev'], function() {
	gulp.watch(['src/**/*'], ['webpack:dev']);
});

var serverConfig = devConfig;
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

// express server
function startExpress() {
    var bodyParser = require('body-parser');
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

   var apis = require(APICONFIG);
   for(var key in apis) {
       var method = key.split(/\s+/)[0],
           url = key.split(/\s+/)[1];

       app[method](url, apis[key]);
   }

    var server = app.listen(EXPRESS_PORT, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('async server listening at http://%s:%s', host, port)
    });
}
function startLivereload() {
    lr.listen(LIVEPORT, function() {
        console.log('livereload listen at port ' + LIVEPORT);
    });
}
function notifyLivereload(event) {
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    });   
}

gulp.task('server:express', function() {
    startExpress();
    startLivereload();
    gulp.watch(PathConfig.livereloadSrc, notifyLivereload);
});


// webpack production build
gulp.task('clean:pub', function() {
	return gulp.src('./pub/**/*.js', {read: false})
		.pipe(clean())
});
gulp.task('webpack:build', ['clean:pub'], function() {

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
	buildConfig.output.path = path.join(__dirname, '/pub'),

	webpack(buildConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			color: true
		}));
	});
});

// template to tpl
gulp.task('clean:tpl', function() {
	return gulp.src('./tpl/**/*.ftl', {read: false})
		.pipe(clean())
});
gulp.task('replace', ['clean:tpl'], function() {
	return gulp.src('./template/**/*.ftl')
		.pipe(replace(/<script.+src="\/(dist)\/.+\.js".*><\/script>/g, function(s, dist) {
			return s.replace(dist, 'pub');
		}))
		.pipe(gulp.dest('./tpl'))
});

// md5 rev
gulp.task('md5', function() {
	gulp.src('./pub/**/*.js')
		.pipe(md5(10, './tpl/**/*.ftl'))
		.pipe(gulp.dest('./pub'))
});

// tasks
gulp.task('default', ['fmpp', 'dev', 'server:express', 'watchFmpp']);
gulp.task('build', ['webpack:build', 'replace']);
gulp.task('rev', ['md5']);