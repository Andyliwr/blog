---
layout: post
title: koa上传文件
date: 2018-08-03 17:28:15
tags:
 - 同花顺
 - nodejs
 - koa
toc: true
---

### 前言

产品提了个需求希望能有个页面能将 word 文档一次性转换成可访问的线上地址，瞬间感觉压力山大，那就先从上传文件开始吧~
其实靠上传我都实现过好多次了，但是过了不久又会忘记，然后又得各种百度去找答案，这里强制自己记录下。

### 新建 koa2 项目

使用`koa-generator`可以通过命令行的方式初始化一个`koa2`项目

```
npm install -g koa-generator
koa2 xxx
cd xxx && npm install
```

### 写上传文件的前端页面

`koa2` 默认的模板引擎是`pug`，点击这里查看[pug 的基本用法](https://pugjs.org/zh-cn/api/getting-started.html)。
为了避免上传的时候自动刷新页面，提交表单就直接不适用 `form` 元素了，直接使用`div`，然后监听提交按钮的点击事件。
选择 `word` 文档可以通过 `input` 的 `accept` 属性来做限制，将其设置为`application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`。

详细代码如下：

```pug
div(class='form')
  div(class='form-group')
    input(type='file', id='file', name='file', accept='application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    button(id='submit') 开始转换
script(type='text/javascript', src='//cdn.bootcss.com/jquery/3.3.1/jquery.min.js')
script(type='text/javascript', src='/javascripts/index.js')
```

![上传页面](https://file.lantingshucheng.com/1533290091381.png)

### 监听上传按钮点击事件

为了方便操作 dom，我直接使用 jquery 了。
提交文件的时候使用 `FormData` ，点击这里查看[`FormData`的详细用法](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)。其实主要是新建一个 `FormData` 对象，使用 `append` 方法将 `input` 选择的文件装载进去，然后将其作为 `body` 内容发送到后端

详细代码如下：

```js
$(document).ready(function() {
  var uploading = false;
  $('#submit').on('click', function() {
    if (uploading) {
      alert('文件正在上传中，请稍候');
      return false;
    }
    var file = new FormData();
    file.append('file', $('#file').prop('files')[0]);
    $.ajax({
      url: '/word-to-html',
      type: 'POST',
      cache: false,
      data: file,
      processData: false,
      contentType: false,
      beforeSend: function() {
        uploading = true;
      },
      success: function(data) {
        // 处理请求返回
        uploading = false;
      }
    });
  });
});
```

![console](https://file.lantingshucheng.com/1533290269096.png)

### 后端代码

`koa` 需要借助中间件去处理传过来的 `body`，其实试过好多`koa-convert`、`koa-bodyparse`、`koa-better-body`，都遇到坑了。所以以后直接使用`koa-body`吧，简单关键有效。

** app.js **

```js
const body = require('koa-body');
// middlewares
app.use(
  body({
    multipart: true,
    urlencoded: true
  })
);
```

**routes/index.js**

```js
router.post('/word-to-html', async (ctx, next) => {
  console.log(ctx.request.files);
  ctx.body = 'hello word';
});
```

![后端接受参数](https://file.lantingshucheng.com/1533292320020.png)
