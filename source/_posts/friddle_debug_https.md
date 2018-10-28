---
title: 如何使用Fiddler调试https
date: 2018-08-27 19:28:35
tags:
  - 同花顺
---

### Https 设置

Fiddler 默认只能抓取 HTTP 协议的网页，不能抓取 HTTPS 协议的网页，而我们很多时候，都需要抓 HTTPS 协议的网页，比如抓淘宝数据等。今天就讲解如何使用 Fiddler 抓取 HTTPS 协议的网页。

打开 Fiddler，点击“Tools--Fiddler Options--HTTPS”，把下方的全勾上，如下图所示：

![Https设置](https://fs.andylistudio.com/1535367948550.png)

### 电脑端证书操作

然后，点击 Action，选择将 CA 证书导入到桌面，即第二项，导出后，点击上图的 ok 保存配置。
![导出证书](https://fs.andylistudio.com/1535368070124.png)
然后在桌面上就有了导出的证书，双击名为`FiddlerRoot`的证书文件即可安装证书。

### 手机端证书操作

打开手机浏览器，访问地址[打开fiddle的电脑ip]:8888，就能看到证书安装的页面，点击下载证书然后安装就好，这样fiddle就能抓取手机的https请求了
![手机端证书操作](https://fs.andylistudio.com/1535369724747.png)

