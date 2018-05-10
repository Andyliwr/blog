---
layout: post
title: 使用vue开发多页面的活动页面
date: 2018-02-12 11:02:44
tags:
 - 同花顺
 - vue
---

### 前言

最近连续加了一个星期的班，每天回去烧个热水，边泡脚边刷段子（此处有拖拉机般的笑声，哈哈），然后就上床睡觉了。至于加班的原由嘛，是在开发一个类似百万英雄的活动页面。就在昨天晚上任务上线部署了，于是我今天也就有时间总结总结。

### 如何使用 vue 开发多页面

vue 拥有基于 vue-router 的强大路由，基于 vuex 的页面状态管理，以及基于 webpack 的打包工具 vue-cli，在构建单页面应用上可谓 6 得飞起。无奈的是很多原生应用在加载 H5 页面的时候都是有导航条的，这样用户一点击导航条上的返回键，就直接退出了 H5 页面，并不能实现按下返回键返回到上一层路由。但是 webpack 既然能打包单页面，那就一定能打包多页面，只不过需要自己做些额外的配置。这里我直接推荐大神的 github 项目了，框架一定要选好，不然运行不起来或者打包之后出错就很尴尬了。

```
git clone https://github.com/zzuieliyaoli/vue-multi-pages-application-boilerplate.git
cd vue-multi-pages-application-boilerplate
cnpm install
# 测试是否能正常运行
npm run dev
# 测试打包之后的文件能否在app里运行
npm run build
# 将dist目录的下的文件上传到ftp，使用app打开H5页面
https://khtest.10jqka.com.cn/dev/lidikang/sg_cddh/index.html
```

**使用方法:**
多页面路由管理在`build/entries.js`中，每次新建一个页面就在`src/`下新建一个`xxx.html`和一个`xxx.entry.js`，并且在`src/pages`建好对应的`vue`文件`xxx.vue`和入口 js`index.js`，最后在这个`build/entries.js`里添加一行，键值名为页面名称，键值为对应的`xxx.entry.js`的路径。

### 如何使用 vue 写一个弹窗组件

活动页面的弹窗通常都是经过 UI 美化过的，所以需要自己去定义各种布局和样式。但是如果每个弹窗我们都去设置灰色背景，弹窗位置这样就显得太过麻烦，所以可以使用 vue 新建一个弹窗组件来专门管理弹窗这块的功能。需要解决的问题如下：

1.  每个弹窗文字、样式、按钮、按钮点击的回调、发送的埋点都不一样，如何统一管理
2.  每个弹窗内容不一样，所以高度也不一样，如果使用 css 的 transform 或者 flex 布局使得弹窗居中当然很简单，但是低端设备就不行了，有没有更好的垂直水平居中方案？

#### 弹窗状态管理

触发打开弹窗的操作一般在具体的活动页面（当然也可能有点击之后触发一个新的弹窗，这个稍后再议），我们只需要将弹窗的标题，需要展示的 html，以及按钮文字，按钮点击触发的回调函数，这些自定义项传给 Alert 组件就好了。比如：

```js
<alert :data="alert"></alert>
-------------------------------
this.alert = {
  show: true,
  className: 'general-text',
  text: '这是一段测试的段落',
  btnText: '确认',
  btnCallback: this.closeAlert
}
```

但是这样会带来新的问题，像稍微复杂一点的弹窗，比如需要展示手机号码输入框这些，它们本身就带有一些监听事件，直接定义在 html 字符串里，在渲染 Alert 组件的时候是无效的。因此对于复杂的弹窗，我们直接在 Alert 组件将它写好，并使用自定义的弹窗 ID 来控制它们的显隐。比如：

```html
<template>
  <div class="alert-container" v-show="data.show">
    <div class="content" ref="content">
      <div class="title">
        <span v-html="data.title"></span> <!--标题-->
        <i class="iconfont icon-close" @click="closeAlert"></i> <!--关闭按钮-->
      </div>
      <!-- 常规文字提示 -->
      <div class="general-text" v-if="data.className === 'general-text'">
        <p class="des" v-html="data.text"></p>
        <div class="alert-btn" v-if="data.btnText.length > 0">
          <button @click="data.btnCallback">{{data.btnText}}</button>
        </div>
      </div>
      <!-- 资格校验 -->
      <div class="zige" v-if="data.className === 'zige'">
        <div class="des-container"><p class="des">请填写开户时使用的手机号进行身份验证</p></div>
        <div class="form">
          <div class="form-group">
            <input v-model="telphone" type="tel" id="telphone" placeholder="请输入您的手机号" @input="telphoneInput($event)">
            <p class="err-tip">{{telPhoneError}}</p>
          </div>
        </div>
        <div :class="{'alert-btn': true, 'disabled': !isTelPhoneRight}"><button @click="doZigeCheck">确定</button></div>
      </div>
    </div>
  </div>
</template>
```

这样当你传过来的 data 的`className`属性是`"zige"`的时候就会去渲染验证领奖资格的弹窗，这个时候你就能在 Alert 组件里定义 input 的处理事件。

```
this.alert = {
  show: true,
  className: 'zige'
}
```

#### 关闭弹窗功能(closeAlert)实现

