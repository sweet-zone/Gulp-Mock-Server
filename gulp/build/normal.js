
var config = require('../../gulp.config.js')
if(!config.tasks.build.normal) return

var gulp = require('gulp')
var clean = require('gulp-clean')
var replace = require('gulp-replace')
var CleanCSS = require('clean-css')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var gulpSequence = require('gulp-sequence')
var path = require('path')
var fs = require('fs')

var normal = config.tasks.build.normal

gulp.task('clean:pub', function() {
    gulp.src(path.join(normal.pub, '/**/*'))
        .pipe(clean())
})

gulp.task('extract', function() {
    gulp.src(normal.src)
        .pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
            return s;
        }))
})

gulp.task('compress', function() {

})

gulp.task('replace', function() {

})

gulp.task('md5', function() {

})

gulp.task('normal', function() {

})

