---
title: JS数组删除某个元素
date: 2017-04-06 11:22:39
tags:
---

JS 数组删除某个元素的方法实现的代码：

### 使用数组迭代

```javascript
function removeElement(arr, ele) {
  var result = [];
  if (arr instanceof Array) {
    if (ele instanceof Array) {
      result = arr.filter(function(item) {
        var isInEle = ele.some(function(eleItem) {
          return item === eleItem;
        });
        return !isInEle;
      });
    } else {
      result = arr.filter(function(item) {
        return item !== ele;
      });
    }
  } else {
    console.log('parameter error of function removeElement');
  }
  return result;
}
```

### 功能测试

![chrome console测试](http://img.blog.csdn.net/20170406112032782)

### 使用常规的数组方法 splice

首先可以给 js 的数组对象定义一个函数，用于查找指定的元素在数组中的位置，即索引，代码为：

```javascript
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
```

然后使用通过得到这个元素的索引，使用 js 数组自己固有的函数去删除这个元素：

```javascript
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
```
