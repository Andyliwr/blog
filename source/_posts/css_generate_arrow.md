---
title: CSS制作箭头
date: 2018-06-14 17:13:43
tags:
 - 同花顺
 - CSS
---

#### 前言
以前实现这样的箭头都是使用的图片，而且还得考虑高清屏幕下的二倍图的问题，使用图片担心http请求太多，使用雪碧图写起来有点蛋疼，使用字体图标又感觉杀鸡用宰牛刀。好吧~能用代码搞定的事还是用代码做吧..

#### 开始绘制
##### 三角箭头

**html**
```
<span class="triangle-arrow"></span>
```
**css**
```
.triangle-arrow {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-top: 30px solid #4189ff;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
}
```
效果如下：
![三角箭头](https://file.lantingshucheng.com/1528968041595.png)
你还可以通过调整`border-left`和`border-right`来改变三角形顶角的角度值。
![不同角度的三角箭头](https://file.lantingshucheng.com/1528968174691.png)
它的原理我是这么理解的，代码中没有定义`border-bottom`，意味着底部边框已经被细化成一个点了，而当我们定义顶部边框的高度和盒子高度一致的时候，顶部边框就填充了整个盒子，我们再使用左边框`border-left`和右边框`border-right`来覆盖顶部边框，因为设置的是透明，这样被遮挡后的顶部边框就变成了一个三角形
> 需要注意的是`border-left`和`border-right`的宽度需要设置成一致（否则不是等腰三角形），并且要大于等于顶部边框的一半（否则就变成了梯形）

懂了原理之后，我们就可以绘制任意方向的三角箭头，向左？向右？向上？我干了，你随意...

#### 斜线箭头
目前有两种方案，一种是基于`transform`的，一种是使用`dom`元素+`css`实现的
#### 基于transform的斜线箭头
这个比较好理解，我们只要设置盒子两个相邻的边框，然后将盒子旋转就好了
**html**
```
<span class="line-arrow"></span>
```
**css**
```
.line-arrow {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-top: 1px solid #4189ff;
  border-left: 1px solid #4189ff;
  transform: rotate(-45deg)
}
```
效果如下：
![斜线箭头](https://file.lantingshucheng.com/1528969782408.png)
如果需要将线条变粗，我们只需要修改边框宽度就行了。
当然这种方法也有缺陷，首先是tranform支持度的问题，一些低端机或者老的浏览器还是不太给面子。然后是如果你想调整两条线之间的夹角，好像有点难，我暂时还没想到办法>_<

#### 纯dom和css实现斜线箭头
先解释下原理，最开始我们介绍了如何绘制三角箭头，如果两个同方向的三角箭头叠加放在一起，使用上方的三箭头去覆盖下方三角箭头是不是就能绘制出来一个斜线箭头呢？
![斜线箭头](https://file.lantingshucheng.com/1528970382472.png)
**html**
```
<span class="arrow">
  <span class="out">
  </span>
  <span class="inner">
  </span>
</span>
```
**css**
```
.arrow {
  display: inline-block;
  width: 30px;
  height: 30px;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

.out {
  display: inline-block;
  width: 20px;
  height: 30px;
  border-left: 20px solid #4189ff;
  border-top: 15px dashed transparent;
  border-bottom: 15px dashed transparent;
  border-right: 20px;
  box-sizing: border-box;
}

.inner {
  position: absolute;
  top: 0;
  left: -3px;
  display: inline-block;
  width: 20px;
  height: 30px;
  border-left: 20px solid #ffffff;;
  border-top: 15px dashed transparent;
  border-bottom: 15px dashed transparent;
  border-right: 20px;
  box-sizing: border-box;
}
```
实现效果就像这样：
![斜线箭头](https://file.lantingshucheng.com/1528978826411.png)
