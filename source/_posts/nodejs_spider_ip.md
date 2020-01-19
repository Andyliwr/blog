---
title: nodejs爬虫如何设置动态ip以及userAgent
date: 2017-12-05 17:45:31
tags: 
  - nodejs
  - 爬虫
---

### 前言

在写 nodejs 爬虫的过程中，原网站可能会对某一时间段内集中访问该页面的 ip 进行封杀。那么如何动态设置每次爬取使用的 ip 地址以及浏览器头部信息呢？

### 动态 userAgent

这是我收集到的常用的浏览器头部信息，每次爬取的时候从中随机选取一个，并使用 superAgent 设置请求头部的 User-Agent 字段就好了。

### `userAgent.js`

```js
const userAgents = [
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
  'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
];

module.exports = userAgents;
```

### `app.js`

```js
import request from 'superagent';
import userAgents from '../src/userAgent';

async function doRequest() {
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  request
    .get('http://www.xxx.com')
    .set({ 'User-Agent': userAgent })
    .timeout({ response: 5000, deadline: 60000 })
    .end(async (err, res) => {
      // 处理数据
    });
}
```

### 动态 ip

设置动态 IP 需要用到一个 superagent 插件---[superagent-proxy](https://github.com/TooTallNate/superagent-proxy)，除此之外为了避免每次爬取时都去获取一次动态 IP 的列表，我将爬取到的动态 IP 列表存放在 redis 中，并设置 10 分钟的过期时间。数据过期之后再重新发送获取动态 IP 的请求。
ps: 这里我使用的动态 IP 是[爬虫网络科技公司](http://www.pcdaili.com/)提供的免费代理，因为免费所以难免会有些缺陷。有时候使用他的代理 ip 并不能访问得通，我在后面会做单独的处理。

### `package.json`

```json
{
  "name": "xxx",
  "version": "1.0.0",
  "description": "xxx",
  "main": "arf.js",
  "scripts": {
    "arf": "nodemon src/app.js --exec babel-node --config package.json"
  },
  "keywords": ["爬虫"],
  "author": "lidikang",
  "license": "MIT",
  "dependencies": {
    "bluebird": "^3.5.1",
    "cheerio": "^1.0.0-rc.2",
    "eventproxy": "^1.0.0",
    "mongoose": "^4.13.6",
    "mongoose-findorcreate": "^2.0.0",
    "progress": "^2.0.0",
    "redis": "^2.8.0",
    "superagent": "^3.8.1",
    "superagent-proxy": "^1.0.2"
  },
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
    "nodemon": "^1.12.4"
  },
  "nodemonConfig": {
    "ignore": ["ips.json", "docs/*"],
    "delay": "2500"
  }
}
```

### `app.js`

```js
import request from 'superagent';
import requestProxy from 'superagent-proxy';
import redis from 'redis';
// superagent添加使用代理ip的插件
requestProxy(request);
// redis promise化
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
// 建立mongoose和redis连接
const redisClient = connectRedis();

/**
 * 初始化redis
 */
function connectRedis() {
  let client = redis.createClient(config.REDIS_URL);
  client.on('ready', function(err) {
    console.log('redis连接 √');
  });
  client.on('error', function(err) {
    console.log(`redis错误，${err}  ×`);
  });
  return client;
}

/**
 * 请求免费代理，读取redis，如果代理信息已经过期，重新请求免费代理请求
 */
async function getProxyIp() {
  // 先从redis读取缓存ip
  let localIpStr = await redisClient.getAsync('proxy_ips');
  let ips = null;
  // 如果本地存在，则随机返回其中一个ip，否则重新请求
  if (localIpStr) {
    let localIps = localIpStr.split(',');
    return localIps[parseInt(Math.random() * localIps.length)];
  } else {
    let ipsJson = (await request.get('http://api.pcdaili.com/?orderid=888888888&num=100&protocol=1&method=1&an_ha=1&sp1=1&sp2=1&format=json&sep=1')).body;
    let isRequestSuccess = false;
    if (ipsJson && ipsJson.data.proxy_list) {
      ips = ipsJson.data.proxy_list;
      isRequestSuccess = true;
    } else {
      ips = ['http://127.0.0.1'];
    }
    // 将爬取结果存入本地，缓存时间10分钟
    if (isRequestSuccess) {
      redisClient.set('proxy_ips', ips.join(','), 'EX', 10 * 60);
    }
    return ips[parseInt(Math.random() * ips.length)];
  }
}

async function doRequest() {
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  let ip = await getProxyIp();
  let useIp = 'http://' + ip;
  request
    .get('http://www.xxx.com')
    .set({ 'User-Agent': userAgent })
    .timeout({ response: 5000, deadline: 60000 })
    .proxy(ip)
    .end(async (err, res) => {
      // 处理数据
    });
}
```

之前说爬虫网络科技的免费 ip 有些缺陷---代理成功率有些低。这点必须想办法去修复，原理其实很简单，既然一次不成功那我就换个 IP 再试，直到成功了我才去开始执行解析 html 的逻辑

```js
async function doRequest() {
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  let ip = await getProxyIp();
  let useIp = 'http://' + ip;
  request
    .get('http://www.xxx.com')
    .set({ 'User-Agent': userAgent })
    .timeout({ response: 5000, deadline: 60000 })
    .proxy(ip)
    .end(async (err, res) => {
      if (err) {
        console.log(`爬取页面失败，${err}，正在重新寻找代理ip... ×`);
        // 如果是代理ip无法访问，另外选择一个代理
        doRequest('http://' + (await getProxyIp()), userAgents[parseInt(Math.random() * userAgents.length)]);
        return;
      }
      // 解析html
      console.log('爬取页面  √');
      await parseDivision(res.text);
    });
}
```

原文请查看http://andyliwr.github.io/2017/12/05/nodejs_spider_ip/
