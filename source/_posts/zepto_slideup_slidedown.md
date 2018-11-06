---
layout: post
title: Zepto支持slideUp和slideDown效果函数
date: 2018-11-06 10:11:23
tags:
  - 同花顺
---

### 前言

`JQuery` 内置一系列[效果函数](http://www.w3school.com.cn/jquery/jquery_ref_effects.asp)，可以让使用者在不必写 `css` 动画的情况下实现一些简单的动画，然而 `zepto` 并没有继承这些效果函数，比如 `slideUp` 和 `slideDown`

### 让 Zepto 支持 `slideUp` 和 `slideDown`

直接上代码了>^<

```js
(function($) {
  $.fn.slideDown = function(duration, callback) {
    let position = this.css('position');
    this.show();
    this.css({
      position: 'absolute',
      visibility: 'hidden'
    });
    let height = this.height();
    this.css({
      position: position,
      visibility: 'visible',
      overflow: 'hidden',
      height: 0
    });
    this.animate({ height: height }, duration, function() {
      that.removeAttr('style');
      if (typeof callback === 'function') callback();
    });
  };

  $.fn.slideUp = function(duration, callback) {
    var that = this;
    var height = this.height();
    this.css({
      overflow: 'hidden',
      height: height
    });
    this.animate({ height: 0 }, duration, 'linear', function() {
      that.removeAttr('style');
      if (typeof callback === 'function') callback();
    });
  };
})(Zepto);
```
