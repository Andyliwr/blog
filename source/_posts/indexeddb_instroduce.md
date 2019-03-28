---
layout: post
title: IndexedDB尝鲜
comments: true
tags:
  - 工作
photos:
  - 'https://img.vim-cn.com/27/bc771fe03e705759c83ecabd4b34a74d0ce937.jpg'
date: 2019-03-28 09:41:14
updated: 2019-03-28 17:41:14
---

### 前言
在做公司的运营管理后台页面创建工具的时候需要实现用户操作的撤销和还原，因为存储页面结构的数据量很多，不能都存储在内存中，所以考虑使用`IndexedDB`。
开始的时候在`npm`里找`IndexedDB`有没有类似`mongoose`这样的简单易操作的库，结果翻了一圈愣是没有。好吧>_<，只能自己撸一个了（其实到了后来才理解为啥没有`indexedDB`的封装库，因为`IndexedDB`本来就是`w3c`创建的用来记录客户端复杂数据的工具，w3c已经封装得很好了，所以就没有必要再封装了）。
在网上搜索`IndexedDB`最先找到的就是`MDN`的教程，奈何是纯英文的，没办法了只能靠自己的蹩脚英文去理解了，通过一段一段复制到google翻译，我终于大致学会了`IndexedDB`的使用，下面记录下自己的代码。

### IndexedDB的使用
因为工作很忙就不一一做解释了，大家看看注释理解下就行。
不过我想讲下自己的`IndexedDB`的数据库设计，因为需要记录用户的操作历史，所以我将每次用户改动之后的页面数据存在`data`里，然后使用当前编辑页面的唯一id--`page_id`来标识`data`，配合上`create_time`，意思就是页面id为`page_id`的页面中用户在`create_time`时刻的页面数据为`data`

```javascript
/*
 * @Description: 存储用户改动历史的indexedDB操作类
 * @Author: lidikang
 * @LastEditors: lidikang
 * @Date: 2019-03-11 11:15:10
 * @LastEditTime: 2019-03-28 17:43:27
 */
import { message } from 'antd';

// 兼容性处理
const thsIndexedDB =
  window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction || { READ_WRITE: 'readwrite' }; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
  message.warning('当前浏览器不支持IndexedDB， 请换成其他现代浏览器');
}

export default class ThsIndexedDB {
  constructor() {
    this.db = null;
    this.request = thsIndexedDB.open('thsPageCreator', 1); // 数据库名以及数据库版本，版本仅支持整数
    this.request.onerror = error => {
      message.error('连接IndexedDB失败');
      console.warn(error);
    };
    /**
     * 连接成功，
     * 连接时异步的，所以请不要在new ThsIndexedDB()之后立马调用createData这些方法，因为此时的this.db还是null
     */
    this.request.onsuccess = event => {
      // Do something with request.result!
      this.db = event.target.result;
      this.db.onerror = error => {
        message.error('连接IndexedDB失败');
        console.warn(error);
      };
    };
    /**
     * onupgradeneeded更新数据库版本或者第一次创建数据库的时候被调用
     * 在这里创建和删除对象库，以及构建和删除索引
     */
    this.request.onupgradeneeded = event => {
      const db = event.target.result;
      // 创建history表，并且使用自增键值，用来存储用户的操作记录
      const objectStore = db.createObjectStore('history', { autoIncrement: true });

      objectStore.createIndex('page_id', 'page_id', { unique: false }); // 标识文章id
      objectStore.createIndex('data', 'data', { unique: false }); // 标识design数据结构快照
      objectStore.createIndex('create_time', 'create_time', { unique: false }); // 标识快照的创建时间
    };
  }

  /**
   * 创建
   * @param {Object} data 
   * @param {Function} callback 
   */
  createData(data, callback) {
    // 创建一个transaction(交易)，并指定其权限
    const transaction = this.db.transaction('history', 'readwrite');
    const historyObjectStore = transaction.objectStore('history')
    historyObjectStore.add({
      page_id: data.page_id,
      data: data.data,
      create_time: Date.now(),
    })
    transaction.oncomplete = () => {
      if (typeof callback === 'function') callback()
    }
    transaction.onerror = err => {
      message.error('IndexedDB添加数据失败');
      console.warn(err);
    }
  }

  /**
   * 删除
   * @param {String} pageId 
   * @param {Function} callback 
   */
  deleteData(pageId, callback){
    const transaction = this.db.transaction('history', 'readwrite');
    const historyObjectStore = transaction.objectStore('history')
    const pageIdIndex = historyObjectStore.index('page_id')
    // 利用page_id索引来打开一个图标
    const cursor = pageIdIndex.openKeyCursor(IDBKeyRange.only(pageId));
    cursor.onsuccess = e => {
      const thisHistory = e.target.result;
      if(thisHistory) {
        thisHistory.delete()
        thisHistory.continue();
      } else if (typeof callback === 'function') {
        transaction.abort()
        callback()
      }
    }
  }

  /**
   * 查询
   * @param {String} pageId 
   * @param {Number} time 
   * @param {Function} callback 
   */
  findData(pageId, time, callback) {
    const transaction = this.db.transaction('history', 'readwrite');
    const historyObjectStore = transaction.objectStore('history')
    const createTimeIndex = historyObjectStore.index('create_time')
    // 利用create_time索引来打开一个游标，查找所有小于这个时间点的数据
    const cursor = createTimeIndex.openCursor(IDBKeyRange.upperBound(time, true), 'prev');
    cursor.onsuccess = e => {
      const thisHistory = e.target.result;
      if(thisHistory) {
        if (thisHistory.value.page_id === pageId) {
          if (typeof callback === 'function') {
            transaction.abort()
            callback(thisHistory.value)
          }
        } else {
          thisHistory.continue();
        }
      } else if (typeof callback === 'function') {
        transaction.abort()
        callback()
      }
    }
  }
}
```

### 结束
参考资料
1. [MDN关于IndexedDB的介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)
2. [IndexedDB简单教程](https://www.twle.cn/t/153#reply0)