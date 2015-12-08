
var path = require('path')

module.exports = {

    tasks: {

        fmpp: {
            fmppSrc: ['./template/**/*.ftl', './mock/**/*']
        },

        server: {
            root: __dirname,              // for gulp-connect, cant use './'
            port: 9000,
            apiconfig: 'async.api.js',    // where mock async api is, you just write filename
            livereloadSrc: ['./src/js/**/*.css', './src/css/**/*.css', 'dist/**/*.html']
        },

        image: {
            src: './res/image',
            dest: './res/image',
            extensions: ['jpg', 'png', 'svg', 'gif']
        },

        mcss: {
            src: './src/mcss',
            dest: './src/css'
        },

        build: {
            inline: {
                src: './template/**/*.ftl',
                dest: './tpl_inline',
                liveInlineSrc: ['./template/**/*.ftl', './src/css/**/*.css', './src/js/**/*.js']
            },
            normal: {
                src: path.join(__dirname, '/template'), // only folder name
                dest: './tpl_normal',
                pub: './pub_normal'
            },
            webpack: {
                src: './template/**/*.ftl',
                dest: './tpl_webpack',
                pub: './pub_webpack'
            }
        }

    }
}