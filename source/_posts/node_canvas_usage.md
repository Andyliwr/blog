---
title: nodejs绘制生成图像
date: 2018-04-23 15:26:51
tags:
  - nodejs
  - 毕设
toc: true
---

### 前言

毕设的小程序要实现分享功能，我将分享功能按照不同的页面分成了三块。分享的内容都是动态定义的，而且因为微信只支持图片分享的模式，所以这里只能使用后端将分享的内容动态写进图片里，最后上传到七牛云，返回一个图片地址

#### 阅读器页面分享

就是在阅读章节的时候选择分享，分享出去的图片应当展示的信息包括：书籍封面、书籍名称、章节名称、以及部分章节内容
![章节分享](https://file.lantingshucheng.com/1524545631717.png/800x400)

#### 书籍详情页分享

分享出去的图片应当展示的信息包括：书籍封面、书籍名称、作者、书籍类型、以及书籍简介，这块还在开发中，到时候再补进来

#### 小程序首页分享

这个功能，我想加入到后台管理系统中，让管理员能自定义分享的图片，思路什么的还在考虑中。

### 具体实现

说了那么多，直接来看怎么撸代码吧关于 node 自定义生成图片，有一个很好的 npm 包，叫做 node-canvas，它可以让你在 node 中像在浏览器中一样绘制图像，诸如常见的 drawImage、fillText、fillRect 这些方法都支持。所以使用 node 绘制图像就不成大问题了，但关键是怎么绘制。

#### 安装 node-canvas

```
# 安装基础依赖
# ubuntu
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
# mac OS
brew install pkg-config cairo libpng jpeg giflib

# 安装canvas
npm install canvas
```

安装出现了问题或者想要知道更多关于 node-canvas 的信息，可以看看它的[github 首页](https://github.com/Automattic/node-canvas)

#### 基础应用

比如用 node-canvas 绘制一段文字

```
import Canvas  from 'canvas'

const canvas = new Canvas(300, 120) // 按照微信官方要求，长宽比5:4
const context = canvas.getContext('2d')
ctx.font = '14px "Microsoft YaHei"' // 统一使用微软雅黑字体
context.fillText('Hellow', 84, 24, 204)
```

fillText 接受四个参数，第一个是需要绘制的文本，第二个和第三个参数是定义绘制的起始位置的 x 和 y 坐标，第四个参数用来控制绘制文本的最大宽度 maxWidth。想要绘制好一张图片，这些位置信息都是要自己计算的哦！

#### drawImage 的说明

在绘制书籍封面图片的时候就会使用到 drawImage 方法，但是 node-canvas 的 drawImage 方法在传递图片参数的时候只接收 Buffer 类型，所以这里就涉及到如何将网络图片(从数据库中取出的封面图片地址，例如：)转换成 Buffer 类型。我们使用 https 的内置包(如果你请求的图片地址是 http 的请使用 http 的内置包)请求封面图片地址，在拼装请求数据之后使用 Buffer.concat 方法将其装换成 Buffer 类型。另外应为是在 koa 的 router 中写的代码，所以面对这种异步回调类型的操作，需要使用 Promise。

```js
return new Promise((resolve, reject) => {
  // 将封面图片转成buffer格式，用于canvas绘制图片
  https.get(thisBook.img_url, imgRes => {
    let chunks = []; // 用于保存网络请求不断加载传输的缓冲数据
    let size = 0; // 保存缓冲数据的总长度
    imgRes.on('data', chunk => {
      /**
       * 在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)
       * node会把接收到的数据片段逐段的保存在缓冲区（Buffer）
       * 这些数据片段会形成一个个缓冲对象（即Buffer对象）
       * 而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），
       * 如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，
       * 直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，
       * 利用下面的node.js内置的Buffer.concat()方法进行拼接
       */
      chunks.push(chunk);
      size += chunk.length;
    });
    imgRes.on('end', err => {
      if (err) {
        ctx.body = { ok: false, msg: '下载书籍封面图片失败' };
        reject('下载书籍封面图片失败');
        return;
      }
      const buffer = Buffer.concat(chunks, size);
      // 判断是否是一个buffer对象
      if (Buffer.isBuffer(buffer)) {
        // 继续你的canvas绘画....
      } else {
        ctx.body = { ok: false, msg: '下载书籍封面图片失败' };
        reject('下载书籍封面图片失败');
        return;
      }
    });
  });
});
```

#### fillText 的说明

之前提到过 fillText 方法可以接受一个名为 maxWidth 的参数，一旦绘制的文本超过这个宽度就会自动换行。本来这个设计是很好的，但是实际使用过程中就会发现，自动换行的行高很大(大到影响美观)。而且通过 context.font 也没办做到控制行高，因为 line-height 和 font-size 在 context.font 中是同一个参数。既然这样，又只能自己想办法了。行高没法控制，就只能每次绘制一行文本，然后使用绘制的时候传入的起始位置的 y 坐标来控制两行之间的间距。

```js
// 首先对从数据库中读取到的文本去掉换行符和制表符这些
const noSpaceContent = thisBook.chapters[0].content.replace(/(\n|\t|\r)/g, '');
// 使用canvas的measureText方法得到一个中文的宽度，然后用最大宽度除以它得到一行最多可容纳的字符数
const oneTextWidth = context.measureText('测').width;
const oneLineMaxTextNumber = Math.ceil(204 / oneTextWidth);
// 小说描述最大行数
let maxLineNumber = 4;
// 当前行数
let current = 4;
while (current > 0) {
  let tmpText = noSpaceContent.substring(oneLineMaxTextNumber * (maxLineNumber - current), oneLineMaxTextNumber * (maxLineNumber + 1 - current));
  // 最后一行文字显示省略号
  if (current === 1) {
    tmpText = tmpText.substring(0, tmpText.length - 2) + '...';
  }
  context.fillText(tmpText, 84, 62 + (maxLineNumber - current) * 15, 204);
  current--;
}
```

### 图片上传七牛云

我这里使用的[qn](https://www.npmjs.com/package/qn)的包，大家去官网看看应该就知道怎么用。为了防止自己忘记，这里贴下代码。首先将配置写到 config.js 里

```
const config = {
	accessKey: 'xxx', //七牛账号的key值，https://portal.qiniu.com/user/key
	secretKey: 'xxx',
	bucket: 'upload', //空间名称
	isUseHttps: true, //配置使用https，并且对应到正确的区域，详情请查考https://github.com/gpake/qiniu-wxapp-sdk/blob/master/README.md
}

module.exports = config;
```

然后初始化七牛配置

```
import config from '../config'
import qn from 'qn'

// qiniu上传设置
const client = qn.create({
  accessKey: config.accessKey,
  secretKey: config.secretKey,
  bucket: 'upload',
  origin: 'https://file.lantingshucheng.com',
});
```

七牛云允许直接上传本地图片，也可以直接是图片的 buffer 对象，我们使用 node-canvas 提供的 toBuffer 方法直接将我们绘制的 canvas 转成 buffer 对象然后上传

```
// 上传图片到七牛云
client.upload(canvas.toBuffer(), {key: 'mbook/share/' + uuid.v1() + '.png' }, function (err, result) {
  if (err) {
    ctx.body = { ok: false, msg: '分享图片导出失败' }
    reject('分享图片导出失败')
    return
  }
  ctx.body = { ok: true, msg: '分享图片导出成功', url: result.url }
  resolve(next())
})
```

### 效果图

是不是感觉还可以，哈哈~，完整代码请参考[这里](https://github.com/AndyliStudio/mbook-koa/blob/master/api/other.js)
![效果图](https://file.lantingshucheng.com/mbook/share/fa4d3d10-463f-11e8-8a01-25d148dab515.png)
