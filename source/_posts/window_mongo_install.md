---
title: window上搭建mongodb
date: 2017-10-17 22:17:00
tags:
 - windows
 - mongodb
---

### 前言

`wecomment`连接不上[`mlab`](http://mlab.com/)的免费 mongo 数据库，同样也连不上腾讯云服务器的 mongo 数据库，好气呀>\_<，只能花时间在 windows 上搭建一个本地 mongo 了，下面是我的踩坑历程，希望能帮到你~

### 开始

1.  下载 mongo
    [官方网站下载地址](https://www.mongodb.com/download-center?jmp=nav#community)
    [百度云盘 ](https://pan.baidu.com/s/1eSaTAb4) 提取密码：`a9ca`

2.  新建`data`和`log`文件夹在安装完成后的根目录下使用`cmd`执行以下命令

```bat
mkdir data
cd data && mkdir db
mkdir log
cd log
# 创建mongo.log日志文件
type nul>mongo.log
```

3.  将 mongo 设置为系统服务以管理员身份运行`cmd`，并执行以下命令：

```bat
cd D:\mongo\bin
D:
mongod.exe --bind_ip localhost --logpath "D:\mongo\log\mongo.log" --logappend --dbpath "D:\mongo\data\db" --port 27017 --auth --serviceName "mongodb" --serviceDisplayName "mongodb" --install
```

然后使用小娜搜索“服务”，在本地服务列表中找到刚才新建的服务`“mongo”`, 右击点击“启动”就好了。最后在 cmd 中输入`mongo`就能进入`mongo`命令行模式了（注意如果 mongo 没有设置系统环境变量，请自行添加，或者每次切换到 mongo 的执行目录---`D:\mongo\bin`执行命令）。

### 如何创建表和用户

在 mongo 命令行中执行以下命令

```bat
use wecomment
db.test.insert({"name": "xxx"})
# 查看刚才常见的数据库
show dbs
# 创建数据库的用户
use wecomment
db.createUser({
	"user": "admin",
	"pwd": "123456",
	"roles": [{role: "readWrite", db: "wecomment"}]
})

# 使用auth命令来检测用户是否添加成功，返回1表示添加成功
db.auth("admin", "123456")
```

### 常见问题

1.  在安装完`mongo`启动 koa 项目的时候报`Authentication failed`错误

这是由于`mongodb`加入了`SCRAM-SHA-1`的校验方式，需要第三方工具配合进行验证。修复的方法如下：关闭刚才创建的`mongodb`的系统服务，在 cmd 下使用`mongodb.exe`启动`mongo`

```
cd D:\mongo\bin
mongodb.exe --dbpath D:\mongo\data\db --logpath D:\mongo\log\mongo.log
```

注意这里不要加上`--auth`参数，因为接下来的操作必须在关闭认证的情况下进行。

```
# 进入mongo命令行
mongo.exe
# mongo shell命令
use admin
var schema = db.system.version.findOne({"_id" : "authSchema"})
schema.currentVersion = 3
db.system.version.save(schema)
```

现在已经成功将`system.version`文档里面的`authSchema`版本修改为 3。接下来删除原来创建的用户并重建它们

```
use admin
db.system.user.find()
db.system.user.remove({user: "admin"})
```

最后关闭之前开启的未认证的`mongo`进程，重启系统`mongodb`进程，然后再试试能否连接上`mongo`。
