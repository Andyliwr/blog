---
layout: post
title: 数组的不为人知的函数
date: 2018-01-09 14:24:23
tags:
  - javascript
toc: true  # 使用目录
---
### reduce
我也是第一次听说数组还有一个reduce方法，要不是看别人的代码用到了这个，估计自己还不不会去查这样一个方法。
`reduce()` 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。最常见的代码：
```js
var total = [0, 1, 2, 3].reduce(function(sum, value) {
  return sum + value;
}, 0);
```
最后输出`total`为6

##### **入参**
+ **callback**
+ **initialValue**
```
array.reduce(callback, initialValue)
```
reduce的回调函数接受四个参数
+ **`accumulator`**
累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue（如下所示）。
+ **`currentValue`**
数组中正在处理的元素。
+ **`currentIndex`**
数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则为索引为1。
+ **`array`**
调用reduce的数组

*PS*：`initialValue`[可选] 用作第一个调用 `callback`的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错

##### **描述**
回调函数第一次执行时，`accumulator` 和`currentValue`的取值有两种情况：调用`reduce`时提供`initialValue`，`accumulator`取值为`initialValue`，`currentValue`取数组中的第一个值；没有提供 `initialValue`，`accumulato`r取数组中的第一个值，`currentValue`取数组中的第二个值。
注意：如果没有提供`initialValue`，`reduce` 会从索引1的地方开始执行 `callback` 方法，跳过第一个索引。如果提供`initialValue`，从索引0开始。
如果数组为空且没有提供`initialValue`，会抛出`TypeError` 。如果数组仅有一个元素（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且`callback`不会被执行。

##### **运行过程**
运行下面的代码：
```js
[0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array){
  return accumulator + currentValue;
});
```
`callback` 被调用四次，每次调用的参数和返回值如下表:

| callback | accumulator | currentValue | currentIndex | array | return value |
| :------- | :---------- |- | :----------- | :----------- | :-----| :- ----------|
| first call | 0 | 1 | 1 | [0, 1, 2, 3, 4] | 1 |
| second call | 1 | 2 | 2 | [0, 1, 2, 3, 4] | 3 |
| first call | 3 | 3 | 3 | [0, 1, 2, 3, 4] | 6 |
| first call | 6 | 4 | 4 | [0, 1, 2, 3, 4] | 10 |

##### **常见用法**
1. **数组累加**
见**运行过程**中的代码
2. **二维数组降维**
```js
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(a, b) {
    return a.concat(b);
  },
  []
);
// flattened is [0, 1, 2, 3, 4, 5]
```
3. **计算数组中每个元素出现的次数**
```js
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

##### **兼容**
| Feature | Chrome  | Edge | Firefox | Internet | Explorer | Opera | Safari |
| :------ | :------ | :--- | :------ | :------- | :------- | :---- | :----- |
| Basic   | support | Yes  | Yes     | 3        | 9        | 10.5  | 4      |

