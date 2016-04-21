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
    <link rel="stylesheet" type="text/css" href="/css/reset.css">
    <link rel="stylesheet" type="text/css" href="/css/index.css">
</head>
<#escape x as x?html>
<body>
    <div class="app" id="app">
    ${id}
    </div>

    <script src="/js/zepto.js"></script>
    <script src="/js/index.js"></script>
</body> 
</#escape>
</html>
