
/**
 * gulp-mock-server config
 */

module.exports = {
    // freemarker模板设置
    // src 模板根路径
    // mock mock数据路径
    // dist 模板编译后的html路径
    freemarker: {
        src: './template',
        mock: './_mock',
        dist: './_dist'
    },

    // 路由和模板的映射
    // 路由|模板名、数据（tdd）和编译后的html一一对应
    // /user/list <-> /template/user/list.ftl <-> /mock/sync/user/list.tdd <-> /dist/user/list.html
    router: {
        '/': '/index.ftl',
        '/index': '/index.ftl',
        '/user/info': '/user/info.ftl'
    },

    // express服务器设置
    server: {
        root: __dirname,
        port: 8088,
        livereload: ['./src/javascript/**/*.js', './src/css/**/*.css']
    },

    // 样式
    style: {
        src: './src/mcss/',
        dist: './src/css/'
    },

    // 图标字体
    iconfont: {
        src: './res/svg/*.svg',
        dist: './res/fonts/',
        cssTpl: './res/fonts/_icontpl.mcss',
        cssName: 'iconfont.mcss',
        fontName: 'myfont',
        fontClass: 'myicon'
    },


    // sprite
    sprite: {

    },

    // browserSync
    browserSync: {
        proxy: '',
        files: []
    }
}