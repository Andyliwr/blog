---
title: 键盘回车事件导致页面刷新的问题
date: 2017-05-23 10:24:29
tags:
 - 同花顺
---

我最近在做一个 Ajax 查询的功能，代码如下：

```html
<form name="keywordForm" method="post" action=""> 
  <p id="profile_nav"> 
    <label for="profile"> 关键字搜索： </label> 
    <input style="width:80; height:20" type="text" name="keyword" onkeypress="searchKeywordKeyboard(event)" /> 
    <input type="button" value="搜索" onClick="searchKeyword()"> 
  </p>
</form>
```

在文本框中输入关键字按回车，页面自动刷新了，结果肯定是没有实现无刷新搜索了。想了想，可能是按回车后默认提交了表单，于是将form去掉，果然不刷了。但是还是会有很多地方需要用到form。

一个表单下，如果只有一个文本框时，按下回车将会触发表单的提交事件。

既然是只有一个文本框才会出问题，那么可以加一个隐藏的文本框，如下：

```html
<input id="hiddenText" type="text" style="display:none" />
```

现在代码成了这样：
 

```html
<form name="keywordForm" method="post" action=""> 
    <p id="profile_nav"> 
    <label for="profile"> 关键字搜索： </label> 
    <input style="width:80; height:20" type="text" name="keyword" onkeypress="searchKeywordKeyboard(event)" /> 
    <input id="hiddenText" type="text" style="display:none" onkeypress="searchKeywordKeyboard(event)" />
    <input type="button" value="搜索" onClick="searchKeyword()"> 
  </p>
</form>
```

结论是，可以采取两种方法解决这种问题：**1.去掉表单；2.如果非得用表单**，只要不让表单里有且只有一个文本框就OK了。
如果以上的方法还不足以让你去解决问题，那么你可以用以下方法来阻止因为回车而引起的表单自动提交：

```html
<form name="keywordForm" method="post" action="" onsubmit="return false;"> 
  <p id="profile_nav"> 
    <label for="profile"> 关键字搜索： </label> 
    <input style="width:80; height:20" type="text" name="keyword" onkeypress="searchKeywordKeyboard(event)" /> 
    <input id="hiddenText" type="text" style="display:none" onkeypress="searchKeywordKeyboard(event)" />
    <input type="button" value="搜索" onClick="searchKeyword()"> 
  </p>
</form>
```

就是在表单 form 后面加上一个 onsubmit 事件，返回 false，来阻止 form 提交。