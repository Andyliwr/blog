---
title: ubuntu16.04安装nginx教程
date: 2017-06-18 22:48:00
tags:
  - linux
  - nginx
---

#### 1. 安装 nginx 的依赖包

```bash
# 查看zlib是否安装
dpkg -l | grep zlib
# 解决依赖包openssl安装
sudo apt-get install openssl libssl-dev
# 解决依赖包pcre安装
sudo apt-get install libpcre3 libpcre3-dev
# 解决依赖包zlib安装
sudo apt-get install zlib1g-dev
```

#### 2. 下载 nginx

访问[nginx 官网](http://nginx.org/en/download.html)，

```bash
# 下载nginx
wget http://nginx.org/download/nginx-1.13.1.tar.gz
# 解压nginx
tar -xzvf nginx-1.13.1.tar.gz
# 重命名文件夹
mv nginx-1.13.1 nginx
# 移动文件夹到ubuntu常见软件目录下
mv nginx/ /usr/local/
```

#### 3. 安装 nginx

```bash
# 配置nginx
cd /usr/local/nginx
sudo ./configure --user=www --group=www --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_realip_module
# 编译nginx
sudo make
# 安装nginx
sudo make install
```

#### 4. 检查 nginx 是否安装成功

```bash
cd /usr/local/nginx/sbin
./nginx -t
```

如果结果结果显示：

```bash
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

#### 5. 配置用户

```bash
# 添加www组
groupadd www
# 创建nginx运行账户www并加入到www组，不允许www用户直接登录系统
useradd -g  www www -s /bin/false
```

#### 6. 配置防火墙

如果是使用的腾讯服务器，只需要在服务器管理平台添加 80 端口的安全组就好
![腾讯云安全组](https://file.lantingshucheng.com/blog/tengxunyun.jpg/default)
服务器则可以设置防火墙：

```bash
# 修改防火墙配置：
vi + /etc/sysconfig/iptables
# 添加配置项
-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
# 重启防火墙
service iptables restart
```

#### 7. 启动 nginx

```bash
# 方法1
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
# 方法2
cd /usr/local/nginx/sbin
./nginx
```

#### 传送门

[linux 公社一篇更加详细的教程](http://www.linuxidc.com/Linux/2016-08/134110.htm)
