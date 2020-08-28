---
title: 恢复chrome被篡改的主页
date: 2017-09-10 18:32:52
sidebar: auto
categories:
  - vue
tags:
  - axios
  - vue
publish: true
---


## 前言

这周都在开发同花顺广告平台，虽然自己从去年就开始使用 vue，但是很多和 vue 绑定使用的包都只会些基本语法。所以只能用一次记录一次，希望帮助自己回忆，也能给别人一点提示。

## zepto 如何实现并发请求

zepto 有一个 deffer 扩展，可以实现请求的并发，内部原理其实也是 promise，源码请参考[这里](https://github.com/madrobby/zepto/blob/master/src/deferred.js)

```js
// 获取topic_id为592917b59e32cc84569a7458的主题信息
function getTopicInfo1(deferred) {
  $.ajax({
    type: 'GET',
    url: 'https://cnodejs.org/api/v1/topic/592917b59e32cc84569a7458',
    success: res => {
      deferred.resolve(res);
    },
    error: err => {
      deferred.resolve(err);
    }
  });
}
// 获取topic_id为58eee565a92d341e48cfe7fc的主题信息
function getTopicInfo1() {
  $.ajax({
    type: 'GET',
    url: 'https://cnodejs.org/api/v1/topic/58eee565a92d341e48cfe7fc',
    success: res => {
      deferred.resolve(res);
    },
    error: err => {
      deferred.resolve(err);
    }
  });
}

$(document).ready(() => {
  let topic1Deffer = $.Deferred();
  let topic2Deffer = $.Deferred();

  $.when(topic1Deffer, topic2Deffer).done(function (topic1, topic2) {
    console.log(topic1);
    console.log(topic2);
  });
});
```

## axios 实现

```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()]).then(
  axios.spread(function (acct, perms) {
    // Both requests are now complete
  })
);
```
