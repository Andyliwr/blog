---
title: 网页端弹窗创建的正确方式
date: 2017-08-21 17:24:43
tags: 同花顺
---

#### 前言

开发中我们经常会碰到这种需求---自定义弹窗，那么如何创建一个正确的弹窗呢？
<img class="top-img" src="https://file.lantingshucheng.com/blog/images/modal.png/default" alt="弹出框" style="width: 70%;margin: 20px auto;" />

#### 考虑的方面

#### 1. 定位

弹窗一般都需要垂直水平居中，也许通过 flex 或者 transform 能够很快的实现垂直水平居中，但是 ie 下就炸了，下面我介绍一种垂直水平居中的技巧---使用三层 dom 来实现垂直水平居中

##### html

```html
<div class="center-outside">
  <div class="center-middle">
    <div class="center-inner">xxx</div>
  </div>
</div>
```

##### css

```css
.center-outside {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 999;
  width: 100%;
}

.center-middle {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1000;
}

.center-inner {
  position: absolute;
  top: -50%;
  left: -50%;
  height: 100%;
  width: 100%;
}
```

戳这里查看[demo](http://sandbox.runjs.cn/show/wxjuiwvq)

##### 动态生成 dom

本例子使用 jquery，需要注意以下几点

1.  框弹出的时候需要禁止页面滑动
2.  大于一屏的页面最右边会有一个滚动条，页面渲染的时候会忽略滚动条的宽度(15px)，但 position:fixed; height: 100%; width: 100%的布局不会忽略这个宽度，导致打开弹窗的一瞬间页面会像右移动 15px。解决方案是在弹窗打开时设置 body 的 padding-right 为 15px; [demo 地址](http://sandbox.runjs.cn/show/9fiq311v)
3.  弹窗弹出后点击关闭按钮或者背景框可以关闭弹窗，并且页面恢复可滚动状态

具体的代码请查看[demo](http://runjs.cn/code/9fiq311v)
