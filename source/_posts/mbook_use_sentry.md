---
layout: post
title: 微书接入sentry
date: 2018-10-28 11:22:18
tags:
  - linux
---

### 前言

最近想自己搭建一个错误监控平台来监控微书出现的代码错误，走了不少坑，还把线上服务器的 root 权限给整没了，这里记录下...

### sentry 安装

我直接贴代码了，每个步骤的说明我会写在注释里。

```shell
# 安装docker
wget -qO- https://get.docker.com/ | sh
sudo usermod -aG docker ubuntu
docker -v

# 安装docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

# 安装sentry
git clone https://github.com/getsentry/onpremise.git
cd onpremise/
ls
touch .env
export DOCKER_HOST=tcp://127.0.0.1:2375
sudo docker volume create --name=sentry-data
sudo docker volume create --name=sentry-postgres
sudo docker-compose run --rm web config generate-secret-key
# 将上一步生成的秘钥写入到docker-compose.yml 变量名称是SENTRY_SECRET_KEY
vi docker-compose.yml
# 更新配置，创建超级管理员用户，这一步等待有点长
sudo docker-compose run --rm web upgrade

# 安装成功，访问localhost:9000
curl http://localhost:9000

# nginx配置，将本地端口代理到域名上，这里忽略了
```

### sentry 配合 Koa

1. 在搭建好的创建一个 Nodejs 项目
   ![创建项目](https://fs.andylistudio.com/1540698040385.png)
2. 安装 raven 包

```
cnpm install raven --save
```

3. 修改 koa 中的 app.js

```javascript
var Raven = require('raven');
// 填写生成的日志上传地址
Raven.config('http://44cbd1e49f7b4e88847a1c22a279ad45@localhost:9000/2').install();

// koa错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err);
  // 上传错误日志
  Raven.setContext({
    user: ctx
  });
  Raven.captureException(err, function(err, eventId) {
    console.log('Reported error ' + eventId);
  });
});
```

4.  监控错误截图
    这个就是 sentry 监控到的错误结果...
    ![监控错误截图](https://fs.andylistudio.com/1540698396271.png)

### sentry 配合小程序

sentry 不能直接支持小程序的，需要使用一个额外的包，下载地址：[raven-weapp](https://github.com/youzan/raven-weapp)
将源码下载到小程序代码目录下，引入并初始化

```javascript
const Raven = require('./raven.min.js');
Raven.config('http://9860e45722b3427586db2a0514edd00c@localhost:9000/3', {
  release: 'v1.11.0',
  environment: 'production', // 指定为production才会上报
  allowDuplicates: true, // 允许相同错误重复上报
  sampleRate: 0.5 // 采样率
}).install();

/*
 * 微信小程序错误上报函数
 */
const debug = message => {
  Raven.captureException(message, { level: 'error' });
};
```

![小程序错误](https://fs.andylistudio.com/1540699864079.png)
