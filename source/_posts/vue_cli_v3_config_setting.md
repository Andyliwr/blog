---
layout: post
title: vue-cli-v3.0配置说明
comments: true
tags:
  - default
photos:
  - 'https://img.vim-cn.com/59/d7f8814d0f67906eee5ab7c3e0a2ee00bb2f26.jpg'
date: 2019-01-17 11:24:34
updated: 2019-01-17 11:24:34
---

### 前言

`vue` 前端时间更新创建 `vue` 项目的命令行工具，变得比以前更加简洁了，隐藏了之间 `build`、`config` 这些目录，自定义配置都放在一个 `vue.config.js` 的文件中。忙里偷闲，我也来学一波，下面是我的一些笔记。

### 配置说明

我直接把自己之前写的 `vue.config.js` 的文件贴出来了，大家直接看备注就行了

```javascript
let path = require('path')
let glob = require('glob')
// 配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
  let entries = {}
  let basename
  let tmp
  let pathname

  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    pathname = basename // 正确输出js和html的路径

    entries[pathname] = {
      entry: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[1] + '.js',
      template: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
      title: tmp[2],
      filename: tmp[2]
    }
  })
  return entries
}

let pages = getEntry('./src/pages/**?/*.html')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? 'http://172.20.216.109/admin/' : '/', // 部署应用包时的基本 URL
  outputDir: 'dist', // 执行npm run build时的本地打包地址
  assetsDir: '', // 放置生成的静态资源的地址，如果使用CDN的话就填写CDN地址
  indexPath: 'index.html', // 指定生成的index.html相对于outputDir的地址，默认是index.html
  filenameHashing: true, // 是否给生成的静态资源在它们的文件名中加上 hash，以便更好的控制缓存，如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  lintOnSave: process.env.NODE_ENV !== 'production', // 开发环境每次保存都执行eslint，在生产构建时禁用eslint
  productionSourceMap: false, // 禁用生产环境的source map
  pages,
  configureWebpack: function() {
    // 使用configureWebpack调整 webpack 配置，新加的配置会被webpack-merge 合并入最终的 webpack 配置
    if (process.env.QS === 'zhongtai') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  css: {
    modules: false, // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 true 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
    extract: true, // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)
    sourceMap: false, // 是否为 CSS 开启 source map
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
        localIdentName: '[name]-[hash]',
        camelCase: 'only'
      },
      sass: {
        // sass 公共模块
        // eslint-disable-next-line
        data: `
        @import "@styles/variables.scss"
        @import "@styles/variables.scss"
        `
      }
    }
  },
  devServer: {
    port: 8080,
    host: 'localhost', // 默认是localhost，如果你希望外部可以访问，可以设置成0.0.0.0
    index: 'page1.html',
    proxy: {
      // 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
      '/api': {
        target: 'http://localhost:3000', // 请求/api2/users时就会被代理到http://localhost:3000/users,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    },
    lazy: false, // 默认false， 为true时dev-server 只有在请求时才编译包(bundle)。这意味着 webpack 不会监视任何文件改动。我们称之为惰性模式。
    allowedHosts: [
      // 配置一个白名单列表，只有HTTP请求的HOST在列表里才正常返回
      '.10jqka.com.cn'
    ]
  },
  pluginOptions: {
    // 用来传递任何第三方插件选项
    foo: {
      // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
    }
  }
}
```

### 如何使用 eslint

在项目根目录下执行 `eslint init` 创建一个一个`.eslintrc.js`，具体配置如下：

```
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  // required to lint *.vue files
  plugins: ['vue'],
  extends: ['plugin:vue/essential', 'standard'],
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module'
  },
  // add your custom rules here
  globals: {
    audiojs: true
  },
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-const-assign': 'warn',
    'no-this-before-super': 'warn',
    'no-undef': 'warn',
    'no-unreachable': 'warn',
    'no-unused-vars': 'warn',
    'constructor-super': 'warn',
    'valid-typeof': 'error',
    semi: ['error', 'never'],
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    'brace-style': 'error',
    'block-scoped-var': 'error',
    camelcase: 'error',
    'key-spacing': [
      'error',
      {
        afterColon: true
      }
    ],
    'space-before-function-paren': ['error', 'never'],
    'eslint switch-colon-spacing': 'never',
    'eslint space-return-throw-case': 'never',
    'space-infix-ops': 'error',
    'wrap-iife': ['error', 'outside']
  }
}
```

你可以根据[eslint 官网](http://eslint.cn/docs/user-guide/configuring)给的文档调整这些规则.

### 如何打包多个页面

`vue-cli-v3.0` 新增了一个 `pages` 选项可以配置多个打包入口，代码的结构结构像这样：
![项目代码结构](https://fs.andylistudio.com/2019-01-17-12-26-44.png)
上面写的 `vue.config.js` 会自动读取 `src/pages` 下的项目文件生成 `pages` 参数

```
{
  entry: 'src/pages/page1/page1.js',
  template: 'src/pages/page1/page1.vue',
  title: 'page1',
  filename: 'page1.html'
}
```

打包之后的代码就像这样：
![打包之后的代码](https://fs.andylistudio.com/2019-01-17-12-32-53.png)

### 结束

如果你有更好的建议或者困惑的地方，都可以发送邮件到我的邮箱 - [andyliwr@outlook.com](andyliwr@outlook.com)
