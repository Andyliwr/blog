---
title: windows下安装mysql的正确打开方式
date: 2017-10-30 10:21:10
tags:
  - mysql
  - windows
---

#### 前言

今天早上好气呀！因为项目原因需要在自己电脑上安装一个`mysql`，去官网下载`mysql`的安装工具，结果到了最后一步无法配置`mysql`，就是那种可以选但是没有下一步按钮，这不是为难用户吗？折腾了半天只能删除`mysql installer`，下载 mysql 源码进行安装。下面简单描述下自己的安装过程：

#### 安装 mysql

1.  **下载 mysql 源码**
    [官网下载地址](https://dev.mysql.com/downloads/mysql/)
    ![源码安装](http://ouizhbgin.bkt.clouddn.com/blog/2017/10/30/mysql_source.png)

2.  **下载完成之后将其解压到本地目录**，在`mysql`根目录下新建一个`data`和一个`log`文件夹，此外还需要新建一个`my.ini`文件，用来配置`mysql`，写入如下代码：

```ini
[mysqld]
basedir=D:\mysql
datadir=D:\mysql\data
```

3.  配置`mysql`的`bin\`目录到**系统环境变量**，并重启计算机
    ![系统环境变量](http://ouizhbgin.bkt.clouddn.com/blog/2017/10/30/mysql_system_path.png)

4.  以管理员身份运行**cmd**，并输入以下代码

```
# 将mysql安装为系统服务
mysqld -install
# mysql初始化，如果需要不开启用户认证，请将mysqld --initialize替换成mysqld --initialize-insecure
mysqld --initialize
# 启动mysql
net start mysql
```

注意：在启动`mysql`之前一定要进行初始化，否则就会出现`‘The mysql service could not be started. The service did not report an error’`

```
C:\Windows\system32>net start mysql
The MySQL service is starting.
The MySQL service could not be started.
The service did not report an error.
More help is available by typing NET HELPMSG 3534.
```

如果出现这个错误，请先删除 data\目录下的所有数据，然后重新执行 mysqld --initialize
![mysql start](http://ouizhbgin.bkt.clouddn.com/blog/2017/10/30/mysql_start.png)

5.  **最后关于`mysql`使用`root`无法登陆，以及如何让本地`mysql`支持远程访问等这些问题，请翻阅我以前的 csdn 博客**：

* [启动 mysql 出现服务无法启动，服务没有报告任何错误](http://blog.csdn.net/u014374031/article/details/54586638)
* [MySQL 忘记密码怎么办？](http://blog.csdn.net/u014374031/article/details/51134794)
* [教你怎么在`windows server 2008`的服务器上搭建 mysql 数据库](http://blog.csdn.net/u014374031/article/details/49253135)
* [MYSQL 授权管理](http://blog.csdn.net/u014374031/article/details/45484105)

      	注意新版的mysql已经将password从user表中移除了，修改密码请使用以下代码
      	```
      	use mysql
      	update user set authentication_string=PASSWORD('123456') where user="root";
      	```

#### 史上最坑集合

**1、The mysql service on Local computer started and then stopped**
由于修改 mysql 编码很频繁，导致`mysql`一直重启又关闭，最后一次重启时竟然不干了，直接报`The mysql service on Local computer started and then stopped`，我又开了漫天盖地的百度，`google`，可是愣是没找到一种解决方案（重启电脑都试过两次了）。于是开始试着去读 mysql 的错误日志，发现自己在修改编码的时候在 my.ini 文件的[mysqld]下面加入了`character_set_database=utf8`，但是`mysql`并不能识别这个配置。于是我将这一行配置删除掉。并且在注册表删除记录---`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MySQL`。重启`mysql`，这次报了今天早上遇到的错误`“The mysql service could not be started. The service did not report an error”`，于是只能删除 data\目录下的所有数据，使用`mysqld --initialize-insecure`重新初始化一遍，最后才启动成功，我还得重新创建`root`用户。真心别坑我啊，难受>\_<

**2. windows mysql 不支持中文**
修改`my.ini`配置文件

```
[mysqld]
basedir=D:\mysql
datadir=D:\mysql\data
character_set_server=utf8

[client]
default-character-set=utf8

[mysql]
default-character-set=utf8
```

最后删除`mysql`下的 data\目录从头到尾再来一遍吧，因为配置虽然改了，但是原来那些创建的表的编码还没有被改变，插入中文还是会出问题。尝试过网上说的直接进入`mysql`命令行改编码，但是没啥用啊，改了之后推出再进去还是原来的编码。也可能是我改的时候出了啥问题，作为一种方法吧，不行的时候可以试试。

```
use mysql;
show variables like'%char%';
set character_set_database=utf8;
set character_set_server=utf8;
set character_set_client=gbk;
set character_set_connection=gbk;
```

**3、分组查询错误**---`this is incompatible with sql_mode=only_full_group_by`

在 mysql 命令行模式下输入一下代码：

```
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```

不行的话就执行这句：

```
set @@sql_mode ='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
```

最终使用`select @@sql_mode`查看取得的值中是否还有`ONLY_FULL_GROUP_BY`

是不是觉得博主是个热爱分享的好人？哈哈~
