---
layout: post
title: Koa搭建静态资源服务器
date: 2018-05-07 17:28:15
tags:
 - 同花顺
 - nodejs
toc: true
reproduced: true
---

### 前言

之前使用`egg`写了个简版的软文后台，顺手就是使用了`jq`去写界面，后来随着功能越来越多，突然就觉得以前写的 jq 越来越难维护，频繁需要去操作 dom，修改各种页面的状态值。于是打算使用`vue`重构一版，将其组件化，顺手也就把`egg`换成了，感觉这种简单的后端需求，`koa`确实已经足够了。因为软文后台涉及到对图片的处理，我们希望后端能提供一个地址去浏览这些已经处理的图片，所以就有了搭建一个静态资源服务器的需求。博文中用到的代码并非原创，我只是做了一些优化。

### Koa-static

Koa 中间件-`koa-static`能将项目的某个目录（一般是`static`或者`public`目录）的文件映射到路由上，使得这些文件能通过`url`在浏览器访问到。
`koa-static`并没有列出所有文件的功能，想要实现这一功能，只能自己写中间件处理了

### 中间件

![最后的效果图](https://fs.andylistudio.com/1525692676116.png)

#### static.js

在`utils`目录下新建静态资源处理的 js---`static.js`

```
const path = require('path')
const fs = require('fs')

let mimes = {
  'css': 'text/css',
  'less': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'pdf': 'application/pdf',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  'tiff': 'image/tiff',
  'txt': 'text/plain',
  'wav': 'audio/x-wav',
  'wma': 'audio/x-ms-wma',
  'wmv': 'video/x-ms-wmv',
  'xml': 'text/xml'
}

/**
 * 遍历读取目录内容（子目录，文件名）
 * @param  {string} reqPath 请求资源的绝对路径
 * @return {array} 目录内容列表
 */
function walk (reqPath) {
  let files = fs.readdirSync(reqPath)

  let dirList = []
  let fileList = []
  for (let i = 0, len = files.length; i < len; i++) {
    let item = files[i]
    let itemArr = item.split('.')
    let itemMime = (itemArr.length > 1) ? itemArr[ itemArr.length - 1 ] : 'undefined'

    if (typeof mimes[ itemMime ] === 'undefined') {
      dirList.push(files[i])
    } else {
      fileList.push(files[i])
    }
  }

  let result = dirList.concat(fileList)

  return result
}

/**
 * 封装目录内容
 * @param  {string} url 当前请求的上下文中的url，即ctx.url
 * @param  {string} reqPath 请求静态资源的完整本地路径
 * @return {string} 返回目录内容，封装成HTML
 */
function dir (url, reqPath) {
  // 遍历读取当前目录下的文件、子目录
  let contentList = walk(reqPath)

  let html = `<ul>`
  for (let [ index, item ] of contentList.entries()) {
    html = `${html}<li data-index="${index}"><a href="${url === '/' ? '' : url}/${item}">${item}</a>`
  }
  html = `${html}</ul>`

  return html
}

/**
 * 读取文件方法
 * @param  {string} 文件本地的绝对路径
 * @return {string|binary}
 */
function file (filePath) {
  let content = fs.readFileSync(filePath, 'binary')
  return content
}

/**
 * 获取静态资源内容
 * @param  {object} ctx koa上下文
 * @param  {string} 静态资源目录在本地的绝对路径
 * @return  {string} 请求获取到的本地内容
 */
async function content (ctx, fullStaticPath) {
  // 封装请求资源的完绝对径
  let reqPath = path.join(fullStaticPath, ctx.url)

  // 判断请求路径是否为存在目录或者文件
  let exist = fs.existsSync(reqPath)

  // 返回请求内容， 默认为空
  let content = ''

  if (!exist) {
    // 如果请求路径不存在，返回404
    content = '请求路径不存在！'
  } else {
    // 判断访问地址是文件夹还是文件
    let stat = fs.statSync(reqPath)

    if (stat.isDirectory()) {
      // 如果为目录，则渲读取目录内容
      content = dir(ctx.url, reqPath)
    } else {
      // 如果请求为文件，则读取文件内容
      content = await file(reqPath)
    }
  }

  return content
}

// 解析资源类型
function parseMime (url) {
  let extName = path.extname(url)
  extName = extName ? extName.slice(1) : 'unknown'
  return mimes[ extName ]
}

module.exports = {
  parseMime: parseMime,
  content: content
}
```

> ps: 我把大神的代码合并了下，感觉新建五个 js 还是有点多。另外注意声明中间件的顺序，`api`的声明应当放在`static`中间件的前面，否则`api`声明的路由就都失效了

#### router 中新增路由

```
// 静态资源服务器
router.get('/static', async (ctx) => {
  // 静态资源目录在本地的绝对路径
  let fullStaticPath = path.join(__dirname, '../')

  // 获取静态资源内容，有可能是文件内容，目录，或404
  let _content = await staticUtil.content(ctx, fullStaticPath)

  // 解析请求内容的类型
  let _mime = staticUtil.parseMime(ctx.url)

  // 如果有对应的文件类型，就配置上下文的类型
  if (_mime) {
    ctx.type = _mime
  }

  // 输出静态资源内容
  if (_mime && _mime.indexOf('image/') >= 0) {
    // 如果是图片，则用node原生res，输出二进制数据
    ctx.res.writeHead(200)
    ctx.res.write(_content, 'binary')
    ctx.res.end()
  } else {
    // 其他则输出文本
    ctx.body = _content
  }
})
```

这样当你访问`http://localhost:3000/static`就能列出位于 static 目录下的所有静态文件了

### 结束

只是借鉴然后改了点东西，算是记录下吧...
原文请查看[这里](https://chenshenhai.github.io/koa2-note/note/static/server.html)
