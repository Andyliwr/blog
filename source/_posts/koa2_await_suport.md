---
title: 如何让koa2项目支持ES7的import和aysnc，await语法
date: 2017-10-30 07:52:00
tags:
 - koa
 - nodejs
---

### 前言

自己使用`koa-generator`生成一个`koa`项目后，却发现`js`的语法都是很老的`nodejs`，还在用 var 来定义变量，导入包也是用的`require`。作为一名`nodejs`忠实粉丝，怎么也得高大上一点嘛！下面就介绍怎么让`koa2`项目支持 ES7 的`import`和`aysnc`，`await`语法。

### 安装 runkoa

这个是`runkoa`的[官方介绍](https://www.npmjs.com/package/runkoa)，作者确实是个好人，替`koa`的开发者省去了配置`babel`的步骤。使用方法如下：在控制台输入：

```
cnpm install -g runkoa
```

在`bin/`目录下面新建一个名为`run`的文件，并复制一下代码：

```
#!/usr/bin/env node

var current_path = process.cwd();
require('runkoa')(current_path + '/bin/www')
```

修改`package.json`的`scripts`命令，将`www`修改成为`run`：

```
"scripts": {
    "start": "node bin/run",
    "dev": "./node_modules/.bin/nodemon bin/run",
    "prd": "pm2 start bin/run",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

如此，再输入`npm run dev`, 就可以将`require`变成`import`，并且支持`async`和`await`。

### 遇到的坑

在使用`mongoose`的时候，我将操作数据库的代码都放在了`schema`的`statics`属性中。写代码的时候请注意`async`和`await`是要一起出现的，也就是使用了`await`的方法必须前面有`async`的关键字。这个我查了好久，家里的网差，很心累。后来使用`koa`新建了一个测试项目，将两个项目对比，才发现在定义`statics`的方法的时候没有使用 async 关键字，但是在调用的时候却使用了`await`，于是控制台一直报`await is a reserved word`

```
# 定义
userSchema.statics.checkname = async function(ctx, name) {
    let document = await this.findOne({ username: name })
    if (document) {
        return { ok: false, msg: '用户名已经存在' }
    } else {
        return { ok: true, msg: '用户名合法' }
    }
}

# 调用
ctx.body = await User.checkname(ctx, name)
```

好了，填坑完毕，大家如果有啥疑问，欢迎写信到我的邮箱(andyliwr@outlook)。
