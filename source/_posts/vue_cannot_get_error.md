---
title: vue项目启动之后出现cannot GET /错误
date: 2017-06-22 09:49:00
tags:
  - vue
  - 同花顺
---

今天出一个新需求，拿到别人的代码启动`vue`之后总是报`cannot GET /`的错误。下面是我解决的方法：

#### 现象

1.  浏览器中无法呈现已有页面,并且在浏览器控制台中报 404 错误

![chrom报错](https://fs.andylistudio.com/blog/post03/error.png/default)

2.  `npm run dev`命令行窗口没有报错

![控制台输出](https://fs.andylistudio.com/blog/post03/console.png/default)

#### 原因

网上查了下，有人说是路由配置问题（开启了`history`模式，而`history`模式需要服务端支持），然后我的代码没有开启`history`模式。于是找同事要了份代码全文对比，发现是配置信息导致:

![webpack配置](https://fs.andylistudio.com/blog/post03/code.png/default)

注释部分是打包时需要修改的地方(根据打包时网站根目录,这个没处理好可能会出现图片路径加载失败问题),而上面才是在开发环境下需要的配置信息(怪自己没留意,坑了自己),之后就可以正常跑了...

由于有多个网友反映并没有修改上面的`publicPath`,但是执行 run 命令之后还会出现上述情况,追其原因是除此之外还修改了 config 目录下的`assetsPublicPath`路径,将其还原为你自己打包前的路径即可.
