
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="address=no">
    <title>Rapid-Dev-Activity-Page</title>
    <style>
body,html{min-height:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{line-height:1.5;word-wrap:break-word;font-family:"Helvetica Neue",Helvetica,STHeiTi,Arial,sans-serif;overflow:auto;background-color:#fff;-webkit-overflow-scrolling:touch}*{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-weight:400}a{text-decoration:none}img{border:0;max-width:100%;vertical-align:middle;-webkit-touch-callout:none}
</style>
    <style>
.app,.app .btn{text-align:center}.app{min-height:100%;position:relative;color:#666}.app .tip{margin:20px;border:1px solid #ebebeb}.app .btn{display:inline-block;margin-top:20px;margin-bottom:20px;width:150px;height:40px;border:none;border-radius:6px;background:#f6870c;color:#fff;line-height:24px;font-size:16px;-webkit-appearance:none;outline:0}
</style>
</head>
<#escape x as x?html>
<body>
    <div class="app" id="app">
        <ul class="list">
            <li>姓名: ${user.name}</li>
            <li>性别: ${user.gender}</li>
            <li>年龄: ${user.age}</li>
            <li>地址: ${user.address}</li>
        </ul>

        <div>
            <button type="button" class="btn">点我点我点我</button>
        </div>
    </div>
<script src="/pub_normal/other.min.js"></script>
</body> 
</#escape>
</html>
