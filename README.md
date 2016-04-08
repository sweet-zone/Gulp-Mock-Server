# Gulp-Mock-Server
使用FMPP和Gulp快速构建前后端分离的开发环境

## 写在前面

Web开发是一个前后端合作的工作，但在开发的前期，双方约定好接口和数据后，就进入了各自的开发，这时候前端就需要有自己的开发环境，能够与最后和后端联调时后端提供的服务器能力接近，并且能够简化前端的工作流程，自动化完成相关任务。gulp就是这样一个工具，允许我们编写一系列的task，只需一个命令即可运行监听我们想执行的动作，并且gulp是基于编程的，给了我们更多自己动手的可能。

那我们具体需要怎样的一套环境呢：

* 根据mock数据和我们编写的模板输出html文件
* 开启服务器调试, 服务器具有输出接口的能力
* css预处理, 字体图标制作
* 当测试设备过多时, 在文件改动时能够自动刷新以方便查看页面

这样, 我们就可以不必依赖后端的环境和数据, 在约定接口后各自开发, 直到联调. 除非有接口变动, 基本不会出错. bug率大大降低. 可以腾出更多的时间和大家交(shui)流(qun)技(dou)术(meizi).

## 我该如何使用

### 先介绍一下FMPP
[FMPP - FreeMarker-based file PreProcessor](http://fmpp.sourceforge.net/), 基于Freemarker的文件预处理器, 就像我们用的CSS预处理器一样. 通过他拜托后端环境的束缚. 总的来说: HTML = FTL + DATA. FMPP就是通过数据和模板生成html文件, 和后端渲染输出是一个道理.

使用也很简单(如果不考虑那一堆的配置项)
* 准备的你的模板文件
* 准备配置文件**config.fmpp**, 虽然可以命令行带参数, 但谁也不想那么费劲.

```
sourceRoot: src                 // ftl目录
sources: index.ftl              // 需要编译为html的文件, 如果没有此项配置, 那么sourceRoot下的所有ftl都将被编译
outputRoot: dist                // 输出目录
logFile: log.fmpp               // 日志打印目录, 可查看出错信息
modes: [execute(*.ftl)]         // 对sourceRoot下的ftl文件进行操作
replaceExtensions:[ftl,html]    // 编译后后缀改为html
data:tdd(../mock/index.tdd)     // 数据文件, 路径相对于sourceRoot
```

* 准备数据文件
也就是配置文件中最后一项data, 我们看到上文中数据以tdd包裹, 这应该是FMPP自己的一种格式, 当然也可以使用json, 就是类似这样: `data: { user: json(../mock/index.json') }`. 两者类似但又有点不同. 比如两者同样是下面的数据:
```json
{
  "id": 1
}
```
如果是tdd的, id可以直接在模板中用${id}中获得, 但是如果json格式, fmpp会报错, 提示hash没有key, 所以就需要像`data: { user: json(../mock/index.json') }`使用, 在页面中${user.id}使用, 在activity和normal两个demo里可以看到不同的数据格式.

更多配置参考官网: [http://fmpp.sourceforge.net/manual.html](http://fmpp.sourceforge.net/manual.html)

### How I Use

比如gulpfile.js下, 你需要修改的是各个task对应的目录.
```js
// Path Setting
let PathConfig = {
    mcssSrc: ['./src/mcss/**/*', '!./src/mcss/common/*.mcss'],
    cssDist: './src/css/',
    livereloadSrc: ['./src/js/*.js', './src/css/*.css', './dist/*.html'], 
    fmppSrc: ['./template/index.ftl', './mock/index.tdd', './mock/foo.json'],
    svgSrc: './src/svg/*.svg',
    fontDist: './src/fonts/'                  
}
```

这里有一些建议, 以为gulp是资瓷通配符的, 所以强烈建议统一功能或页面的模板或者资源有自己的文件夹, 然后配置里都用通配符识别即可, 比如`ftlSrc: './src/*ftl'`, 同时, 对于activity和normal中, 因为最后template中的模板是经过资源内联或者引用替换的, 强烈建议建立一个类似src的目录开发. 而server下则不用关心.

* 根据约定的接口准备mock数据即可
* 命令行下gulp或者gulp+task运行即可.

## 写在后面

本项目主要对活动页这类比较简单的页面进行了轻量级的前后分离和构建, 由于gulp的方便性, 你也可以扩展自己需要的功能, 比如执行JSHint进行代码检查,总之任意配置达到自己的要求, 从繁杂的业务中抽离出来.

## 2015-11-27更新 增加对异步接口的支持

之前结合FMPP只是解决了同步接口的问题, 那对于异步接口, 我们如何mock数据进行调试呢. 这里引入了优秀的express, 借助express强大的路由来实现前端模拟异步接口的功能.

既然express已经提供服务器的功能, 我们就不再需要gulp-connect了, 自动刷新功能借助connect-livereload和tiny-lr. 具体代码见server以及server_demo下的gulpfile.

你需要做的只是准备一份async.api.js, 里面根据你和后端约定的接口配置一份路由:

```js
module.exports = {
    'get /rest/hh/:id': function(req, res) {
        res.json({"id":req.params.id, "hello":"ws"})
    },
    'get /rest/other': function(req, res) {
        res.json({"id":req.query.id, "hello":"23333"})
    },
    'post /rest/user': function(req, res) {
        if(req.body.username.length > 0 && req.body.password.length > 0) {
            res.json({"code":200, "message":"success"});
        } else {
            res.json({"code":400, "message":"参数错误"});
        }
    },
    'get /rest/com': function(req, res) {
        res.json({"com": "sd"});
    }
}
```

格式和[puer](http://leeluolee.github.io/2014/10/24/use-puer-helpus-developer-frontend/)一样.

然后执行gulp, 爽快的开发吧.

更多express路由的内容: [http://expressjs.com/4x/api.html](http://expressjs.com/4x/api.html)

## 2015-11-27更新 重构gulpfile.js

查看dev分支

## 2016-03-29更新 

生日当天...重写...改仓库名字

## 2016-04-08更新

引入gulp-nodemon插件, 当异步接口改变时, 不必重启gulp.




