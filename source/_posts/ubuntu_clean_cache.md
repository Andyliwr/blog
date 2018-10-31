---
layout: post
title: Linux清除内存缓存
date: 2018-10-29 15:32:01
tags:
  - linux
---

### 前言

今天记录下自己处理线上服务器内存不足的问题的过程。
某天 xxx 跟我说线上服务器现在很卡，接口响应比较慢。我就纳闷了一个 2G 内存的服务器能支持 4000 千的访问量吗？不过还是得去看下，当我敲下`free -m`看到了如下信息：
![内存使用情况](https://fs.andylistudio.com/1540800401850.png)

### 如何清除

火速去查了下`free -m`各自代表的意思，答案如下：
![字段说明](https://fs.andylistudio.com/1540802248956.png)

> 为了提高磁盘存取效率，Linux 做了一些精心的设计，除了对 dentry 进行缓存（用于 VFS，加速文件路径名到 inode 的转换），还采取了两种主要 Cache 方式：Buffer Cache 和 Page Cache。前者针对磁盘块的读写，后者针对文件 inode 的读写。这些 Cache 有效缩短了 I/O 系统调用（比如 read，write，getdents）的时间。
> 摘抄至 http://www.linuxde.net/2011/07/402.html

#### 那么如何手动释放缓存呢？

`/proc`是一个虚拟文件系统，我们可以通过对它的读写操作做为与`kernel`实体间进行通信的一种手段。也就是说可以通过修改`/proc`中的文件，来对当前`kernel`的行为做出调整。那么我们可以通过调整`/proc/sys/vm/drop_caches`来释放内存。操作如下：

1. 查看/proc/sys/vm/drop_caches 的值

```
cat /proc/sys/vm/drop_caches
```

2. 手动执行 `sync` 命令（描述：`sync` 命令运行 `sync` 子例程。如果必须停止系统，则运行 `sync` 命令以确保文件系统的完整性。`sync` 命令将所有未写的系统缓冲区写到磁盘中，包含已修改的 `i-node`、已延迟的块 `I/O` 和读写映射文件）

```
sync && echo 3 > /proc/sys/vm/drop_caches
```

此时在输入`free -m`就会发现 `buffer` 和 `cache` 均被释放了

#### 为什么free那么小
因为`Linux`对内存的管理与`Windows`不同，`free`小并不是说内存不够用了，应该看的是`free`的第二行最后一个值：`-/+ buffers/cache: 58 191`，这才是系统可用的内存大小。

既然核心是可以快速清空buffer或cache，也不难做到（这从上面的操作中可以明显看到），但核心并没有这样做（默认值是0），我们就不应该随便去改变它。一般情况下，应用在系统上稳定运行了，free值也会保持在一个稳定值的，虽然看上去可能比较小。

当发生内存不足、应用获取不到可用内存、OOM错误等问题时，还是更应该去分析应用方面的原因，如用户量太大导致内存不足、发生应用内存溢出等情况，否则，清空buffer，强制腾出free的大小，可能只是把问题给暂时屏蔽了。

> 我觉得，排除内存不足的情况外，除非是在软件开发阶段，需要临时清掉buffer，以判断应用的内存使用情况；或应用已经不再提供支持，即使应用对内存的时候确实有问题，而且无法避免的情况下，才考虑定时清空buffer。（可惜，这样的应用通常都是运行在老的操作系统版本上，上面的操作也解决不了）。而生产环境下的服务器可以不考虑手工释放内存，这样会带来更多的问题。记住内存是拿来用的，不是拿来看的。不像windows。

> 无论你的真实物理内存有多少，他都要拿硬盘交换文件来读。这也就是windows为什么常常提示虚拟空间不足的原因，你们想想多无聊，在内存还有大部分的时候，拿出一部分硬盘空间来充当内存。硬盘怎么会快过内存，所以我们看linux，只要不用swap的交换空间，就不用担心自己的内存太少。如果常常swap用很多,可能你就要考虑加物理内存了，这也是linux看内存是否够用的标准哦。

### 定时脚本
1. 新建一个bash文件，写入如下代码
```bash
#!/bin/bash

used=`free -m | awk 'NR==2' | awk '{print $3}'`
free=`free -m | awk 'NR==2' | awk '{print $4}'`

echo "===========================" >> /var/log/mem.log
date >> /var/log/mem.log
echo "Memory usage | [Use：${used}MB][Free：${free}MB]" >> /var/log/mem.log

if [ $free -le 100 ] ; then
  sync && echo 1 > /proc/sys/vm/drop_caches
  sync && echo 2 > /proc/sys/vm/drop_caches
  sync && echo 3 > /proc/sys/vm/drop_caches
  echo "OK" >> /var/log/mem.log
else
  echo "Not required" >> /var/log/mem.log
```
2. 添加可执行权限
```bash
chmod +x xxx.sh
```

3. 将脚本加入到定时任务中
```bash
sudo vi /etc/crontab
# 写入
*/30 * * * * root /root/satools/freemem.sh
``` 

### 备注
文章大部分摘抄于LinuxToday，[点击此处查看原文](http://www.linuxde.net/2011/07/402.html)
