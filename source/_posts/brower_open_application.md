---
layout: post
title: 手机浏览器如何打开APP
date: 2018-10-30 10:48:23
tags:
  - 同花顺
---

### 前言

手机浏览器打开 `App` 是个很常见的需求，比如在一些推广活动中将用户从 `H5` 页面导向到 `App` 里。个人觉得难点如下：

1. 如何判断用户处在手机浏览器中
   当然如果页面是 `H5` 的推广页就不存在这个问题了，我说的放在 App 里的产品页。
2. 如何调起 `App`
   基本都是使用 `schema` 协议，这个后续会讲到。
3. 如何判断是否安装了 `App`
   这个就比较棘手了，理论上来讲 `H5` 是没法判断的，只能通过一些类似 Hack 的技巧去弥补。

### 解决问题

1. **判断用户是否处在手机浏览器中**
   `Zepto` 有一个附加模块-- `detect.js`（源码请参考[官方 github](https://github.com/madrobby/zepto/blob/master/src/detect.js#files)），这个 JS 代码也很简单，就是使用正则表达式对 UA 头进行匹配。
   借鉴此模块的代码我们可以总结出一套判断是否处于手机浏览器的方法，需要满足的条件如下：

   1. UA 头能匹配到 `Andriod`、`iPhone`、`iPad`、或者很少见的 `SymbianOS` 以及 `Windows Phone`
   2. 当前不是在 `App` 的 `webview` 中打开

   因此判断是否在手机浏览器中的代码可以这么写：

```js
/**
 * 判断是否在手机浏览器中
 * @returns {Boolean} true表示当前在手机浏览器中，false表示当前不在手机浏览器中
 */
function judgeIsInH5Broswer() {
  let ua = navigator.userAgent
  let isWindowsPhone = /(?:Windows Phone)/.test(ua)
  let isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  let isAndroid = /(?:Android)/.test(ua)
  let isFireFox = /(?:Firefox)/.test(ua)
  let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  let isPhone = /(?:iPhone)/.test(ua) && !isTablet
  let isInHexin = getAppVersion()
  return (isSymbian || isAndroid || isPhone) && !isInHexin
}
```

**PS**: 在同花顺 App 中可以通过 `getAppVersion` 来获取 App 版本，如果当前不在 App 中 getAppVersion 返回 `false`

2. **浏览器唤起 App**
   浏览器唤起 App 是通过 App 配置的 Schema 协议，它的格式如下：
   `[scheme]://[host]/[path]?[query]`
   参数说明如下：

1. **scheme**: 判别启动的 App
1. **host**: 选填值，可以为空，例如：localhost:8080
1. **path**: 选填值
1. **query**: 选填值，参数

例如打开微信可以使用 `weixin://`。
经过和我司客户端开发的反复沟通，我最终拿到了打开 App 并跳转指定 H5 页面的协议，代码如下：

```js
let element = $('<a></a>')
element.attr('href', 'amihexin://command=gotopage&pageid=2804&url=' + encodeURIComponent(url) + '&title=同花顺保险')
element.trigger('click')
```

3. **如何判断是否安装了 App**
   JS 是无法判断手机是否安装了某款 App 的，只能判断如果长时间没有打开 App，就跳转到 App 下载页。
   这里介绍一个页面可见性 API--`document.hidden`

   > `document.hidden` 可以用来检测页面对于用户的可见性，即返回用户当前浏览的页面或标签 `tap` 的状态变化。 在最小化浏览器、切换 `tap` 页面时生效.(如需对 `app` 中几个 `webview` 进行切换操作时，可使用 `pageVisibility` 接口进行相应的事件监听和处理
   > `document.hidden` 该值表示 page 是否是可见的,值为 boolean 值
   > `document.visibilityState`可能有三个值，`visible`（表示该 page 是处于最前面的页面并且不是处于一个最小化的窗口），`hidden`（表示该 page 不是处于最前面的页面或者是处于一个最小化的窗口），`prerender`（表示该页面内容正在重新渲染并且该页面对于用户是不可见的）

   这里我们就能使用这个 document.hidden 属性来判断点击打开 App 之后是否成功打开 App，如果在短时间内 document.hidden 的值从 true 变成了 false 证明成功打开了 App，如果超过一定时间 document.hidden 还是没有变成 false 则认为用户没有安装 App，于是就跳转 App 下载页面。具体代码如下：

   ```js
    // 超时没有打开同花顺则认为当前用户没有安装同花顺App
    let hidden = 'hidden';
    if (typeof document.hidden !== "undefined") {  
      hidden = "hidden";  
    } else if (typeof document.mozHidden !== "undefined") {  
      hidden = "mozHidden";  
    } else if (typeof document.msHidden !== "undefined") {  
      hidden = "msHidden";  
    } else if (typeof document.webkitHidden !== "undefined") {  
      hidden = "webkitHidden";  
    }  
    setTimeout(function() {
      if (!window.document[hidden]) {
        setTimeout(function() {
          if (+new Date() - clickedAt < 2000) {
            if (getPlatform() === 'gphone') {
              window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.hexin.plat.android'
            } else {
              window.location.href = 'https://itunes.apple.com/cn/app/tong-hua-shun-chao-gu-gu-piao/id303191318?mt=8'
            }
          }
        }, 500)
      }
    }, 500)
   ```
