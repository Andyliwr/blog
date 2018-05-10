---
title: 谈谈NODE_ENV
date: 2017-11-03 11:41:00
tags:
 - nodejs
---

#### 前言

在下载别人的源码的时候，一看 package.json 经常就能看到一串代码---NODE_ENV=development。这个东西到底是个啥？
![node_env](http://ouizhbgin.bkt.clouddn.com/blog/2017/11/03/node_env_package_json.png)
好，不懂没事，只要你能正常运行都能忍，结果自己到 cmd 里跑`npm run start`，竟然还报错了：

```
'NODE_ENV' 不是内部或外部命令，也不是可运行的程序
或批处理文件。

npm ERR! Windows_NT 6.1.7601
npm ERR! argv "D:\\nodejs\\node.exe" "D:\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" "start"
npm ERR! node v4.0.0-rc.5
npm ERR! npm  v2.14.2
```

于是经过一顿查找，我现在把我学到的一些东西记录下来。

#### NODE_ENV 是什么

NODE_ENV 其实就是一个环境变量，然后它的值等于`production`，意思就是启用生产环境。nodejs 程序在执行的时候可以通过`prosess.env`来获取已经设置的环境变量，下面请看截图：我创建了一个名为`app.js`的文件，让它输出`prosess.env`的值，然后分别放在 window 和 linux 下运行，结果如下：
**app.js:**

```
console.log(prosess.env)
```

**linux:**
![linux_prosess.env](http://ouizhbgin.bkt.clouddn.com/blog/2017/11/03/linux_prosess_env.png)
**windows:**
![windows_prosess.env](http://ouizhbgin.bkt.clouddn.com/blog/2017/11/03/windows_prosess_env.png)
这不就是熟悉的环境变量吗？这样来讲 windows 下使用`SET NODE_ENV=production`以及 linux 下使用`export NODE_ENV=production`都是在设置`NODE_ENV`这样一个环境变量的值为 production，接下来他们在代码里就可以根据`prosess.env.NODE_ENV`是否等于 production 来判断当前环境是否为生产环境，从而来选择执行生产环境的代码。

由于 window 和 linux 下设置环境变量采用的不同的语法，一个是 set，一个是 export，于是就有人写了一个包---[cross-env](https://www.npmjs.com/package/cross-env)，用来克服这种差异。使用方法如下：

* 安装 cross-env: `npm install cross-env --save-dev`
* 修改 package.json，在`NODE_ENV=xxxxxxx`前面添加`cross-env`就可以了。

#### **如何使用环境变量来记录密码这些敏感信息**

在一个项目中经常需要配置一些数据库密码，甚至使用`nodemail`的话需要配置邮箱密码，所以这种 config 文件一般都需要在`.gitignore`中忽略提交，但是如果`config`文件经常变动，不提交的话，代码又不好同步。于是我们就可以学习下`NODE_ENV`的做法，将密码等敏感信息写入环境变量，在`nodejs`程序中需要用到密码的时候，使用`prosess.env.xxx`去获取密码，请看下面实例：

1.  使用 vi 编辑用户根目录下的.bashrc 文件，export 一个自定义变量

```
export XXX=message
```

![.bashrc](http://ouizhbgin.bkt.clouddn.com/blog/2017/11/03/bashrc.png)

2.  使用`source ~/.bashrc`来使刚才的改动生效
3.  然后在 app.js 中输出 XXX，`console.log(prosess.env.XXX)`就能看到控制台输出了`message`字段
    ![message](http://ouizhbgin.bkt.clouddn.com/blog/2017/11/03/root_message.png)
