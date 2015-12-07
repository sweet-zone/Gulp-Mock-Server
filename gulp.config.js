module.exports = {

    tasks: {

        fmpp: {
            fmppSrc: ['./template/**/*.ftl', './mock/**/*']
        },

        server: {
            root: __dirname,
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
        }

    }
}