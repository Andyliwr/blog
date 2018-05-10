---
title: 怎么检测页面那些元素超出设备宽度
date: 2017-09-03 20:52:06
tags:
 - tips
---

写页面的时候如果页面元素的宽度超出设备宽度就会出现横向滚动条，这对移动端的页面影响还是很大的，那么怎么去检测到底是那些元素的宽度超出了设备的宽度了呢？

先看看是哪些原因导致这种现象：

* 宽度使用了 width:100%，但是又有 padding 或者 border，由于浏览器默认的盒模型是 content-box，也就是说 width:100%是内容的 100%，这样再加上 padding 和 border 才是元素实际的宽度，这样就超出了设备的宽度

![](https://fs.andylistudio.com/myblog/post6_01.png/default)

* 浮动布局，子元素的总宽度大于或等于 100%，css 盒模型中规定子元素的总宽度应该小于 100%，因为总会有一些 margin，padding 和 border 需要占据一定的空间，使用浮动布局的时候应该将这些都考虑进来。比如 3 列的浮动布局，三个子元素的宽度不应该是 33.3%，这样就会出现标题说的那种情况。

![](https://fs.andylistudio.com/myblog/post6_02.png/default)

![](https://fs.andylistudio.com/myblog/post6_03.png/default)

再来看看怎么用 js 去检测这种现象到底是那些元素导致的，这个方法不一定灵验，只是提供一种参考，直接在页面的 console 里输入以下代码：

```javascript
$('*').each(function(index, item) {
  //也检测下隐藏的元素
  $(item).show();
  if ($(item).width() > $(window).width()) {
    console.log(item);
  }
});
```

最后再教一种终极方法，就是打开 chrome 调试器，一个一个元素的删除看看还出不出先横向滚动条，如果删除不出现了那肯定是这个元素或者它的子元素搞的鬼，就继续删除子元素，直到找到最后的那个元素。
