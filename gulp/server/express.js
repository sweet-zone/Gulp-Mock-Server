
var config = require('../../gulp.config.js')
if(!config.tasks.server) return

var gulp = require('gulp')
var gutil = require('gulp-util')
var express = require('express')
var lr = require('tiny-lr')()

var app = express()

var server = config.tasks.server
var livereloadSrc = server.livereloadSrc

function startExpress() {
    var bodyParser = require('body-parser')
    app.use(require('connect-livereload')())
    app.use(express.static(server.root))
    app.use(bodyParser.json())                         // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

   var apis = require('../../' + server.apiconfig)
   for(var key in apis) {
       var method = key.split(/\s+/)[0].toLowerCase(),
           url = key.split(/\s+/)[1]

       app[method](url, apis[key])
   }

    var expresServer = app.listen(server.port, function() {
        gutil.log(gutil.colors.green('async server listening at http://localhost:' + server.port))
    })
}
function startLivereload() {
    lr.listen(35729, function() {
        gutil.log(gutil.colors.green('livereload listen at port ' + 35729));
    })
}
function notifyLivereload(event) {
    var fileName = require('path').relative(server.root, event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    })
}

gulp.task('express', function() {
    startExpress();
    startLivereload();
    gulp.watch(livereloadSrc, notifyLivereload);
})
