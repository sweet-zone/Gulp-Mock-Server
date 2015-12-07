
var gulp = require('gulp')

gulp.task('default', ['fmpp', 'mcss', 'express'])
gulp.task('acticity', ['fmpp', 'mcss', 'express', 'inline'])