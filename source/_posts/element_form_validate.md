---
title: element form表单组件重复错误提示不显示
date: 2017-12-25 11:24:29
tags:
 - 同花顺
 - vue
 - element
---

### 前言

在我司已经经历了好几个后台项目了，登录页面一直有个小问题，如果登录出错了并且第一次提示了错误，然后再点击同一个按钮，错误提示就消失，而不是重复显示同一个错误。

后来去翻了下`element`的源码，发现`el-form-item`的`error`属性监听的是`watch`方法，也就是两次重复的错误操作，提示的错误信息一致，就不会触发 watch 方法。而我的逻辑是这样的，每次点击登录或者发送验证码，都会去重新验证表单，验证通过了才会去发登录或者验证码请求。但是`Element`表单组件规定一旦表单验证通过就会清除原来的错误提示信息，这样就导致了第二次点击登录或者发送验证码，原来的错误信息被清除了，而两次错误信息又一致没法触发`watch`方法，所以也不会重新渲染出新的错误信息出来。

感觉说得很啰嗦，不过造成的原因应该还是表达清楚了。

### 解决的方法

1.  避免`form validate`和 error 一起使用，要么自己写 if 判断做表单为空和输入不合法的字段，使用 error 提示错误信息。要么就不要使用了 form validate 就不要使用 error

2.  使用`vue $nextTick`来修复这个问题
    `vm.$nextTick`可以将回调延迟到下次 `DOM`更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。我们知道错误提示不显示的根本原因是`watch`方法没有被触发。那如果我每次给错误赋值一个随机值，然后使用`vue $nextTick`在`dom`被更新之后将随机值改成我们需要的错误提示不就可以了。

```js
let self = this;
self.$refs['loginForm'].validate((valid, fields) => {
  if (valid) {
    axios.post('/api/login', { email: 'xxx', code: 'xxx' }).then(res => {
      if (res.data.code === 0) {
        // 正确的处理逻辑
      } else {
        // 提示错误
        self.errors.code = Math.random();
        self.$nextTick(() => {
          this.errTips.code = '登录失败，' + (res.data.msg ? '，' + res.data.msg : '');
        });
      }
    });
  } else {
    return false;
  }
});
```
