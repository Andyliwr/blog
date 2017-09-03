---
title: git bash下出现错误Cannot find module
date: 2017-04-26 13:53:45
tags:
 - 同花顺
 - windows
---

经常用git的可能都会觉得`git bash`比`cmd`好用一些，不仅在样式上，`git bash`还支持`ssh`、`ls`、`cp`、`mv`、`vi`这些`linux`常见命令。当然有一款软件专注美化`cmd`，叫做[`cmder`](http://cmder.net/)，但是`cmder`在`windows`上光标有时候错乱，很烦人，而且源码在`github`上下载下来也很难。`git bash`是一个很好的替代品，最近发现全局安装好的node包，在cmd下可以运行，但是在`git bash`下总是运行不了。

![git bash报错](https://olpkwt43d.qnssl.com/blog/post05/error.png)

好好看了下错误提示，原来git bash在调用node包的时候是在git安装目录下调用的，而npm安装的包默认目录在`C:/Users/用户名/AppData/Roaming/npm/node_modules/`下，git bash找不到node包所以会出错，那么怎么解决呢？打开你的git bash，没有什么是一段代码解决不了的。

```bash
cd [你的git安装根目录]
mkdir node_modules && cd node_modules
npm link [你想要在git bash下使用的node包的名字]
```
这里给出下npm link的介绍，以及基本语法：
```bash
$ npm link --help
npm link (in package dir)
npm link [<@scope>/]<pkg>[@<version>]
alias: ln
```
最后看一个截图：

![链接成功之后的结果](https://olpkwt43d.qnssl.com/blog/post05/success.png)