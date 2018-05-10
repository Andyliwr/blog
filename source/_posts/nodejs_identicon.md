---
title: 如何使用nodejs生成哈希头像---identicons
date: 2017-11-08 15:26:51
tags:
  - nodejs
---

#### 前言

自己写的图片上传工具个人中心页要展示一个用户头像，但是自己又不想去写自定义头像上传的代码。所以前期先使用默认头像吧，可是要是每个人都使用一样的头像又觉得很怪异。你是否记得你在注册完 github 的时候会给你分配一个默认头像，有点像二维码。后来去 Google 下这种头像叫做哈希头像，是根据一个 hash 值来随机生成的。下面介绍如何使用 nodejs 生成 hash 头像
![哈希头像](http://fs.andylistudio.com/1510298709122.png)

#### 安装依赖

```
npm install identicon.js --save
npm install crypto --save
```

identicon 就是用来生成 hash 头像的 npm 包，它能根据一个 hash 值，生成随机头像对象的 base64 码。那么怎么生成 hash 值呢？就得用到 crypto，根据每个用户的用户名生成一个 hash 值。

#### 代码

```js
import crypto from 'crypto';
import Identicon from 'identicon.js';

let hash = crypto.createHash('md5');
hash.update('andyliwr'); // 传入用户名
let imgData = new Identicon(hash.digest('hex')).toString();
let imgUrl = 'data:image/png;base64,' + imgData; // 这就是头像的base64码
```

#### 参考资料

[identicon.js](https://github.com/stewartlord/identicon.js)
[crypto 的使用](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501504929883d11d84a1541c6907eefd792c0da51000)

#### 打个广告

欢迎各位使用我的[图片上传工具](http://upload.andylistudio.com)，只要拖一拖，图片上传加压缩，链接永不丢失。
