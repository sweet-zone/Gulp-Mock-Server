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

### 后端模板支持 - FMPP

[FMPP - FreeMarker-based file PreProcessor](http://fmpp.sourceforge.net/), 基于Freemarker的文件预处理器, 就像我们用的CSS预处理器一样. 通过他拜托后端环境的束缚. 总的来说: HTML = FTL + DATA. FMPP就是通过数据和模板生成html文件, 和后端渲染输出是一个道理.

FMPP官网地址: [http://fmpp.sourceforge.net/manual.html](http://fmpp.sourceforge.net/manual.html).

不过有一点比较不好, FMPP并没有做模板和数据一一对应的工作, 所以只能自己实现. 使用时需要做的是将模板的文件名和数据的文件名一一对应即可, 比如`/template/index.ftl`对应`/mock/index.tdd`, `/template/sub/sub.ftl`对应`/mock/sub/sub.tdd`. 暂时只支持tdd后缀的数据, 确保一个文件对应一个数据.

注: 不过需要麻烦一点就是需要自己下载fmpp, 并将其bin目录加入系统环境变量.

### 异步接口支持

之前结合FMPP只是解决了同步接口的问题, 那对于异步接口, 我们如何mock数据进行调试呢. 这里引入了优秀的express, 借助express强大的路由来实现前端模拟异步接口的功能.

你需要做的只是在/mock/async/内增加接口文件, 里面根据你和后端约定的接口配置一份路由:

```js
module.exports = {
    'get /rest/hh/:id': function(req, res) {
        res.json({"id":req.params.id, "hello":"ws"})
    },
    'post /rest/user': function(req, res) {
        if(req.body.username.length > 0 && req.body.password.length > 0) {
            res.json({"code":200, "message":"success"});
        } else {
            res.json({"code":400, "message":"参数错误"});
        }
    }
}
```

格式和[puer](http://leeluolee.github.io/2014/10/24/use-puer-helpus-developer-frontend/)一样.

**而且引入了gulp-nodemon插件, 在你修改了异步接口后, 不必重启gulp, 服务器会自动重启!**

另外gulpfile.js里还是保留了gulp-connect的静态服务器, 如果仅是静态页面要求, 使用这个就很不错!

更多express路由的内容: [http://expressjs.com/4x/api.html](http://expressjs.com/4x/api.html)

### 其他gulp任务

只需引入插件, css编译, 字体图标处理, 静态代码检查以及其他你想做的!

### 如果你也想这么做

* 安装node 4+, 全局安装gulp
* npm install
* 根据自己的目录修改gulpfile里的相关配置
* 根据约定的接口准备mock数据
* 命令行下gulp或者gulp+task运行


## changelog

### 2015-11-27更新 增加对异步接口的支持

### 2015-11-27更新 重构gulpfile.js

查看dev分支(废弃)

### 2016-03-29更新 

生日当天...重写...改仓库名字

### 2016-04-08更新

引入gulp-nodemon插件, 当异步接口改变时, 不必重启gulp.

### 2016-04-21更新

将freemarker模板和数据一一对应备受吐槽,  去掉config.fmpp, 直接使用命令行. 使用时需要做的是将模板的文件名和数据的文件名一一对应即可, 比如`/template/index.ftl`对应`/mock/index.tdd`, `/template/sub/sub.ftl`对应`/mock/sub/sub.tdd`.




