---
title: 在Ubuntu上搭建redis服务器
date: 2017-01-17 21:19:48
tags:
 - linux
---

Redis是一个key-value存储系统。和Memcached类似，但是解决了断电后数据完全丢失的情况，而且她支持更多无化的value类型，除了和string外，还支持lists（链表）、sets（集合）和zsets（有序集合）几种数据类型。这些数据类型都支持push/pop、add/remove及取交集并集和差集及更丰富的操作，而且这些操作都是原子性的。

#### 下载安装redis

```bash
redis中文官网—redis.cn，
wget http://download.redis.io/releases/redis-3.2.5.tar.gz
tar –zxvf redis-2.4.6.tar.gz
mv redis-2.4.6 redis
mv redis /usr/local
cd /usr/local/redis
# 在安装了gcc编译器的前提下，直接make
make
make install
make test

然后将src目录写入profile：

vi /etc/profile
export REDIS=/usr/local/redis/src
export PATH=xxx:$REDIS:$PATH
保存退出
source /etc/profile

输入redis-server /usr/local/redis/redis.conf，这样redis就启动了，地址为172.0.0.1:6379

# 我们需要改变下redis的地址和启动方式，
vi /usr/local/redis/redis.conf
输入?daemonize 将它设置为no
找到bindip将他设置为0.0.0.0
找到requirepass，将它设置为redis访问的密码（自定义）

接着，我们重启redis，停止reids现在只知道netstat -tunpl 然后 kill -9 pid的方法

然后输入redis-cli -a “你设置的密码”，输入keys *查看所有的键值对，权限报错的话就输入auth “你设置的密码”， 输入info查看redis的状态
```

#### 常见错误处理
A. `>>> 'protected-mode yes' Bad directive or wrong number of arguments`之前使用下载安装包自己编译的，后来输入redis-server无效，然后又使用apt-get安装了redis，两次版本不一致导致conf文件的某些字段老版本不支持，所以就删除`apt-get remove redis-server`
B. make test出错，`You need tcl 8.5 or newer in order to run the Redis test.`

```bash
wget http://downloads.sourceforge.net/tcl/tcl8.6.1-src.tar.gz
sudo tar xzvf tcl8.6.1-src.tar.gz -C /usr/local/
cd /usr/local/tcl8.6.1/unix/
sudo ./configure
sudo make
sudo make install
```

#### 传送门：
[讲redis设置为后台进程启动](http://blog.csdn.net/wujiangwei567/article/details/51206052)