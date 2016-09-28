
'use strict';

const chalk = require('chalk');

let logger = module.exports;

let map = {
    warning: 'red',
    success: 'green',
    info: 'cyan',
    muted: 'magenta'
}

for(let m in map) {
    logger[m] = function(msg) {
        console.log(chalk[map[m]](msg));
    }
}

