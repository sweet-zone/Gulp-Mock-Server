
'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: './mock/uploads/' });
let app = express();

// express server setting
const EXPRESS_ROOT = __dirname;
const EXPRESS_PORT = 9000;
const APICONFIG = './mock/async/';
const LIVEPORT = 35729;

// express服务器
function startExpress() {
    let bodyParser = require('body-parser');
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    fs.readdirSync(APICONFIG).forEach( (file) => {
        let pathname = path.join(APICONFIG, file);
        let apis = require('./' + pathname);
        for(let key in apis) {

            let route = key.split(/\s+/);
            let method = route[0].toLowerCase();
            let url = route[1];
            let form = route[2];
            if(form) {
                app[method](url, upload.single(form), apis[key]);
            } else {
                app[method](url, apis[key]);
            }
        }
    });

    let server = app.listen(EXPRESS_PORT, () => {
        let host = server.address().address;
        let port = server.address().port;
        console.log(chalk.magenta('async server listening at http://%s:%s', host, port));
    });
}

startExpress();