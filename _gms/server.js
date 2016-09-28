
'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const multer  = require('multer')
const express = require('express');

const config = require('./parseConfig.js');
const _ = require('./util.js');
const logger = require('./logger.js');

let upload = multer({ dest: path.join(config.mockPath, 'upload') });
let app = express();

// express res.sendFile options
let sfoptions = {
    root: config.distPath,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
};

// 当访问url 
// 查找路由对应的ftl文件, 输出dist对应的html页面
// express中间件
let fmppParser = function(req, res, next) {
    let curUrl = req.originalUrl;
    if( curUrl.indexOf('/favicon.ico') > -1 ) return;

    curUrl = _.handleUrlPath(curUrl);
    let curfm = config.router[curUrl] || config.router[curUrl + '/'];
    if(curfm) {
        curfm = _.handleFilePath(curfm);
        
        logger.info('navigate to: ' + curfm);
        res.sendFile(curfm + '.html', sfoptions, function(err) {
            if(err) {
                logger.warning(err);
                // todo retry compile template
            }
            next();
        });
    } else {
        next();
    }
}


// express服务器
function startServer() {
    let bodyParser = require('body-parser');
    app.use(require('connect-livereload')());
    app.use(fmppParser);
    app.use(express.static(config.server.root));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    fs.readdirSync(config.asyncPath).forEach( (file) => {
        let pathname = path.join(config.asyncPath, file);
        let apis = require('../' + pathname);
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

    let sv = app.listen(config.server.port, () => {
        let host = sv.address().address;
        let port = sv.address().port;
        logger.muted('\nserver listening at http://' + host + ':' + port);
    });
}

startServer();