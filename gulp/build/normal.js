
var config = require('../../gulp.config.js')
if(!config.tasks.build.normal) return

var gulp = require('gulp')
var del = require('del')
var replace = require('gulp-replace')
var CleanCSS = require('clean-css')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var merge = require('merge-stream')
var sourcemaps = require('gulp-sourcemaps')
var gulpSequence = require('gulp-sequence')
var md5 = require('gulp-md5-plus')
var path = require('path')
var fs = require('fs')

var normal = config.tasks.build.normal

var scriptReg = /<script.+src="(.+\.js)".*><\/script>/g

// {
//   filename: [js1, js2...]
// }
var paths = [];

// travel dir sync
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function(file) {
        var pathname = path.join(dir, file)

        if(fs.statSync(pathname).isDirectory()) {
            travel(file, callback)
        } else {
            callback(pathname)
        }
    })
}

gulp.task('normal:clean', function() {
    del.sync([path.join(normal.pub, '/**/*.js'), path.join(normal.dest, '/**/*.ftl')])
})

gulp.task('extract', function() {
    travel(normal.src, function(p) {
        var content = fs.readFileSync(p, 'utf8'),
            matches = scriptReg.exec(content),
            jss = []

        jss.push(path.join('./', matches[1]))
        while(matches != null) {
            matches = scriptReg.exec(content)
            if(matches) jss.push(path.join('./', matches[1]))
        }
        paths.push({ filename: p, scripts: jss })
    })
})

gulp.task('compress', function() {
    paths.forEach(function(p) {
        var struct = path.parse(p.filename),
            mininame = struct.name + '.min.js'

        gulp.src(p.scripts)
            .pipe(concat(mininame))
            .pipe(uglify())
            .pipe(gulp.dest(normal.pub))

        gulp.src(p.filename)
            .pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
                var style = fs.readFileSync(path.join('./' + filename), 'utf-8')
                return '<style>\n' + new CleanCSS().minify(style).styles + '\n</style>'
            }))
            .pipe(replace(/(\s*<script.+src="(.+\.js)".*><\/script>\s*)+/g, function(s, filename) {
                return '\n<script src="' + normal.pub.replace('.', '') + '/' + mininame + '"></script>\n';
            }))
            .pipe(gulp.dest(normal.dest))
    })
})

gulp.task('normal:rev', function() {
    gulp.src(path.join(normal.pub, '/**/*.js'))
        .pipe(md5(10, path.join(normal.dest, '/**/*.ftl')))
        .pipe(gulp.dest(normal.pub))
})

gulp.task('normal', gulpSequence('normal:clean', 'extract', 'compress', 'normal:rev'))

