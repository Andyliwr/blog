---
layout: post
title: 如何使用vue-cli创建自己的vue组件库
comments: true
tags:
  - 有赞
photos:
  - 'https://img.vim-cn.com/59/d7f8814d0f67906eee5ab7c3e0a2ee00bb2f26.jpg'
date: 2019-07-22 17:40:47
updated: 2019-07-22 17:40:47
---

### 前言
最近想想自己仿写`vant`，搞清楚每个组件的实现方法，所以就想自己建立一个vue的组件库，并将其放到npm上。下面就讲解如何使用vue-cli创建自己的组件库并打包发布到npm上

### 安装vue-cli并初始化一个vue项目
```bash
npm install -g @vue/cli
# or
yarn global add @vue/cli
vue create vant-copy
cd vant-copy && npm run serve
```

### 改造目录
1. 将`src`目录重命名为`examples`目录用来放置测试组件的代码
2. 新建一个`packages`目录用来放置组件代码
3. 新建vue.config.js来重写vue开发环境的配置
```js
// vue配置文件
module.exports = {
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口
      entry: 'examples/main.js',
      // 模板来源
      template: 'public/index.html',
      // 输出文件名
      filename: 'index.html'
    }
  }
}
```

![2019-07-23-18-46-07](https://file.lantingshucheng.com/2019-07-23-18-46-07.png?imageView2/1/w/200/h/200)

### 编写一个Button组件

新建组件的vue文件`./packages/button/button.vue`
```js
<template>
  <button class="vant-btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button'
}
</script>
```

安装`sass`，新建组件的样式文件`./packages/button/button.scss`
```bash
cnpm install -D sass-loader node-sass
```
```scss
.vant-btn {
  border: none;
  padding: 5px 15px;
  background: #41b883;
  color: #ffffff;
}
```
新建组件的总入口文件`./packages/index.js`
```js
import Vue from 'vue';
import Button from './button/button'
import './index.scss'

const Components = {
  Button
}

Object.keys(Components).forEach(key => {
  Vue.component(Components[key].name, Components[key])
})

export default Components
```
新建所有组件的scss文件`./src/components/index.scss`并导入刚才新建的按钮样式文件
```scss
@import './button/button.scss';
```
在`App.vue`中导入创建的组件库并预览新建组件的效果

`./examples/main.js`
```js
import Vue from 'vue'
import App from './App.vue'
import vant from '../packages'

Vue.config.productionTip = false
Vue.use(vant)

new Vue({
  render: h => h(App),
}).$mount('#app')

```
`./src/App.vue`
```js
<template>
  <div id="app">
    <Button>asda</Button>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
效果应该就像下面这：

![2019-07-22-17-58-06](https://file.lantingshucheng.com/2019-07-22-17-58-06.png)

### 使用`vue-cli-service`打包组件
vue-cli提供vue-cli-service的命令行工具可以对vue组件进行打包，使用方式如下：
```
用法：vue-cli-service build [options] [entry|pattern]

选项：

  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```
我们可以在`package.json`新增一个`script`，并修改`main`属性，将其指向到打包后生成的：`vant.common.js`
```json
"main": "./lib/vant.common.js",
"license": "MIT",
"scripts": {
  ...
  "build-component": "vue-cli-service build --target lib --name vant --dest lib ./packages/index.js"
},

```
最后运行的npm run build-component，生成的文件就像这样：
![2019-07-23-11-25-49](https://file.lantingshucheng.com/2019-07-23-11-25-49.png)

### 上传到npm
1. 修改`package.json`的name属性来定义npm包的名称，这里叫做`@andyliwr/vant-copy`
2. 然后定义`file`属性来选择上传哪些文件到npm上，需要注意的是npm有自己的忽略和必须上传文件的要求，所以有些文件可以不用写，npm也会自动上传，具体可以看[这里](https://docs.npmjs.com/files/package.json#files)
```json
"files": [
  "lib"
]
```
3. 执行上传
```bash
# npm登录
npm login
# 确认账号
npm whoami
# 发布
npm publish
```
最后打开[npm官网](https://www.npmjs.com/)，就可以看到上传的npm包了

![2019-07-23-11-31-46](https://file.lantingshucheng.com/2019-07-23-11-31-46.png)


### 结束
到这里一个简单的组件库就做好了，后续会再加入自动化测试，和使用travis自动化发布npm，如果你有更好的建议或者困惑的地方，都可以发送邮件到我的邮箱 - [andyliwr@outlook.com](andyliwr@outlook.com)
