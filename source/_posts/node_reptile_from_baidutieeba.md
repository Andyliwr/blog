---
title: nodejs实现的爬虫，从百度贴吧爬取小说
date: 2017-01-17 20:59:19
tags:
 - nodejs
 - 爬虫
---

### 程序应该被用来改变生活

每天都得来回坐地铁上下班，无聊的时候喜欢看些小说，还只看至尊系的。以前老用微信读书，现在读书送的书券都花完了，作为一名程序猿怎么可能去花钱买书券读书。所以我想了写个爬虫爬小说的想法。

### 原理图

![nodejs爬虫原理图](https://file.lantingshucheng.com/myblog/wlpc.png/default)

**github 项目地址**: [networkReptile](https://github.com/AndyliStudio/myApp/tree/master/nodeServer/server/networkReptile)

### 程序依赖

```
superagent  --发送http请求
cheerio  --分析请求得到的html
node-schedule --定时运行爬虫
mongoose  --将爬到的最终数据存入mongo
```

### 程序目录

```
networkReptile----connectDB //数据库代码
    |---node_modules
    |---tools //工具类
    |---config.js //配置文件
    |---networkReptile.js //主程序
    |---package.json //依赖包
    |---result.txt //存储爬到的html
    |---README.md //使用说明
```

看程序之前，请务必看下 cnodejs 社区的 nodejs 入门的[lession5](https://github.com/nqdeng/7-days-nodejs)、[lession6](https://github.com/nqdeng/7-days-nodejs)，详情请见注释，请看代码注释。
