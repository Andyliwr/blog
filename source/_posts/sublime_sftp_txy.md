---
title: 如何使用sublime的sftp插件链接腾讯云服务器
date: 2017-10-17 21:39:00
tags:
	- linux
---

### 前言

在写`wecomment`评论插件的时候，`koa`程序一直连接不上本地的`mongo`，总是报权限认证的错误。所以只能想办法放到服务器上开发了。但是如何将本地的改动同步到服务器上却得想个简单实用的方法。大家应该都很熟悉`sublime`的`sftp`插件。这篇博客正是介绍如何使用`sublime`的`sftp`插件同步代码到腾讯云服务器。

### 开始

腾讯云服务器不是使用密码直接登陆`ssh`的，而是使用密钥。因此我们先在本地生成一个密钥，在`git bash`中输入以下命令（请将邮箱改成自己的邮箱）：
```bat
ssh-keygen -t rsa -C "andyliwr@outlook.com"
```
在要求输入密码的时候直接按enter就好了，免得每次登陆都需要输入额外的密钥密码。新生成的密码的地址在`console`了可以看到。
![生成密钥](https://olpkwt43d.qnssl.com/blog/post20171017_01.png)
查看公钥内容，并复制。
```
cat /c/Users/andyliwr/.ssh/id_rsa.pub
```
![查看密钥](https://olpkwt43d.qnssl.com/blog/post20171017_02.png)

接下来就是把密钥绑定到腾讯云服务器了。首先登陆腾讯云的控制台。因为在绑定密钥的时候服务器必须处于关机状态，所以我们先将服务器关机。然后点击“ssh密钥” -> “添加” -> 选择“使用已有公钥” -> 输入密钥名称 ，以及描述 -> 点击“添加”。接着“选择绑定/解绑云主机”将密钥绑定到指定的服务器上。绑定成功之后将服务器开机，如果之前有些守护进程在服务器上跑，开机之后记得将它们恢复。

![控制台绑定密钥](https://olpkwt43d.qnssl.com/blog/post20171017_03.png)

接下来就是使用`sublime`的`sftp`插件连接服务器了。需要注意的是`sftp`插件在`windows`上并不识别linux的`.pub`形式的密钥 ，所以我们需要使用`puttygen`将密钥转换成`.ppk`形式的密钥。
点击[这里](https://the.earth.li/~sgtatham/putty/latest/w64/putty-64bit-0.70-installer.msi)下载`puttygen`。

下面是如何使用`puttygen`将`.pub`形式密钥转换成`.ppk`形式的密钥：
1. 运行`puttygen`
2. 点击`Conversions`菜单项中的`Import key`
3. 选择在`git bash`下生成的`id_rsa`文件
4. 在`puttygen`的界面上点击`Save private key`按钮就可以把私钥转换为`ppk`的格式了

最后就是设置`sftp`插件了，在`sublime`中右击根目录 ，选择`SFTP/FTP` -> `map to remote` , 重点改以下几项：
```
"type": "sftp", // 选择文件传输协议为sftp

"upload_on_save": true, // 开启保存立即上传

"host": "example.com", // 配置成自己的服务器ip
"user": "username", // 服务器登陆名，腾讯云一般是ubuntu
//"password": "password", // 密码不用配置，注释掉 
"port": "22", // 22端口

"ssh_key_file": "C:\/Users\/andyliwr\/.ssh\/txy_ubutu_putty.ppk", // 密钥地址，window下格式有些不一样，/要改成\/
```



然后再试试能否成功连接腾讯云服务器，有任何疑问，你可以发送邮件到我的邮箱andyliwr@outlook.com。