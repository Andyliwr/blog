---
title: 怎么让Html的高度自适应屏幕高度
date: 2017-04-05 15:36:18
tags:
  - 同花顺
---

在写 css 静态页面的时候让 Html 的高度自适应屏幕高度是一个常见的需求，比如你有一个需要置底的 bottom 按钮，需要在内容不足一屏的时候显示在屏幕的底部，在内容超过一屏的时候显示在所有内容的底部。

### **效果图：**

<img src="http://img.blog.csdn.net/20170405152117164" alt="不足一屏时自动移到最下面" style="width: 80%" />

### **CSS 的做法**

```html
html {
  height: 100%;
  display: table;
}

body {
  display: table-cell;
  height: 100%;
}
```

又学了一种新方法，使用 flex 布局：

```html
<div class="container">
  <header></header>
  <content></content>
  <footer></footer>
</div>
```

```css
.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

header {
  background: #cecece;
  min-height: 100px;
}

content {
  background: #bbbbbb;
  flex: 1; /* 1 代表盡可能最大，會自動填滿除了 header footer 以外的空間 */
}

footer {
  background: #333333;
  min-height: 100px;
}
```

### **JS 的做法**

css 的做法有时候会在定位的时候造成一些麻烦，可以尝试使用 js 去动态改变 html 的高度

### 基于 zepto

```javascript
$(document).ready(function() {
  var windowHeight = $(window).height();
  if ($(this).height() < windowHeight) {
    $(this).height(windowHeight);
  }
});
```

### 原生 js

```javascript
window.onload = function() {
  var winHeight = 0;
  if (window.innerHeight) {
    winHeight = window.innerHeight;
  } else if (document.body && document.body.clientHeight) {
    winHeight = document.body.clientHeight;
  }
  var html = document.getElementsByTagName('html')[0];
  if (document.body.offsetHeight < windowHeight) {
    html.style.height = windowHeight;
  }
};
```
