---
layout: post
title: Vue监听对象的变化(深度监听)
date: 2018-08-06 11:23:23
tags:
 - vue
 - 同花顺
---

### 前言

今天写 CRM 的时候发现直接使用 watch 监听对象的变化时，改变对象的某个属性，watch 方法并没有被触发。于是就打算着手研究下了。

### Vue watch 实现的原理

Vue 实现数据绑定的原理其实就是使用了 es5 新增的一个方法`Object.defineProperty`，通过这个方法，可以自定义 getter 和 setter，而在获取对象属性和设置对象属性的时候能够执行自定义的回调函数。

然而对象往往是一个深层次的结构，对象的某个属性可能仍然是一个对象。Vue 默认的 watch 方法并不会处理这种情况。而是通过定义 watch 对象的 deep 属性为 true 来实现深度监听。

具体的原理如下：

在给一个对象定义 defineProperty 的时候，如果当前对象的属性也是一个对象就对当前对象的属性再次定义 defineProperty，这样一直递归，直到所有属性均不是对象为止。

```js
// 观察者构造函数
function Observer(data) {
  this.data = data;
  this.walk(data);
}

let p = Observer.prototype;

// 此函数用于深层次遍历对象的各个属性
// 采用的是递归的思路
// 因为我们要为对象的每一个属性绑定getter和setter
p.walk = function(obj) {
  let val;
  for (let key in obj) {
    // 这里为什么要用hasOwnProperty进行过滤呢？
    // 因为for...in 循环会把对象原型链上的所有可枚举属性都循环出来
    // 而我们想要的仅仅是这个对象本身拥有的属性，所以要这么做。
    if (obj.hasOwnProperty(key)) {
      val = obj[key];

      // 这里进行判断，如果还没有遍历到最底层，继续new Observer
      if (typeof val === "object") {
        new Observer(val);
      }

      this.convert(key, val);
    }
  }
};

p.convert = function(key, val) {
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log("你访问了" + key);
      return val;
    },
    set: function(newVal) {
      console.log("你设置了" + key);
      console.log("新的" + key + " = " + newVal);
      if (newVal === val) return;
      val = newVal;
    }
  });
};

let data = {
  user: {
    name: "liangshaofeng",
    age: "24"
  },
  address: {
    city: "beijing"
  }
};

let app = new Observer(data);
```

### 实现深度监听的具体做法

上面讲的其实就是实现深度监听的原理，接下来我们来看看实现深度监听的具体方法。这里我提供三种方法，它们各自有各自的应用场景。

1.  **方法一: 监听单个对象单个属性的变化**
    这种方法适合只需要监听对象某一个属性的情况，使用起来也很简单那，将 watch 属性的名称定义为`对象名.属性名`的形式就好了

```js
data: {
   a: {
     b: 'Hello',
     c: 'world'
   }
 },
 watch: {
   a: function(newValue, oldValue) {
     console.log(oldValue, newValue)
   },
   'a.c': function(newValue, oldValue) {
     console.log('你修改了a对象(a.c)', newValue, oldValue)
   }
 },
```

2.  **方法二: 使用 computed 来辅助实现**
    此方法能实现对象多个属性的监听，而且不局限于单个对象，可定制化更高，缺点就是有点 low

```js
data: {
  a: {
    b: 'Hello',
    c: 'world'
  }
},
computed: {
  changeA() {
    return {
      b: this.a.b,
      c: this.a.c
    }
  }
},
watch: {
  a: function(newValue, oldValue) {
    console.log(oldValue, newValue)
  },
  changeA: function(newValue, oldValue) {
    console.log('你修改了a对象(computed)', newValue, oldValue)
  }
},
```

3.  **方法三: vue 官方提供的方法**

    说到底这才是正宗的方法，学习一下

```js
data: {
  a: {
    b: 'Hello',
    c: 'world'
  }
},
watch: {
  a: {
    handler: function(newValue, oldValue) {
      console.log('你修改了a对象(watch deep)', newValue, oldValue)
    },
    deep: true
  }
},
```
### 结束
多总结，多总结
