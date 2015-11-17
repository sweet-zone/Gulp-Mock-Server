<#macro tpl type>
    <div class="tip">
        这是一段测试模板, <#if type==1>type为1</#if><#if type==2>type为2</#if><#if type==3>type为3</#if>
    </div>
</#macro>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="address=no">
    <title>Rapid-Dev-Activity-Page</title>
<link rel="stylesheet" type="text/css" href="/pub/index-3828ffbb58.min.css">
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

        <@tpl type=user.type />

        <div>
            <button type="button" class="btn">点我点我点我</button>
        </div>
    </div>
<script src="/pub/index-14338ed084.min.js"></script>
</body> 
</#escape>
</html>
