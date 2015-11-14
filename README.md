# Rapid-Dev-Activity-Page
使用Gulp, fmpp快速开发构建活动页

## 写在前面

活动页大概有这么几个特点:
- 大块切图, 一堆的图片, 需要压缩工作
- 基本就一个js一个css, 顶多引入个reset, zepto. 可以直接内联到模板.
- 大多都是服务端直接吐数据
- 前端写的很快, 但后端模板写好了, 如果后端没弄好环境就要干等着, 就算后端搞好了环境, 数据还没准备好依然没什么卵用.
- 快速开发

如果前端这里可以自己整个环境解析后端模板, 测试数据, 接着把图片压缩下, 把资源内联到模板, 实现一个轻量级的前后端分离, 接下来就是喝喝茶逗逗妹子等着和后端联调了.

本文就是为了让你悠然的喝茶品咖啡逗妹子而生的!

## 项目目录

对于一个Java Web项目, 一般前端工程师需要关注的就是webapp目录, 目录结构大概如下:

```
webapp
  css
  js
  img
  template
  ...
```

后端一般会将这个目录指向网站根路径, 比如要访问: /webapp/js/index.js, 就是访问这个地址: http://yourpath/js/index.js. 我们一般写link或者script标签的时候, 也会直接写绝对路径, 比如: `<link rel="stylesheet" type="text/css" href="/css/index.css">`
下文所提到的项目根目录都是指webapp.

## Freemarker模板解析

这应该是最头疼问题了, 一般我们只能依赖后端的环境和数据进行调试, 还好总会有些工具帮我们解决这些问题.

