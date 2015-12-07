
var config = require('../gulp.config.js');
if(!config.tasks.fmpp) return

var gulp = require('gulp')
var gutil = require('gulp-util')
var exec = require('child_process').exec

var fmppSrc = config.tasks.fmpp.fmppSrc

gulp.task('fmpp:compile', function() {
    exec('fmpp', function(err, stdout, stderr) {
        if(stdout) gutil.log(gutil.colors.green(stdout));
        if(stderr) gutil.log(gutil.colors.magenta(stderr));
        if(err) gutil.log(gutil.colors.red('exec error: ', err));
    })
})

gulp.task('fmpp:watch', function() {
    gulp.watch(fmppSrc, ['fmpp:compile']);
})

gulp.task('fmpp', ['fmpp:compile', 'fmpp:watch'])