---
title: CSS制作书签
date: 2018-11-13 10:07:43
tags:
 - 同花顺
 - CSS
---

#### 前言

之前讲过使用过[CSS 实现箭头](https://andyliwr.github.io/2018/06/14/css_generate_arrow/)，今天来讲使用 `CSS` 实现两种常用的书签，记录下实现过程。

#### 书签 1

先贴下效果图：
![书签1](https://fs.andylistudio.com/1542074776058.png)

实现原理和之前实现箭头一样，都是使用的 `border` 来做出尖角，只不过这次某个边框不是整个不见了，而只是凹陷了一点点。

**Html**

```html
<div class="rule"><div>规则</div></div>
```

**Css**

```scss
.rule {
  position: absolute;
  top: 0;
  right: 0.4rem;
  height: 1.1rem;
  border: 0.27rem solid #efd892;
  border-bottom-width: 0.22rem;
  border-bottom-color: transparent;
  box-sizing: border-box;
  div {
    display: inline-block;
    position: absolute;
    top: -0.36rem;
    left: -0.27rem;
    width: 0.54rem;
    height: 1.1rem;
    line-height: 0.56rem;
    writing-mode: vertical-lr;
    text-align: center;
    color: #21232e;
    font-size: 12px;
  }
}
```

#### 书签 2

实现效果：
![书签2](https://fs.andylistudio.com/1542075577294.png)

这个和上个其实没啥区别，只不过文字部分被写到了 `after` 伪元素的 `content` 属性中了，此外新加了一个 `before` 伪元素来实现书签的折角。

**Html**

```html
<div classs="bookmark"></div>
```

**Css**

```scss
.bookmark {
  position: absolute;
  left: -0.2rem;
  bottom: 1.05rem;
  // 书签文字
  &::before {
    content: '东方证券投资顾问';
    position: absolute;
    z-index: 1;
    width: 2.6rem;
    height: 0;
    line-height: 0;
    color: #21232e;
    background: #efd892;
    border: 0.26rem solid #efd892;
    border-right-color: #303340;
    border-right-width: 0.22rem;
    padding-right: 0.1rem;
    text-align: left;
    text-decoration: none;
    font-size: 12px;
  }
  // 夹角
  &::after {
    content: '';
    position: absolute;
    top: -0.145rem;
    left: 0;
    border: 0.1rem solid #c59d48;
    border-left-color: transparent;
    border-top-width: 0.07rem;
    border-bottom-width: 0.07rem;
    border-top-color: transparent;
  }
}
```

### 结束

`CSS` 博大精深，其实很多的小图标都可以使用代码去实现，没必要都做成图片。
