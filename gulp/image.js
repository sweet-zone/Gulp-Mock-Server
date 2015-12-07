
var config = require('../gulp.config.js')
if(!config.tasks.image) return

var gulp = require('gulp')
var changed = require('gulp-changed')
var imagemin = require('gulp-imagemin')
var path = require('path')

var paths = {
    src: path.join(config.tasks.image.src, '/**/*'),
    dest: config.tasks.image.dest
}

gulp.task('image', function() {
    gulp.src(paths.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dest))
})