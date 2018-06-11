---
layout: post
title: mongo自动备份
date: 2018-06-11 23:59:23
tags:
  - mongodb
toc: true
reproduced: true
---

#### 前言

我欠博客一个解释，为啥这么久都不更新 😂，好吧，人变懒了...
讲下最近我服务器出现的一个事吧，某日我为了方便查看数据，在腾讯云服务器上把 27017 端口给开放了，然后过了两天，需求方和我说小程序出了问题。我一查就发现数据库里的数据都被人删除光了 😭，而我正好又没做好备份，然后花了很长时间去重建数据。

这件事反应了两个问题，第一：如果数据库允许远程访问一定要做好用户权限的设置，不能让人随意修改，第二：重要的数据一定要做好备份，防止万一出了问题造成的损失。

不扯了，进入今天的主题吧---如何自动备份`mongo`。

#### 介绍`mongodump`

`mongodump` 是 `MongoDB` 提供的一个工具，用于备份数据库，配合使用 `mongorestore`恢复工具使用。这套工具适合小型应用或开发环境。

运行 `mongodump` 和 `mongorestore` 时需要读取正在运行的数据库实例，因此会影响数据库性能。一方面是运行时需要占用系统资源，另一方面，运行这两个命令时数据库会强制通过内存读取所有数据，可能导致读取的不常用数据覆盖常用数据，从而影响数据库日常运行的性能。

关于它们的用法举个栗子：

```
# 从本地恢复数据库
mongorestore -h localhost:27017 -d mbook -u admin -p 123456 本地数据库地址
# 备份数据库到本地
mongodump -h localhost:27017 -d mbook -u admin -p 123456 -o 需要存储的本地目录
```

#### 自动执行脚本

首先我们要创建一个执行备份工作的脚本。在 `~/crontab/` 下新建一个 `.sh` 文件：

```
mkdir -p ~/crontab
vi ~/crontab/mongod_bak.sh
```

写入以下内容：

```
#!/bin/sh
DUMP=mongodump
OUT_DIR=/data/backup/mongod/tmp   // 备份文件临时目录
TAR_DIR=/data/backup/mongod       // 备份文件正式目录
DATE=`date +%Y_%m_%d_%H_%M_%S`    // 备份文件将以备份时间保存
DB_USER=<USER>                    // 数据库操作员
DB_PASS=<PASSWORD>                // 数据库操作员密码
DAYS=14                           // 保留最新14天的备份
TAR_BAK="mongod_bak_$DATE.tar.gz" // 备份文件命名格式
cd $OUT_DIR                       // 创建文件夹
rm -rf $OUT_DIR/*                 // 清空临时目录
mkdir -p $OUT_DIR/$DATE           // 创建本次备份文件夹
$DUMP -u $DB_USER -p $DB_PASS -o $OUT_DIR/$DATE  // 执行备份命令
cd $TAR_DIR
tar -zcvf $TAR_BAK $OUT_DIR/$DATE       // 将备份文件打包放入正式目录
find $TAR_DIR/ -mtime +$DAYS -delete             // 删除14天前的旧备份
```

这个脚本完成了备份、打包、删除一定时间之前旧备份的工作。注意其中的`user`需要具有对希望备份的数据库具有`find`操作权限。
保存好脚本后别忘了将它设为可执行：

```
chmod +x ~/crontab/mongod_bak.sh
```

现在你可以试着执行一下`./mongod_bak.sh`，就会在备份文件夹中看到打包好的备份数据了。

#### 自动运行

备份脚本写好之后，就需要让它自动运行。直接使用 Linux 的 crontab 命令即可：

```
vi /etc/crontab
```

在底部添加：

```
0 2 * * * root ~/crontab/mongod_bak.sh
```

这一行表示在每天凌晨 02:00 以 root 身份运行备份数据库的脚本。然后重启 crond 使其生效：

```
sudo /etc/init.d/cron restart
chkconfig crond on  // 设为开机启动
```

#### 结束

文章摘抄至[全栈渐进之路](https://brickyang.github.io/2017/03/02/Linux-%E8%87%AA%E5%8A%A8%E5%A4%87%E4%BB%BD-MongoDB/)
