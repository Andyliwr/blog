---
title: display:box和flex的区别
date: 2017-06-01 22:51:00
tags:
  - 同花顺
---

没区别，仅是各阶段草案命名。

flex 是最新的，但是在实际的浏览器测试中，display: flex 不能完全替代 display: -webkit-box

display: box 使用可以参考http://www.html5rocks.com/en/tutorials/flexbox/quick/
display: flex 使用可以参考https://css-tricks.com/snippets/css/a-guide-to-flexbox/
兼容性的问题可以参考https://css-tricks.com/old-flexbox-and-new-flexbox/
Android UC 浏览器只支持 display: box 语法。而 iOS UC 浏览器则支持两种方式需要注意的是如果要使用 line-clamp 时需要用 display:box;

### 下面介绍下两者的语法：

* flex 的语法可以查考[这篇博客](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)
* box 的语法如下，[博客地址](http://www.cnblogs.com/frankwong/p/4603141.html)：

Flexbox 为 display 属性赋予了一个新的值（即 box 值）, flexbox 的属性有很多，记录一些比较常用的属性：

### **用于父元素的样式：**

**display: box**; 该属性会将此元素及其直系子代加入弹性框模型中。（Flexbox 模型只适用于直系子代）

**box-orient**: horizontal | vertical | inherit; 该属性定义父元素的子元素是如何排列的。

**box-pack**: start | end | center | justify; 设置沿 box-orient 轴的父元素中子元素的排列方式。因此，如果 box-orient 是水平方向，则父元素的子元素是水平的排列方式，反之亦然。（表示父容器里面子容器的水平对齐方式--垂直排列时--定宽）

**box-align**: start | end | center | baseline | stretch; 基本上而言是 box-pack 的同级属性。设置框的子代在框中的排列方式。如果方向是水平的，该属性就会决定垂直排列，反之亦然。（表示父容器里面子容器的垂直对齐方式--水平排列时--定高）

### **用于子元素的样式：**

**box－flex**: 0 | 任意数字; 该属性让子容器针对父容器的宽度按一定规则进行划分。
