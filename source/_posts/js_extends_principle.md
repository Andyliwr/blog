---
layout: post
title: 构造函数，原型对象，以及实例之间的关系是怎么样的
comments: true
tags:
  - 每天搞懂一个知识点
photos:
  - 'https://img.vim-cn.com/27/bc771fe03e705759c83ecabd4b34a74d0ce937.jpg'
date: 2019-03-12 09:41:14
updated: 2019-03-12 09:41:14
---

### 理解原型对象、构造函数、实例之间的关系
```
function Person () {
  // some codes
}

Person.prototype.name = 'lidikang'
Person.prototype.age = '24'
Person.prototype.job = 'FrontEnd Developer'
Person.prototype.sayName = function () {
  alert(this.name)
}

var person1 = new Person()
person1.sayName() // 'lidikang'

var person2 = new Person()
person2.sayName() // 'lidikang'
alert(person1.sayName === person2.sayName) // 'true'
```

无论什么时候只要创建了一个函数，JavaScript就会根据一组特定规则为函数创建一个prototype属性，这个属性指向函数的原型对象。在默认的情况下，所有的原型对象都会自动获得一个constructor(构造函数)属性，这个属性包含一个指向prototype属性所在函数的指针。当调用构造函数创建一个实例的时候，实例内部会包含一个指针指向构造函数的原型（es5管这个指针叫[[Prototype]]，没有标准的方式去访问它, 而FireFox，Safari，Chrome中实现了一个__proto__属性来表示这个指针）

以上面的代码为例子，原型对象、构造函数、实例之间的关系如下：

![原型对象、构造函数、实例之间的关系](https://img.vim-cn.com/b1/d89d1e84a91f26a9f1564919655af36a7a4324.png)
