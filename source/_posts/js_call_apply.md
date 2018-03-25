---
layout: post
title: 理解js中的call、apply以及bind
date: 2018-01-12 16:30:54
tags:
 - javascript
---

## 前言
今天在逛segmentfault的时候，看到人家源码里面各种使用call, apply。都搞得我看不懂了，于是下定决心搞懂它们的用法。

## 为什么要使用call和apply
观摩大神解释， [知乎文章](https://www.zhihu.com/question/20289071):
在javascript面向对象编程中中，我们经常会这样定义:
```js
function cat(){
}
cat.prototype={
  food:"fish",
  say: function(){
    alert("I love "+this.food)
  }
}
var blackCat = new cat
blackCat.say()
```
但是如果我们有一个对象`whiteDog = {food:"bone"}`,我们不想对它重新定义`say`方法，那么我们可以通过call或apply用`blackCat`的`say`方法：`blackCat.say.call(whiteDog);`

所以，可以看出call和apply是为了动态改变this而出现的，当一个object没有某个方法，但是其他的有，我们可以借助call或apply用其它对象的方法来操作。用的比较多的，通过`document.getElementsByTagName`选择的dom 节点是一种类似`array`的`array`。它不能应用`Array`下的push,pop等方法。我们可以通过：`var domNodes =  Array.prototype.slice.call(document.getElementsByTagName("*"));`这样domNodes就可以应用`Array`下的所有方法了。

call 和 apply 都是为了改变某个函数运行时的 context 即上下文而存在的，换句话说，就是为了改变函数体内部 this 的指向。因为 JavaScript 的函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念。

二者的作用完全一样，只是接受参数的方式不太一样。例如，有一个函数 func1 定义如下：
```js
var func1 = function(arg1, arg2) {};
```

就可以通过`func1.call(this, arg1, arg2);`或者`func1.apply(this, [arg1, arg2]);`来调用。其中`this`是你想指定的上下文，他可以任何一个javascript对象(javascript中一切皆对象)，call需要把参数按顺序传递进去，而apply则是把参数放在数组里。

javascript中，某个函数的参数数量是不固定的，因此要说适用条件的话，当你的参数是明确知道数量时，用call，而不确定的时候，用apply，然后把参数push进数组传递进去。当参数数量不确定时，函数内部也可以通过`arguments`这个数组来便利所有的参数。

## 为什么我一直对call和apply感到这么陌生
因为在平时的工作中我遇到的几乎都是流程式的代码，很少涉及到对象编程。比如一段代码重复使用，我们就可以定义一个全局函数来复用代码。这样一直在使用全局(windows)来调用这个函数，根本就不会用到call或者apply去改变上下文。再比如我们在一个对象中定义对象的方法，基本上也不会涉及到其他对象需要调用这个对象的方法的场景。至于用call和apply实现继承就更别谈了。

看看以前的sb做法：
![](https://fs.andylistudio.com/blog/2018_01_12/mockapi.png)
## call和apply的用例
1. **实现继承**
  ```
  var Parent = function(){
      this.name = "yjc"
      this.age = 22
  }
  var child = {}
  console.log(child);//Object {} ,空对象
  Parent.call(child) // Parent也是一个方法，意思就是让child拥有Parant方法的上下文，拥有Parent的属性，因为Parent不需要参数，所以call除了传一个child也没传别的
  console.log(child) //Object {name: "yjc", age: 22}
  ```
2. **柯里化和反柯里化**

  **柯里化**
  在计算机科学中，柯里化（英语：`Currying`），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。 – 维基百科
  ```js
  var curry = function(fn) {
    var _args = []

    return function _f() {
      if (arguments.length) {
        // 合并参数好像只能通过这种方式实现，如果直接是_args.push(arguments)的到的是“0[object Arguments][object Arguments]”
        // 这里猜测Array.prototype.push.apply能够过滤掉参数自带的默认属性
        Array.prototype.push.apply(_args, arguments)
        return _f
      }

      return fn.apply(this, _args)
    }
  }

  // 累加方法
  var add = curry(function() {
    return Array.prototype.reduce.call(arguments, function(acc, cur) {
      return acc + cur
    }, 0)
  })

  add(1)(2)(3)() // 6
  add(4)() // 10
  ```
  感觉柯里化的原理就那样，就是在你传一个或者多个参数的时候，将参数合并到闭包变量_args，直到参数为空，才将累计的参数传给最终的执行函数

  **反柯里化**
  ```js
  Function.prototype.uncurry = function() {
  var _this = this;

    return function() {
      return Function.prototype.call.apply(_this, arguments);
    }
  }

  var obj = {};
  var arr = [];
  var push = Array.prototype.push.uncurry();

  push(obj, 'hello', 'world'); // obj {0: "hello", 1: "world", length: 2}
  push(arr, 'hello', 'world'); // arr ["hello", "world"]
  ```
  反curring就是把原来已经固定的参数或者this上下文等当作参数延迟到未来传递。

## bind
```js
obj.bind(thisObj, arg1, arg2, ...);
```
把obj绑定到thisObj，这时候thisObj具备了obj的属性和方法。与call和apply不同的是，bind绑定后不会立即执行。

同样是add()和sub()：
```js
add.bind(sub, 5, 3); //不再返回8
add.bind(sub, 5, 3)(); //8
```
如果bind的第一个参数是null或者undefined，等于将this绑定到全局对象。
