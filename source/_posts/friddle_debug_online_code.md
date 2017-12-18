---
title: 如何使用Fiddler调试线上代码
date: 2017-03-30 19:28:35
tags:
 - 同花顺
---

#### 使用场景
#### 1. 调试客户端页面
很多客户端H5页面都需要和客户端交互，有些代码没法完全放在chrome里调试。客户端会自己定义一些特殊的语法，这种语法有时候不符合正常js的语法，在chrome中会直接报诸如函数未定义，语法不符合规范的错误。
#### 2. 调试无法下载到本地或者更改线上代码的页面
比如想学习下别人已经上线的代码，又很难下载到本地运行

#### 使用方法

#### 1、下载Fiddler
[Fiddler4官网下载](http://www.telerik.com/fiddler)，[Fiddler4百度软件下载](http://rj.baidu.com/soft/detail/10963.html?ald)

#### 2、 安装和设置fiddler
傻瓜式安装，直接看设置吧：
选择`Tools`---`Telerik Fiddler Options`---`HTTPS`以及`Telerik Fiddler Options`---`Conections`的设置如下图：

![friddle设置01](http://img.blog.csdn.net/20170330184542720)
![friddle设置02](http://img.blog.csdn.net/20170330190325778)

#### 3、使用`AutoResponder`面板做反向代理替换线上文件

##### 1.  找到需要替换的js文件，这里有个技巧，可以使用最下方的`quick exec`来快速查找到自己想要的文件，比如查找所有的js可以输入`select js`
![抓到的请求](http://img.blog.csdn.net/20170330191318914)

##### 2. 鼠标点击想要替换的js请求拖放到`AutoResponder`面板中，注意面板最上方的`Enable Rules`和`Unmatched requests passthrought`两个选项要勾上
![启动线上文件替换](http://img.blog.csdn.net/20170330192011490)

3.  鼠标选中想要替换的js请求，右击选择`copy---just Url`，将复制到的文件放到浏览器中访问，并复制访问得到的js
4.  右击创建的rule，选择 `Generate File`，然后再次右击选择`Edit file with...`，在编辑器中使用刚才复制的js覆盖全部内容，然后开始你的coding调试吧。选择保存之后，再运行客户端的页面，刚才改动的js就会生效了。

#### 传送门
+ [如何解决Fiddler不能抓取浏览器的包的问题](http://blog.csdn.net/sufubo/article/details/49331705)
+ [如何使用Fiddler模拟客户端http响应](http://www.cnblogs.com/tangdongchu/p/4178552.html)
+ [Fiddler官方使用文档](http://docs.telerik.com/fiddler/knowledgebase/headers)，英文的，虐哭概不负责
+ [Fiddler手机抓包教程](http://jingyan.baidu.com/article/d8072ac4605905ec95cefda0.html)

