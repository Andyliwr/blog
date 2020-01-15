---
layout: post
title: sublime 疑难杂症全攻略
comments: true
tags:
  - default
photos:
  - 'https://img.vim-cn.com/70/79b85d2f6bb8ad42d90ef9da88b28a38952eca.png'
date: 2019-03-21 09:52:17
updated: 2019-03-21 09:52:17
---

### 前言
每次换系统重装sublime都好麻烦，公司网络访问不了packagecontrol.io，各种扩展包也没法下载，今天就把这些问题怎么解决的都记录下

### 安装sublime
如果遇到[sublime官网](https://www.sublimetext.com/)无法下载的情况，可以使用这个地址链接[百度云盘](https://pan.baidu.com/s/1WgGcUEoOroiKmvpa66qzrA)，提取码: 7ziu

### 安装package control
公司网络访问不了packagecontrol.io，我用迅雷下载了一个，下载地址[百度云盘](https://pan.baidu.com/s/1fq2nY-23ItlxsiPTnRzZdQ)，提取码: tihm

选中`Preferences` -> `Broswer Packages` -> `目录返回上一层` -> `进入Installed Packages`， 将下载的访问放置到该目录下，然后重启sublime就好了

### 安装了package control依旧下载不了包
修改package control的默认下载渠道，`Ctrl + Shift + p` -> `输入Package Control` -> `选中Package Control Setting - User`，将下面的配置写入到设置中:
```
"channels": [
  "https://raw.githubusercontent.com/wilon/sublime/master/download/channel_v3.json"
],
```

### 原来安装的sublime扩展包怎么还原
借助`Sync Setting`包，恢复`sublime`的设置，原理就是将设置同步到`github gist`中，所以需要自己设置一个`gistId`和`github token`

### sublime sftp下载不了？
点击这里[下载](https://file.lantingshucheng.com/loan/v2/SFTP.sublime-package),然后复制到sublime扩展包下面去
