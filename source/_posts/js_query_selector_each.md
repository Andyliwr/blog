---
title: 如何循环遍历document.querySelectorAll()方法返回的结果
date: 2017-12-14 15:04:31
tags: 
  - js
---

### 前言

使用 JavaScript 的 forEach 方法，我们可以轻松的循环一个数组，但如果你认为 document.querySelectorAll()方法返回的应该是个数组，而使用 forEach 循环它

```js
// 错误代码
document.querySelectorAll('.module').forEach(function() {});
```

执行上面的代码，你将会得到执行错误的异常信息。这是因为，`document.querySelectorAll()`返回的不是一个数组，而是一个[`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)。

### 遍历

对于一个`NodeList`，我们可以用下面的技巧来循环遍历它：

```js
var divs = document.querySelectorAll('div');

[].forEach.call(divs, function(div) {
  // do whatever
  div.style.color = 'red';
});
```

当然，我们也可以用最传统的方法遍历它：

```js
var divs = document.querySelectorAll('div'),
  i;

for (i = 0; i < divs.length; ++i) {
  divs[i].style.color = 'green';
}
```

还有一种更好的方法，就是自己写一个：

```js
// forEach method, could be shipped as part of an Object Literal/Module
var forEach = function(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

// 用法:
// optionally change the scope as final parameter too, like ECMA5
var myNodeList = document.querySelectorAll('li');
forEach(myNodeList, function(index, value) {
  console.log(index, value); // passes index + value back!
});
```

文章摘抄自http://www.webhek.com/post/foreach-queryselectorall-nodelist.html
