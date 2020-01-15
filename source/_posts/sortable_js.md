---
layout: post
title: 拖拽排序-sortable.js
comments: true
tags:
  - default
photos:
  - 'https://img.vim-cn.com/59/d7f8814d0f67906eee5ab7c3e0a2ee00bb2f26.jpg'
date: 2018-12-08 14:56:30
updated: 2018-12-08 14:56:30
---

### 前言

拖拽排序是一个很常用的功能，今天就介绍前端和后端分别如何实现。

### 前端如何实现拖拽排序

这里直接使用第三方库---[sortable.js](https://github.com/SortableJS/Sortable)，关于它的用法大家可以去参考官方文档

首先我们创建一个表格，这里因为是读取的数据，所以我们使用 JavaScript 动态创建。

```html index.html
<script type="text/javascript" src="//unpkg.com/vue/dist/vue.js"></script>
<script type="text/javascript" src="//unpkg.com/element-ui@2.3.9/lib/index.js"></script>
<div id="app">
  <el-table class="table" :data="datas" :loading="loading" border width="500px">
    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
    <el-table-column prop="name" label="名称" align="center"></el-table-column>
    <el-table-column prop="des" label="描述" align="center"></el-table-column>
  </el-table>
</div>
```

```scss style.css
@import url('//unpkg.com/element-ui@2.3.9/lib/theme-chalk/index.css');
#app {
  height: 300px;
  overflow: hidden;
}
.table {
  width: 500px;
}
```

```js app.js
new Vue({
  el: '#app',
  data: {
    loading: false,
    datas: [
      {
        name: '栏目1',
        des: '这是一个测试栏目'
      },
      {
        name: '栏目2',
        des: '这是一个测试栏目'
      }
    ]
  }
});
```

这样我们就建立了一个很简单的表格，它看上去就是这样：
![简单的表格](https://file.lantingshucheng.com/2018-12-08-15-35-35.png)

接下来我们使用 sortable.js 让表格变得可拖动，在 vue 的 mounted 方法中初始化需要拖拽的表格（ps: 如果是在 `vue` 的 `created` 方法初始化，此时的 dom 没有挂载，会出现 document.querySelector 获取到的 dom 为 null 的情况），

```js app.js
new Vue({
  // 省略...
  mounted() {
    let self = this;
    // 使得表格可以拖拽排序
    let table = document.querySelector('.el-table__body tbody');
    Sortable.create(table, {
      forceFallback: false,
      onEnd({ item, to, from, newIndex, oldIndex }) {
        // 相同位置的交换不发送交换请求
        if (newIndex == oldIndex) {
          return;
        } else {
          console.log(newIndex, oldIndex);
          // 使用ajax将newIndex和oldIndex发送给后端
        }
      }
    });
  }
});
```

这样表格就变得可以拖动了。值得注意的是如果我们对拖拽元素施加某些限制条件，超过这个条件想取消拖拽操作可以在 `onMove` 的回调里处理，只要 `onMove` 返回 `false`，本次拖拽操作就会被取消掉，元素也会被放置到拖拽前的位置。

```js app.js
Sortable.create(table, {
  forceFallback: false,
  onMove: (evt, originalEvent) => {
    // 出现非上线和已上线，立即还原交换
    let draggedIndex = evt.dragged.rowIndex - 1 >= 0 ? evt.dragged.rowIndex - 1 : 0;
    let relatedIndex = evt.related.rowIndex - 1 >= 0 ? evt.related.rowIndex - 1 : 0;
    if ((self.products[draggedIndex].is_show == true && self.products[relatedIndex].is_show == false) || (self.products[draggedIndex].is_show == false && self.products[relatedIndex].is_show == true) || (self.products[draggedIndex].is_show == false && self.products[relatedIndex].is_show == false)) {
      return false;
    }
  },
  onEnd({ item, to, from, newIndex, oldIndex }) {
    // something
  }
});
```

### 后端如何实现排序接口

假设我们设计表格设计如下，在每行数据中都有一个 priority 属性记录着当前行的排序位置，类似 1,2,3,4....：

```
const ThemeSchema = new mongoose.Schema(
  {
    priority: Number, // 显示优先级
    name: { type: String, unique: true }, // 栏目名称
    create_time: Date
  },
  { versionKey: false }
)
```

后端的排序接口的目的其实也就是在接受到前端的排序请求之后修改每行数据的 `priority` 值，假设我们接受的前端参数分别是 `from_index` 和 `to_index`，分别代码的意思是本次拖动排序过程用户将原来排在 from_index 的元素移动到了 to_index 的前面

![拖动排序示意图1](https://file.lantingshucheng.com/2018-12-08-16-19-38.png)

所以我们只需要将原来排在 3 位置的元素的 priority 值改成 4，将原来排在 4 位置的元素的 priority 值改成 3，这样就完成了本次排序。
当然这样只是跨越一个元素排序，如果 `from_index = n`，`to_index = m`，这样就能出现很多种情况：

1. `n 等于 m`，这说明本次是一次无效的拖动排序，直接忽略掉就好了
2. `n 小于 m`，这说明用户将元素后移了，这样我们需要排序第 n 位的元素的 priority 改成第 m 位元素的前一位(即 m-1 位)的 priority 值，然后将处在 n 到 m 位(区间是 `(n, m)`,两端的值都不能取 )的元素的 priority 值均减 1 就好了
3. `n 大于 m`，这说明用户将元素前移了，这样我们需要排序第 n 位的元素的 priority 改成第 m 位元素的 priority 值，然后将处在 m 到 n 位(区间是 `[m, n)`, 右端的值不能取 )的元素的 priority 值均加 1 就好了
   
![拖动排序示意图2](https://file.lantingshucheng.com/2018-12-08-16-37-55.png)

具体代码实现如下：
```js
if (!from_index || !to_index) {
 console.log('invild parameters')
 return false
}
if (from_index === to_index) {
 console.log('invild operation')
 return false
}
let thisTheme = await Theme.findOne({ priority: from_index }, 'id priority')
if (from_index > to_index) {
  let needChangeTheme = await Theme.find({ priority: { $lt: from_index, $gte: to_index } }, 'id priority')
  if (thisTheme && needChangeTheme.length > 0) {
    await Theme.update({ _id: thisTheme._id }, { $set: { priority: to_index } })
    for (let i = 0; i < needChangeTheme.length; i++) {
      await Theme.update({ _id: needChangeTheme[i]._id }, { $set: { priority: needChangeTheme[i].priority + 1 } })
    }
    console.log('exchange success!')
  } else {
    console.log('invild parameters')
  }
} else {
  let needChangeTheme = await Theme.find({ priority: { $gt: from_index, $lte: to_index } }, 'id priority')
  if (thisTheme && needChangeTheme.length > 0) {
    await Theme.update({ _id: thisTheme._id }, { $set: { priority: to_index } })
    for (let i = 0; i < needChangeTheme.length; i++) {
      await Theme.update({ _id: needChangeTheme[i]._id }, { $set: { priority: needChangeTheme[i].priority - 1 } })
    }
    console.log('exchange success!')
  } else {
    console.log('invild parameters')
  }
}
```

### 结束

如果你有更好的建议或者困惑的地方，都可以发送邮件到我的邮箱 - [andyliwr@outlook.com](andyliwr@outlook.com)
