---
title: element导航组件在遇到导航内钩子时的bug
date: 2017-12-25 11:24:29
tags:
 - 同花顺
 - vue
 - element
---

#### 前言

今天测试报告了广告竞价后台的一个`bug`:
![element导航的bug](https://file.lantingshucheng.com/blog/2018_01_04/bug.png/default)
大致原因是这样：先看下`element`对于导航的每一项的点击的处理方式。

```js
handleItemClick(item) {
  let { index, indexPath } = item;
  if (!this.router) {
    this.activeIndex = item.index;
  }
  this.$emit('select', index, indexPath, item);
  if (this.mode === 'horizontal' || this.collapse) {
    this.openedMenus = [];
  }
  // 只是检测当前router是否存在
  if (this.router) {
    this.activeIndex = this.$route.path;
    this.routeToItem(item);
  }
}
```

可以看到`element`对于`activeIndex`值能否被赋值当前路由路径（`this.$route.path`）仅仅只检测`this.router`是否存在，也就是说路由在开始跳转的一瞬间，`active`值就已经被赋值为当前的路由路径，至于之后跳转是否完成`element`不会再做处理。如果一个组件内添加了`beforeRouteLeave`这样的组件内导航钩子，就有可能原先的路由跳转会被取消掉，页面停留在原页面，而这个时候`activeIndex`已经被修改，被点击的那个导航会加上`is-active`类，原先的那个页面的导航会去掉`is-active`类，这就出现上面那个`bug`。

#### 解决方法

出现问题基本都是无独有偶，这个是个歪果仁提的[element issue](https://github.com/ElemeFE/element/issues/8229)。然而很可惜，我找到这个`issue`并未提供任何的解决方案。只能靠自己了~

其实思路换一下就好了，在当前路由下给对应的导航加上 active 类本身不是什么很难的事，既然用 element 会有 bug，那不如不用它的，自己去实现这块的功能。首先删除原来写在`<el-menu></el-menu>`标签上的`:default-index="onRoutes"`属性，对于每个`<sub-menu></sub-menu>`动态去定义它的 active 类

```xml
<el-menu :default-openeds="onRouteKeys" class="el-menu-style" router :collapse="sidebar.collapsed && !device.isMobile" @select="handleSelect">
  <template v-for="item in menuList">
    <sub-menu :param="item" :class="{'is-active2': onRoutes === item.href}"></sub-menu>
  </template>
</el-menu>
```

为了避免和 element 默认的`is-active`类出现样式冲突，这里将`is-active`类重命名为"is-active2"，然后自己写 css 去定义 active 导航的样式

```css
.main-sidebar .el-menu-item.is-active2 {
  color: #fff !important;
}
.main-sidebar .el-menu-item.is-active2 .iconfont {
  color: #fff !important;
}
.main-sidebar .el-menu-item.is-active2 .icon-jiantou {
  visibility: visible;
}
```

这样因为每次都是去判断当前路由是否和 item.href 相同，也就是当路由没有正真跳转的时候`is-active2`的类所在的导航就会不会变，就是如此~
