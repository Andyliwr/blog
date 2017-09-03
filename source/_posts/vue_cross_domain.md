---
title: vue项目如何使用nginx配置跨域
date: 2017-06-27 15:04:00
tags:
 - vue
 - 同花顺
---

最近使用vue开发一个功能，npm run build之后打包的代码放在了a.com.cn下但是php接口部署在了b.com下，那么问题来了，如何让后端接口支持跨域。有两种方法：

1. 让后端在返回数据的时候设置下返回请求的header，这种方法比较不稳定，因为接口一旦多了就得改好多代码，而且每次出了问题还得去找后端开发改代码，很烦。

2. 另一种方法是，自己配置nginx，首先ssh登录到部署接口所在的服务器，修改nginx配置，在http对象中加入两行代码：

```nginx
http {
  // 需要加入的代码
  add_header Access-Control-Allow-Origin http://a.com.cn
  add_header Access-Control-Allow-Credentials true
  server {
    // b.com.cn的具体配置
  }
}
```
改完重启下nginx，然后在vue项目中，在导入axios的地方加如以下代码：
```javascript
import axios from 'axios'
axios.defaults.withCredentials = true
```
然后测试，发现就可以跨域了。