---
layout: post
title: node gpy 报错
date: 2018-04-24 11:25:49
tags:
  - nodejs
---

### 前言

不知道大家在 windows 下有没有遇到这种错误？明明包装得好好的说什么没有设置 python 环境变量，然后我到环境变量设置界面一看，python 变量都设置了呀，在 cmd 中`echo PATH`也能看到设置的 python 的环境变量。
![npm 错误](https://file.lantingshucheng.com/1524540596938.png/800x400)
![系统环境变量](https://file.lantingshucheng.com/1524544026718.png/800x400)

### Node gpy

> `node-gyp` is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. It bundles the gyp project used by the Chromium team and takes away the pain of dealing with the various differences in build platforms. It is the replacement to the node-waf program which is removed for node v0.8. If you have a native addon for node that still has a wscript file, then you should definitely add a binding.gyp file to support the latest versions of node.

`gyp`其实是一个用来生成项目文件的工具，一开始是设计给`chromium`项目使用的，后来大家发现比较好用就用到了其他地方。生成项目文件后就可以调用`GCC`, `vsbuild`, `xcode`等编译平台来编译。至于为什么要有`node-gyp`，是由于`node`程序中需要调用一些其他语言编写的工具甚至是`dll`，需要先编译一下，否则就会有跨平台的问题，例如在`windows`上运行的软件 copy 到 mac 上就不能用了，但是如果源码支持，编译一下，在`mac`上还是可以用的。

### 解决方法

linux 一直都是二进制分发，npm 为了方便干脆就直接源码分发，用户装的时候再现场编译。再看看错误输出，大致意思就是 node-gpy 需要使用到 python 去编译某个东西。但是在路径中又找不到可执行的 python 程序。

### 重新安装 Python

方法一：卸载 python，重新到[官网](https://www.python.org/downloads/windows/)下载一份安装，安装的时候记得勾选“添加 Python 至环境变量”

安装好了之后再试试`npm install`

### Python 版本问题

上面的方法试了之后还是不行的话，可能是 python 的版本引起的，试着换成 python2.7，或者运行下面的命令来安装默认版本：

```cmd
npm install --global --production windows-build-tools
```

记得上述命令需要在 cmd(管理员)的环境中执行。

![cmd](https://file.lantingshucheng.com/1524545060774.png)

### 参考文档

* [Error: Can't find Python executable "python", you can set the PYTHON env variable.解决办法](https://blog.csdn.net/weixin_36222137/article/details/78463543)
* [node-gpy](https://github.com/nodejs/node-gyp)