在弹窗的`container`上加上`v-show`的属性（这里为什么用 v-show 而不使用 v-if，稍后说），使用`data.show`的字段来控制弹窗的显隐，但是`data`是父级传给`Alert`的，在`Aler`t 组件中并不能直接修改`data`的值，所以需要和父级约定一个`closeAlert`的方法，在 Alert 组件中使用`this.$emit('close')`报告关闭弹窗的请求后，父级再接受到`close`的请求，并将传递给`Alert`的`data`值中的`show`改成`false`，这样就实现了弹窗的隐藏。

```
<alert :data="alert" @close="closeAlert"></alert>
```

#### 如何在点击弹窗中的按钮触发一个新的弹窗

实现原理其实和上面差不多，就是和父级约定一个`openNewAlert`的方法，在 Alert 组件中报告`openNewAlert`的事件，并把新的弹窗参数传递给父级。父级接收参数，并将传给 Alert 的参数改成新的参数。

```
<alert :data="alert" @close="openNewAlert"></alert>
------------------------------------------------
openNewAlert(){
  this.$emit('openNewAlert', {
    show: true,
    title: '新弹窗',
    className: 'general-text',
    text: '这是一段测试文字'
    ....
  })
}
```

#### 如何使得弹窗居中

在`css3`中使得一个不确定高度的盒子居中有很多方法，最常见的就是使用`transform`和`flex`布局，但是很遗憾，`transfrom`在`iphone5`和`android4.4`的测试机上行不通，`flex`布局哪怕兼容了-webkit-box 在`android4.1`上也没法使用。我们知道，如果我们清楚弹窗的高度，垂直居中就变得很简单，只需要将它的`margin-top`值设置为负的高度的一半就行。那能不能在弹窗弹出的瞬间动态计算它的高度，然后动态设置它的`margin-top`值呢？技术上是没问题的，vue 只要在需要获取的 dom 上加上`ref="xxx"`，在函数里就能通过`this.$refs.xxx.offsetHeight`来获取它的高度，但是这样有两个问题：

1.  计算弹窗高度的触发函数是什么？弹窗的 mounted 事件？或者 watch 事件？
2.  如果弹窗中包含 img 标签，vue 并不会等待图片加载好了才去触发计算弹窗高度的触发函数，这样就会导致计算出来的高度偏小，弹窗最后并未居中，如何修复？

因为只有当传过来的 alert.show 的值为 true 的时候，才会去动态计算 alert 的高度，所以放在 watch 方法里更合适，虽然 mounted 方法貌似也行，但是由于使用的 v-show 所以弹窗在渲染的时候 mounted 只执行一次。为了保证`this.$refs.content`不为空，这里最好放在`vm.$nextTick`的里执行。

```js
watch: {
  data(newValue, oldValue){
    // 只有在newValue为true的时候才去动态计算弹窗的动态高度
    if(newValue.show){
      this.$nextTick(function(){
        let self = this
        this.$refs.content.style.marginTop = (-this.$refs.content.offsetHeight/2) + 'px';
      });
    }
  }
},
```

第二个问题 vue 并不会等待图片加载好了才去触发计算弹窗高度的触发函数是因为我们使用的 v-if 来控制弹窗的显示隐藏，而 v-if 只有当条件为真的时候才开始渲染弹窗，这样就慢了。我们使用 v-show，这样即使条件为假，vue 也会去渲染弹窗，等你打开弹窗的时候既不会出现图片还在加载中的情况，高度自然也就不会计算错误。

### 验证码组件

活动页面有一个弹窗需要用户输入对方的邀请码，样子如下：
![邀请码](https://fs.andylistudio.com/blog/2018/02/12/invite_alert.PNG)

实现的原理如下，将 input 定义在 label 里，然后将 input 隐藏（这里 android 和 ios 的处理方法不一样），最后在 label 中添加 ul，每当输入一个字符串，就把 ul 中的一个 li 的值改成新输入的值。我这里没有实现方块里的光标提示的功能，这个要实现得话估计得自己模拟光标了。

```html
 <div class="invite" v-if="data.className === 'invite'">
  <div class="invite-text">填写好友的邀请码，你与TA都将获得1张复活卡</div>
  <div class="invite-code-wrap">
    <label for="code">
      <ul class="invite-code-container">
        <li class="field-wrap" v-for="(item, index) in inviteCodeNum" :key="index">
          <i class="char-field number-font">{{inviteCode[index] || ''}}</i>
        </li>
      </ul>
    </label>
    <input ref="input" class="input-code" @input="inviteCodeInput($event)" v-model="inviteCode" id="code" name="code" type="text" :maxlength="inviteCodeNum" autofocus="autofocus" autocorrect="off" autocomplete="off"
        autocapitalize="characters">
  </div>
  <div :class="{'alert-btn': true, 'disabled': !isInviteCodeRight}"><button @click="acceptInvite">确定</button></div>
</div>
```

android 和 ios 隐藏 input 应该使用不同的方法：

```css
.alert-container .invite .input-code.gphone {
  position: absolute;
  top: -9999px;
  left: -9999px;
}

.alert-container .invite .input-code.iphone {
  height: 0;
  opacity: 0;
}
```

最后附上项目地址：[millions-hero](http://gitlab.khweb.com/lidikang/millions-hero)
