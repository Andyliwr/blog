---
title: 站点https化教程
date: 2017-04-22 14:42:42
tags:
  - linux
  - 同花顺
---

最近因为小程序发布需要接口 https 化的原因，不得不让自己的网站支持 https。一些原理啥的我就不讲了，直接说下自己怎么做的吧

首先需要在阿里云去购买一个 https 证书，你可以点击[这儿](https://www.aliyun.com/product/cas?spm=5176.8142029.388261.134.M9IiRM)进行传送，免费版的不收钱，而且可以申请很多个，如果你有多个网站需要支持 https 的话。

![这里写图片描述](http://img.blog.csdn.net/20170422141707346)

购买之后，点击补充信息，并在接下来的页面填写完必要的信息。域名校验类型注意选择 dns，并且勾选下方的复选框。

![这里写图片描述](http://img.blog.csdn.net/20170422143104063)

![这里写图片描述](http://img.blog.csdn.net/20170422142809575)

点击系统生成 src，点击创建。这样申请 https 证书的请求就被创建了。大概等个 5 分钟，阿里就会给出回复。一般情况下域名的 txt 解析都已经被自动添加上去了，如果提示未成功，那自己按照提示手动添加下吧。

![提交审核](http://upload.chinaz.com/2017/0105/201701051009248388.jpeg)

创建成功之后我们就可以看到证书已签发，然后卸载证书到计算机本地，想要传到服务器，你可以通过 sftp 或者 ftp，如果这些做不到就找一个存放资源的空间---比如七牛云空间，把 pem 和 key 文件传送去，复制他们的 url，然后在命令行里输入

```bash
wget http://xxxxx.pem
```

这样你就获取到他们了。在你的服务器上新建一个目录，把这些文件放在这个目录下

```bash
mkdir /var/ssl
mv xxx.pem /var/ssl/
mv xxx.key /var/ssl/
```

接下来就是配置 nginx 了，不讲那么多了，直接贴代码了

```nginx
########### website（使http可以访问） ##########
  server {
    listen       80;
    # listen 443 default ssl;
    server_name  api.andylistudio.com;
    # rewrite ^(.*)$  https://$host$1 permanent;
    location / {
      proxy_pass http://localhost:3000/;
      proxy_set_header   Host    $host;
      proxy_set_header   X-Real-IP   $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
  server {
    listen       80;
    # listen 443 default ssl;
    server_name  khdoc.andylistudio.com;
    # rewrite ^(.*)$  https://$host$1 permanent;
    location / {
      proxy_pass http://localhost:8083/;
      proxy_set_header   Host    $host;
      proxy_set_header   X-Real-IP   $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
############ ssl（使https可以访问） ################
server {
    listen 443 ssl;
    server_name api.andylistudio.com;
    ssl on;
    root html;
    index index.html index.htm;
    ssl_certificate   /var/ssl/api/api.pem;
    ssl_certificate_key  /var/ssl/api/api.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location / {
      proxy_pass http://localhost:3000/;
      proxy_set_header   Host    $host;
      proxy_set_header   X-Real-IP   $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
  server {
    listen 443 ssl;
    server_name khdoc.andylistudio.com;
    ssl on;
    root html;
	index index.html index.htm;
    ssl_certificate   /var/ssl/khdoc/khdoc.pem;
    ssl_certificate_key  /var/ssl/khdoc/khdoc.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location / {
      proxy_pass http://localhost:8083/;
      proxy_set_header   Host    $host;
      proxy_set_header   X-Real-IP   $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
```

参考文档：
[nginx 同一个 IP 上配置多个 HTTPS 主机](http://www.ttlsa.com/web/multiple-https-host-nginx-with-a-ip-configuration/)
[nginx 使用 ssl 模块配置支持 HTTPS 访问](http://www.cnblogs.com/saneri/p/5391821.html)
