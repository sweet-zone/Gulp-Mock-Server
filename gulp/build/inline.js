
var config = require('../../gulp.config.js')
if(!config.tasks.build.inline) return

var gulp = require('gulp')
var replace = require('gulp-replace')
var CleanCSS = require('clean-css')
var UglifyJS = require('uglify-js')
var fs = require('fs')
var path = require('path')

var inline = config.tasks.build.inline

gulp.task('inline:replace', function() {
    gulp.src(inline.src)
        .pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
            var style = fs.readFileSync(path.join('./' + filename), 'utf-8')
            return '<style>\n' + new CleanCSS().minify(style).styles + '\n</style>'
        }))
        .pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
            return '<script>\n' + UglifyJS.minify(path.join('./' + filename)).code + '\n</script>'
        }))
        .pipe(gulp.dest(inline.dest));
})

gulp.task('inline:watch', function() {
    gulp.watch(inline.liveInlineSrc, ['inline:watch'])
})

gulp.task('inline', ['inline:replace', 'inline:watch'])