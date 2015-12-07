
var config = require('../gulp.config.js')
if(!config.tasks.mcss) return

var gulp = require('gulp')
var mcss = require('gulp-mcs')
var changed = require('gulp-changed')
var path = require('path')

var paths = {
    src: path.join(config.tasks.mcss.src, '/**/*'),
    dest: config.tasks.mcss.dest
}

gulp.task('mcss:compile', function() {
    gulp.src(paths.src)
        .pipe(changed(paths.dest))
        .pipe(mcss())
        .pipe(gulp.dest(paths.dest))
})

gulp.task('mcss:watch', function() {
    gulp.watch(paths.src, ['mcss:compile'])
})

gulp.task('mcss', ['mcss:compile', 'mcss:watch'])