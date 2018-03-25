title: mysql本地能登录但是远程不能登录
date: 2017-08-14 14:26:51
tags: 数据库
---
## 前言
今天配置新后台的mysql数据库，新建了一个用户之后在本地可以登录，但是远程一直显示`access delay`,今天就来讲讲如何解决mysql本地可以登录但是远程不能登录的解决方案吧。
![mysql](https://fs.andylistudio.com/blog/images/mysql.png/default)
先贴些网上的常见方案，多半都是这些设置不对引起的，虽然我的问题并非通过这些解决的。
1. 检查防火墙是否开放了3306多端口
先看是否能ping通远程服务器，ping 192.168.1.211，如果不可以就是网络问题。然后，检查端口是否被防火墙挡住了，telnet 192.168.1.211 3306，如果连接失败，配置防火墙。
```bash
vi /etc/sysconfig/iptables
-A INPUT -m state –state NEW -m tcp -p tcp –dport 3306 -j ACCEPT（允许3306端口通过防火墙）
/etc/init.d/iptables restart（重启防火墙使配置生效）
```
2. 检查mysql配置
如果开启了防火墙，telnet还是失败，通过netstat查看3306的端口状态：
```bash
netstat -apn|grep 3360
tcp6 0 0 127.0.0.1:3306 :::* LISTEN 13524/mysqld
```
  注意红色的地方，这说明3306被绑定到了本地。检查一下my.cnf的配置，这里可以配置绑定ip地址。
```
bind-address=addr
```
不配置或者IP配置为0.0.0.0，表示监听所有客户端连接。最后重启mysql。
3. 修复mysql的user表
```bash
use mysql;//使用mysql数据库
select user, password, host from user;//查看当前数据库的访问列表
update user set host='%' where host='127.0.0.1'//修改服务器数据库可以被任何远程计算机访问
flush privileges;​ //刷新权限
```

4. 如果第三步改完之后还是没有生效，可以删除当前想要配置的用户(root就算了，我是说非root用的话)，使用下面的语句重新配置权限：
```bash
drop user xxx
create user xxx identified by '[密码]'
grant all on [拥有权限的表名].* to '[用户名]'@'%'
```
