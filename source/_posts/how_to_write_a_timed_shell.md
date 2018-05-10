---
layout: post
title: 如何写一个定时执行的shell脚本
date: 2018-05-03 13:44:39
tags:
 - 同花顺
 - linux
---

### 前言

需求是需要对放在测试服务器的 git 仓库定期做好备份，防止测试服务器有天挂掉了数据会丢失掉。假设现在有两台服务器--服务器 A 和服务器 B，A 和 B 在两个不同的网段，没法通过 ssh 或者 ftp 直接连接上。如何将放在 A 上的 git 仓库数据每隔一天备份并存储到 B 上?

### linux 定时脚本

我使用的是`crontab`包，登录服务器 A，检查`crontab`并将`crontab`设置为开机自启。

```
# 查看crontab的版本，如果没有安装就去安装下
crontab -v
# 使用chkconfig设置crontab为开机启动启动，ubuntu好像默认不支持这个工具，自己安装咯
chkconfig crond on
```

`crontab`命令说明如下：

* -e：编辑该用户的计时器设置；
* -l：列出该用户的计时器设置；
* -r：删除该用户的计时器设置；
* -u <用户名称>：指定要设定计时器的用户名称。

`crontab`定时任务语法如下:

```
minute   hour   day   month   week   command     顺序：分 时 日 月 周
```

说明

* minute： 表示分钟，可以是从 0 到 59 之间的任何整数。
* hour：表示小时，可以是从 0 到 23 之间的任何整数。
* day：表示日期，可以是从 1 到 31 之间的任何整数。
* month：表示月份，可以是从 1 到 12 之间的任何整数。
* week：表示星期几，可以是从 0 到 7 之间的任何整数，这里的 0 或 7 代表星期日。
* command：要执行的命令，可以是系统命令，也可以是自己编写的脚本文件。

在以上各个字段中，还可以使用以下特殊字符：

* 星号（\*）：代表所有可能的值，例如 month 字段如果是星号，则表示在满足其它字段的制约条件后每月都执行该命令操作。
* 逗号（,）：可以用逗号隔开的值指定一个列表范围，例如，“1,2,5,7,8,9”
* 中杠（-）：可以用整数之间的中杠表示一个整数范围，例如“2-6”表示“2,3,4,5,6”
* 正斜线（/）：可以用正斜线指定时间的间隔频率，例如“0-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如\*/10，如果用在 minute 字段，表示每十分钟执行一次。

详情请参考[这里](http://wangchujiang.com/linux-command/c/crontab.html)
如此，我要设计每天凌晨执行一次脚本，`crontab`的任务就应该这么写：

```
0 0 * * * /xxx/backup.sh
```

### 如何实现两台服务器数据互传

我是借助了搭建在 A 服务器上的一个名为`kodexplorer`的文件上传工具实现的，先将备份好的文件移动到`kodexplorer`的目录下，然后就能拿到一个外网可访问的地址，B 服务器下通过 wget 就能下载到备份的文件。比如 A 在凌晨整点做了备份，B 就可以在凌晨过 10 分去下载 A 备份好的文件具体的`shell`代码如下:

**跑在 A 服务器上的 shell 脚本**

```sh
#!/bin/bash
cd /root/go18/src/github.com/gogits/gogs/
echo -e "\n\n\nbackup started..." >> ./backup.log
# shell新建变量的语法，=前后不能有空格
DATE_N=`date "+%Y-%m-%d %H:%M:%S"`
USER_N=`whoami`
echo -e "Date and runner info: ${DATE_N} ${USER_N}" >> ./backup.log
# 执行备份
./gogs backup
# 使用$?判断上一步的备份是否执行成功
if [ $? -eq 0 ]; then
    echo "backup success" >> ./backup.log
else
    echo "backup failed" >> ./backup.log
fi
# 重命名新建的备份文件，并将其移动到kodexplorer的目录下
mv gogs-backup-* gogs-backup.zip
mv gogs-backup.zip /home/wwwroot/kodexplorer/data/User/lidikang/home/gogs_backup
echo "backup ended..." >> ./backup.log
exit 0
```

**跑在 B 服务器上的 shell 脚本**

```sh
#!/bin/bash
cd /root/gogs_backup
echo -e "\n\n\n backup started..." >> ./backup.log
DATE_N=`date "+%Y-%m-%d %H:%M:%S"`
DATE_NAME=`date "+%Y-%m-%d-%H-%M-%s"`
USER_N=`whoami`
echo -e "Date and runner info: ${DATE_N} ${USER_N}" >> ./backup.log
wget https://khtest.10jqka.com.cn/dev/lidikang/gogs_backup/gogs-backup.zip
if [ $? -eq 0 ]; then
    echo "download success" >> ./backup.log
else
    echo "download failed" >> ./backup.log
fi
mv gogs-backup.zip "gogs-backup-""$DATE_NAME"".zip"
echo "backup ended..." >> ./backup.log
exit 0
```

提一下，新建的 shell 记得添加可执行权限。

```
chmod +x xxx.sh
```
