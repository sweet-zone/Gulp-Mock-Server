
# 基于 gulp 实现前端 Server

## 写在前面

Web开发是一个前后端合作的工作，但在开发的前期，双方约定好接口和数据后，就进入了各自的开发，这时候前端就需要有自己的开发环境，能够与最后和后端联调时后端提供的服务器能力接近，并且能够简化前端的工作流程，自动化完成相关任务。gulp就是这样一个工具，允许我们编写一系列的task，只需一个命令即可运行监听我们想执行的动作，并且gulp是基于编程的，给了我们更多自己动手的可能。

那我们具体需要怎样的一套环境呢：
* 根据 mock 数据和我们编写的模板输出html文件
* 开启服务器调试，服务器具有输出接口的能力
* css 预处理、字体图标制作等其他任务
* 当测试设备过多时，在文件改动时能够自动刷新以方便查看页面

这样，我们就可以不必依赖后端的环境和数据，在约定接口后各自开发，直到联调。除非有接口变动，基本不会出错，bug率大大降低。可以腾出更多的时间和大家交(shui)流(qun)技(dou)术(meizi)。

## 后端模板支持

虽然现在是 ajax 的天下了，不过有些数据还是通过页面同步输出的，这里我们使用的使用的是 FreeMarker 模板。前端是不能直接解析这些模板文件，所以调试起来就很麻烦。以前看过好多人先写  html 后缀的文件，然后造假的节点放到页面中，开始调样式，调试好后再改造成为后端模板文件。这样做效率很低，很难保证不会在复制粘贴中出错。

所以需要找到编译的工具：[FMPP - FreeMarker-based file PreProcessor](http://fmpp.sourceforge.net/manual.html)，基于Freemarker的文件预处理器，就像我们用的CSS预处理器一样。通过他摆脱后端环境的束缚。总的来说: HTML = FTL + DATA. FMPP 就是通过数据和模板生成 html 文件, 和后端渲染输出是一个道理，可以做到和后端环境无差别。

*注：使用前先下载并加入环境变量*

## 异步接口支持

之前结合FMPP只是解决了同步接口的问题，那对于异步接口，我们如何mock数据进行调试呢。这里引入了优秀而且简单的 [express]( http://expressjs.com/4x/api.html), 借助 express 强大的路由来实现前端模拟异步接口的功能。

同时可以引入gulp-nodemon插件，在你修改了异步接口后，不必重启gulp，服务器会自动重启。

## 其他 gulp 任务

gulp 提供了许多有用的插件，可以串联起来完成很复杂的操作。我这里只写了mcss 和 iconfont 两个任务。

## 如何使用

### 填写配置

```js

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

    //...
}
```

在这里重点关注 `router` 配置，为了和后端环境保证一致，需要配置和后端约定好的路由和路由对应的模板地址。当启动 express 服务器时，直接访问路由，就会去找对应的模板渲染的 html。

如果有自己的扩展任务也建议将配置项配置在这里，然后在 `_gms/parseConfig.js` 中解析，完成其他任务。

在填写完配置后，首先运行 `gulp init`，会根据 `freemarker` 项生成项目初始目录。

### 运行 gulp 命令 

```bash
gulp 
```

运行效果大致如图：

![gms](https://raw.githubusercontent.com/zjzhome/Gulp-Mock-Server/master/screenshot/gms.jpg)


## 总结

这里只是实现了最简单的前端 Server 的功能，其实还有事情可做，比如接口管理、接口测试、文档管理等等。现在有很多高大上的 Mock Server 了，比如网易的 [NEI](https://nei.netease.com/)。

不过基于 Gulp 实现，可以很好的结合前端的一些自动化任务在里面，关注接口的同时也能同时处理其他事情，而且也很容易扩展，可以使用其他的后端模板，也可以使用其他插件来扩展前端任务。












