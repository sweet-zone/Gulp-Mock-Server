
'use strict';

let express = require('express');
let app = express();

// express server setting
const EXPRESS_ROOT = __dirname;
const EXPRESS_PORT = 9000;
const APICONFIG = './mock/async.api.js';
const LIVEPORT = 35729;

// express服务器
function startExpress() {
    let bodyParser = require('body-parser');
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

   let apis = require(APICONFIG);
   for(let key in apis) {
       let method = key.split(/\s+/)[0].toLowerCase(),
           url = key.split(/\s+/)[1];

       app[method](url, apis[key]);
   }

    let server = app.listen(EXPRESS_PORT, function() {
        let host = server.address().address;
        let port = server.address().port;
        console.log('async server listening at http://%s:%s', host, port)
    });
}

startExpress();