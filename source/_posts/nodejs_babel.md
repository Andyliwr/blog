---
title: 如何使用babel编译nodejs程序
date: 2017-12-05 15:04:31
tags: 
  - nodejs
---

#### 前言
es都出了7了，是时候抛弃那些老的写法，试试那些es的新属性，新语法。为了保证代码的兼容性，可以在写代码的时候使用es新语法，然后使用babel编译成兼容性代码。那么到底该怎么做呢？

#### 开始
安装`babel-cli`
```
# 初始化项目
npm init
# 安装babel
cnpm install babel-cli --save-dev
```
设定转码规则
```
cnpm install --save-dev babel-preset-es2015 babel-preset-stage-2
```
常见的规则如下：
```
# ES2015转码规则
$ npm install --save-dev babel-preset-es2015

# react转码规则
$ npm install --save-dev babel-preset-react

# ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
$ npm install --save-dev babel-preset-stage-0
$ npm install --save-dev babel-preset-stage-1
$ npm install --save-dev babel-preset-stage-2
$ npm install --save-dev babel-preset-stage-3
```
新建`app.js`，并输入一下内容
```
import http from 'http';

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```
在`package.json`里添加如下命令：
```
"scripts": {
  "start": "babel-node index.js --presets es2015,stage-2"
}
```
这样就可以通过运行`npm run start`来启动`app.js`了

#### 使用`nodemon`监听文件变化
将`nodemon`和`npm run start`结合起来使用，这样一旦文件发生变化，babel就能自动编译改动的文件
```
cnpm install --save-dev nodemon
```
修改`start`命令为：
```
"scripts": {
  "start": "nodemon index.js --exec babel-node --presets es2015,stage-2"
}
```
重新使用`npm run start`启动`app.js`，然后修改`app.js`，在按下`ctrl+s`的时候后babel就会自动编译`app.js`

#### 编译生产环境代码
代码上生产环境的时候，我们需要将编译好的文件放在一个单独的目录下。
新建目录，并将`app.js`移至该目录下：
```
mkdir src
mv app.js src/
```
对`package.json`做如下修改：
```
"scripts": {
  "start": "nodemon src/index.js --exec babel-node --presets es2015,stage-2",
  "build": "babel lib -d dist --presets es2015,stage-2",
  "serve": "node dist/index.js"
}
```
这样当你运行`npm run build`的时候，`babel`就会自动将改动文件编译并放至`dist`目录下，上生产的时候只需要复制`dist`目录下的代码就行了

对于git项目，可能你不需要每次都提交`dist`目录下的改动，你可以在`.gitignore`文件下忽略`dist`目录的改动

#### 将`babel`的配置写入到`.babelrc`文件中
```
touch .babelrc
```
写入以下内容:
```
{
  "presets": ["es2015", "stage-2"],
  "plugins": []
}
```
这样你就可以去掉package.json中的`--presets es2015,stage-2`参数了
```
"scripts": {
  "start": "nodemon src/index.js --exec babel-node",
  "build": "babel lib -d dist",
  "serve": "node dist/index.js"
}
```

文章翻译自babel官方提供的demo，源码下载请点击[这里](https://github.com/babel/example-node-server)