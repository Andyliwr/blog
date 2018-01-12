---
layout: post
title: ssh连接如何使用代理
date: 2018-01-12 15:56:28
tags:
 - linux
---

#### 前言
我最近将公司电脑系统换成`deepin`了，感觉体验不错。

没了`windows`之后如何登录腾讯云呢？以前还有个`xshell`或者`mobaXterm`可以设置代理，现在要通过命令行登录了。

网上用ssh隧道来翻墙的教程比较多，通过代理连接`ssh`的文章相对较少，这种方法适用于网络中防火墙屏蔽了`ssh`协议，或者其它原因无法通过`ssh`直连服务器的情况。配置好后ssh流量会通过指定的代理中转，从而突破防火墙的限制，主要用到了`ssh client`的`ProxyCommand`选项，需要配合第三方代理软件。

#### Corkscrew
`Corkscrew`是专门为ssh提供`http`代理的软件，要使用`corkscrew`需要`http`代理支持`HTTP CONNECT`方法，建议使用`squid`或者`ATS`这类专业的代理软件，代理不建议设置认证
1. **安装Corkscrew**
  访问Corkscrew的[github地址](https://github.com/elia/corkscrew)，在release中下载最新的发布包
  下载完成之后，在终端中执行如下命令:
  ```
  tar -zxvf corkscrew-2.0.tar.gz
  cd corkscrew
  sudo ./configure
  sudo make && sudo make install
  ```
  安装完成，在终端中就能看到`corkscrew`这样一个命令了。
2. **设置ssh**
  在`~/.ssh/`下新建一个config文件，然后输入一下内容，具体配置请根据自己的实际情况填写
  ```
  Host txy # 别名，设置为*表示所有ssh连接均使用此代理
  Hostname 111.230.235.234
  User ubuntu
  Port 22
  # IdentifyFile 证书地址，这里不设置
  ProxyCommand /usr/local/bin/corkscrew 192.168.0.1 88 %h %p
  ```
  因为我这里使用的同花顺代理需要认证，所以还得新建一个文件来存放认证的信息。
  ```
  vi ～/.ssh/myauth
  ## 输入如下内容，格式为[代理用户名]:[代理密码]
  hexin:hx300033
  ```
  最后修改`~/.ssh/config`的`ProxyCommand`命令，在最后面加上认证文件的地址：
  ```
  ProxyCommand /usr/local/bin/corkscrew 192.168.0.1 88 %h %p ~/.ssh/myauth
  ```
3. **启动ssh连接**
  因为已经设置别名，所以我们可以直接通过`ssh txy`的方式启动ssh连接
  ![ssh](https://fs.andylistudio.com/blog/2018_01_12ssh.png)
