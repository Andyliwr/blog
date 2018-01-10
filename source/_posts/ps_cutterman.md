---
layout: post
title: 关于切图，你知道这些吗？
date: 2018-01-10 14:45:23
tags:
 - tools
---

#### 前言
对UI稿切图可谓前端工程师的基本功了，今天来讲讲如何快速并且高效的切图。

#### Cutterman插件
`Cutterman`是一款运行在`photoshop`中的插件，能够自动将你需要的图层进行输出， 以替代传统的手工 "导出web所用格式" 以及使用切片工具进行挨个切图的繁琐流程。 它支持各种各样的图片尺寸、格式、形态输出，方便你在`pc`、`ios`、`Android`等端上使用。 它不需要你记住一堆的语法、规则，纯点击操作，方便、快捷，易于上手。

Cutterman能够让你只需要点击一个按钮，就自动输出你需要的各种各样的图片。
![基本使用](https://fs.andylistudio.com/blog/2018_01_10/sample1.gif)

输出支持IOS平台的单倍图、双倍图，支持IPHONE6/6P尺寸比例。还支持Android平台的各种分辨率大小图片，什么XXHPDI，XHDPI，HDPI啊之类的，通通自动化输出。
![IOS切图](https://fs.andylistudio.com/blog/2018_01_10/sample2.png)
![Android切图](https://fs.andylistudio.com/blog/2018_01_10/sample3.png)

支持各种图片格式输出，什么`png`、`jpg`、`gif`通通不在话下，还可以自己缩放、压缩大小。
![输出格式](https://fs.andylistudio.com/blog/2018_01_10/sample4.png)

导出的时候可以多选图层，支持选中多个图层合并输出，也可以逐一输出。
![多图层输出](https://fs.andylistudio.com/blog/2018_01_10/sample5.png)

安装方法：[下载地址](http://static.cutterman.cn/products/win/Cutterman_panel_3.5.0_201711141423.zip)，双击exe运行就好了，然后重启ps，在“窗口”-->“扩展功能”-->“cutterman”就能看得到，勾选下就能在右边看到`cutterman`的界面。

#### iconfont导入svg
iconfont可以支持自己导入svg，这样你就能将UI给的PNG切图做成酷炫的iconfont字体图标，随心所欲的改变字体图标颜色和大小了。

使用方法如下：
1、对于一张PNG切图，选择“文件”--“导出”--“导出为”，然后格式选择svg，将PNG转成svg
![](https://fs.andylistudio.com/blog/2018_01_10/sample6.png)
2、打开iconfont官网，从右边数三个图标点击上传，将导出的`svg`图片拖放到页面中
![](https://fs.andylistudio.com/blog/2018_01_10/sample7.png)
3、上传完成之后，在我上传的页面点击刚才上传的图标，将其加入到购物车
![](https://fs.andylistudio.com/blog/2018_01_10/sample9.png)
4、选择好需要转化成字体的图标之后，点击购物车，最下方有个“下载代码”，点击下载就能拿到字体图标的文件了。