Freemarker模板的解析使用了[fmpp, 全称: freemarker preprocessor](http://fmpp.sourceforge.net/), 一个Freemarker的预处理器. 我们安装了fmpp之后, 就可以自己mock数据然后将ftl文件渲染为html文件. 

fmpp的使用也很简单:

#### 首先安装fmpp.
[下载](http://fmpp.sourceforge.net/#sect4)到任意目录, 将bin目录添加到环境变量即可, 就可以使用fmpp命令了, 前提你要安装JDK. 然后windows下可能需要以管理员的身份运行CMD.

#### 准备配置文件, `config.fmpp`, 根目录下即可.
```
sourceRoot: src   // ftl目录
outputRoot: dist  // html输出目录
logFile: log.fmpp // 日志文件
modes: [execute(*.ftl)] // 对ftl后缀的文件操作
replaceExtensions:[ftl,html] // 将后缀替换为html
data:tdd(../mock/index.tdd) // 数据文件
```

#### 准备mock数据
上文的配置文件中data一项就是你准备的数据的文件, 以tdd后缀. 文件路径相对于outputRoot. 这里的数据就和你与后端约定的接口一致.
```js
{
    "id": 1
    "user": {
        "name": "zjzhome",
        "gender": "male",
        "age": 24,
        "address": "Hangzhou",
        "type": 1
    }
}
```

#### 运行fmpp命令即可. 
还有一大堆的配置项, 具体可看[官网文档](http://fmpp.sourceforge.net/manual.html)

## Gulp登场

接下来的工作, 包括图片压缩, 内联压缩JS和CSS, 开启服务器, 自动刷新, 自动监听文件变化执行fmpp, 这些工作统统交给Gulp.

### 图片压缩: gulp-imagemin和imagemin-pngquant.

```js
gulp.task('image', function() {
  gulp.src(PathConfig.imageSrc + '*')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(PathConfig.imageSrc))
})
```

推荐一个在线压缩的网站[http://www.atool.org/pngcompression.php](http://www.atool.org/pngcompression.php).

### 开启服务器: gulp-connect

```js
gulp.task('server', function() {
  connect.server({
    livereload: true
  })
})
```

并且开启livereload. 接下来我们要告诉connect什么时候reload. 访问localhost:8080即可.

### 自动刷新: gulp-watch

当PathConfig.livereloadSrc里的文件变化时, 就自动刷新. 一般情况是你的html, js或者css改变了.

```js
gulp.task('livereload', function() {
  gulp.src(PathConfig.livereloadSrc)
    .pipe(watch(PathConfig.livereloadSrc))
    .pipe(connect.reload())
})
```

### 内联JS和CSS: gulp-replace

找了一堆插件, 貌似都不识别ftl文件, 有个gulp-inline不错, 内联资源后还自带压缩神马的, 但是会改变ftl的结构.. 索性自己写了.

```js
gulp.task('inline', function() {
  gulp.src(PathConfig.ftlSrc)
    .pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
      var style = fs.readFileSync(__dirname + filename, 'utf-8');
      return '<style>\n' + new CleanCSS().minify(style).styles + '\n</style>';
    }))
    .pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
      return '<script>\n' + UglifyJS.minify(__dirname + filename).code + '\n</script>';
    }))
    .pipe(gulp.dest(PathConfig.inlineDist));
})
```

使用gulp-replace先将link和script标签里的资源链接提取出来, 然后用文件内容替换掉, 为了同时压缩文件, 使用clean-css和uglify2.

然后我们同样需要文件改变时, 自动完成内联工作.

```js
gulp.task('watchInline', function() {
  gulp.watch(PathConfig.liveInlineSrc, ['inline']);
})
```

### 自动编译ftl至html

当ftl或者数据文件改变时, 依然需要自动完成编译.

```js
gulp.task('watchFmpp', function() {
  gulp.watch(PathConfig.fmppSrc, function() {
    exec('fmpp', function(err) {
      if(err) throw err;
      else console.log('ftl to html successfully!')
    })
  })
})
```

这里使用Node的child_process模块, 可以直接执行命令.

### 最后直接运行gulp, 愉快的开发吧.

### 我该如何使用呢

参照activity目录下, 可以直接拷贝本项目的`config.fmpp`, `gulpfile.js`, `package.json`, `.gitignore`到你的项目目录下, 运行`npm install`下载依赖模块, 然后修改gulpfile的路径配置:

```js
var PathConfig = {
  ftlSrc: './src/index.ftl', // 模板文件
  inlineDist: './template/', // 内联js, css后输出的目录
  imageSrc: './img/',        // 图片目录
  livereloadSrc: ['./js/*.js', './css/*.css', './dist/index.html'], // 需要监听改变的文件, 以便自动刷新
  liveInlineSrc: ['./src/index.ftl', './js/*.js', './css/*css'], // 需要监听的文件, 以便自动进行内联资源操作
  fmppSrc: ['./src/index.ftl', './mock/index.tdd'] // 需要监听的模板和mock数据文件, 以便自动进行fmpp.
}
```

最后准备好一份mock数据, 命令行下输入gulp即可.

## 继续...

本来只是为活动页这类小页面定制的工作流, 后来发现有些页面比活动页大一些:)如果使用公司的那些大而全的工具又不值, 所以我就又写了一个针对比活动页大点的页面的工作流.(原谅我这拙劣的描述...)

其实, 大部分像图片压缩, 服务器, 自动刷新都是类似的, 不过呢, 这时, js或者css文件可能多了一些, 就不再是直接内联到模板, 而是合并压缩并打上版本号然后替换模板中的引用. 这部分参照normal目录.

### 提取css和js引用

根据模板, 通过正则提取出引用的js和css, 为下一步合并压缩做准备.

```js
gulp.task('extract', function() {
  return gulp.src(PathConfig.ftlSrc)
    .pipe(replace(/<link.+href="(.+\.css)".*>/g, function(s, filename) {
      PathConfig.cssSrc.push(__dirname + filename);
      return s;
    }))
    .pipe(replace(/<script.+src="(.+\.js)".*><\/script>/g, function(s, filename) {
      PathConfig.jsSrc.push(__dirname + filename);
      return s;
    }))
    .pipe(gulp.dest(PathConfig.inlineDist));
});
```

### 在合并压缩之前进行文件的清空工作.

```js
gulp.task('cleanCSS', function() {
  var p = PathConfig.compressDist
  return gulp.src([p + '*.css', p + 'maps/*.min.css.map', p + '*.css.json'], { read: false })
      .pipe(clean());
});
gulp.task('cleanJS', function() {
  var p = PathConfig.compressDist
  return gulp.src([p + '*.js', p + 'maps/*.min.js.map', p + '*.js.json'], { read: false })
      .pipe(clean());
});
```

### 合并压缩打上版本号, 生成sourcemap和manifest文件.

```js
gulp.task('compressCSS', ['extract', 'cleanCSS'], function() {
  return gulp.src(PathConfig.cssSrc)
    .pipe(sourcemaps.init())
    .pipe(concat(PathConfig.minCSS))
    .pipe(minifyCSS())
    .pipe(rev())
    .pipe(sourcemaps.write(PathConfig.mapDist))
    .pipe(gulp.dest(PathConfig.compressDist))
    .pipe(rev.manifest('manifest.css.json'))
    .pipe(gulp.dest(PathConfig.compressDist));
});
gulp.task('compressJS', ['extract', 'cleanJS'], function() {
  return gulp.src(PathConfig.jsSrc)
    .pipe(sourcemaps.init())
    .pipe(concat(PathConfig.minJS))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write(PathConfig.mapDist))
    .pipe(gulp.dest(PathConfig.compressDist))
    .pipe(rev.manifest('manifest.js.json'))
    .pipe(gulp.dest(PathConfig.compressDist));
});
```

### 更改模板的资源引用

```js
gulp.task('inline', ['compressJS', 'compressCSS'], function() {
  var p = PathConfig.compressDist.replace('.', '');
  return gulp.src(PathConfig.ftlSrc)
    .pipe(replace(/(\s*<link.+href=".+\.css".*>\s*)+/g, function(s, filename) {
      return '\n<link rel="stylesheet" type="text/css" href="' + p + PathConfig.minCSS + '">\n';
    }))
    .pipe(replace(/(\s*<script.+src="(.+\.js)".*><\/script>\s*)+/g, function(s, filename) {
      return '\n<script src="' + p + PathConfig.minJS + '"></script>\n';
    }))
    .pipe(gulp.dest(PathConfig.inlineDist));
});
```

### 将引用改为带版本号的引用

```js
gulp.task('rev', ['inline'], function() {
  gulp.src(['./pub/*.json', PathConfig.inlineDist + '*.ftl'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest(PathConfig.inlineDist));
});
```

使用的时候, 依然和acticity一样, 配置变量, gulp即可. 

## 写在后面

本项目主要对像活动页这类比较简单的页面进行了轻量级的前后分离和构建, 由于gulp的方便性, 你也可以扩展自己需要的功能, 比如执行JSHint进行代码检查,总之任意配置达到自己的要求, 从繁杂的业务中抽离出来.
