
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="address=no">
    <title>Rapid-Dev-Activity-Page</title>
    <link rel="stylesheet" type="text/css" href="/css/reset.css">
    <link rel="stylesheet" type="text/css" href="/css/index.css">
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

    <script src="/js/zepto.js"></script>
    <script src="/js/index.js"></script>
</body> 
</#escape>
</html>
