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
![element导航的bug](https://fs.andylistudio.com/blog/2018_01_04/bug.png/800x400)
大致原因是这样：
先看下`element`对于导航的每一项的点击的处理方式。
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
可以看到`element`对于`activeIndex`值能否被赋值当前路由路径（`this.$route.path`）仅仅只检测`this.router`是否存在，也就是说路由在开始跳转的一瞬间，`active`值就已经被赋值为当前的路由路径，至于之后跳转是否完成`element`不会再做处理。
如果一个组件内添加了`beforeRouteLeave`这样的组件内导航钩子，就有可能原先的路由跳转会被取消掉，页面停留在原页面，而这个时候`activeIndex`已经被修改，被点击的那个导航会加上`is-active`类，原先的那个页面的导航会去掉`is-active`类，这就出现上面那个`bug`。

#### 解决方法
出现问题基本都是无独有偶，这个是个歪果仁提的[element issue](https://github.com/ElemeFE/element/issues/8229)。然而很可惜，我找到这个`issue`并未提供任何的解决方案。只能靠自己了~

1. **最开想到的解决方案**
既然element错误的给导航添加了is-active类，那我能不能自己将它修正了，于是撸起袖子干。
因为会频繁的涉及到对元素类的操作，所以我先在自己的`util.js`里模拟Jquery的类操作写了三个方法---`addClass`、`removeClass`、`hasClasss`
  ```js
  /**
   * 使用原生js实现Jquery的类名操作函数
   * @param {Object} obj 页面元素对象
   * @param {String} cls 类名
   */
  export function addClass(obj, cls){
    let obj_class = obj.className //获取 class 内容.
    let blank = (obj_class != '') ? ' ' : '' //判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    let added = obj_class + blank + cls //组合原来的 class 和需要添加的 class.
    obj.className = added //替换原来的 class.
  }
     
  export function removeClass(obj, cls){
    let obj_class = ' '+obj.className+' ' //获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' ') //将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    let removed = obj_class.replace(' '+cls+' ', ' ') //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '') //去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed //替换原来的 class.
  }

  export function hasClass(obj, cls){
    let obj_class = obj.className //获取 class 内容.
    let obj_class_lst = obj_class.split(/\s+/) //通过split空字符将cls转换成数组.
    let x = 0
    for(x in obj_class_lst) {
      if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
        return true
      }
    }
    return false
  }
  ```
  ps: 网上抄的，稍微改了下，感觉还能用>^<，[原文链接](https://www.cnblogs.com/WhiteHorseIsNotHorse/p/6381520.html)
  好了，工具都准备好了，现在开始开车了~
  因为需要将特定的导航的类名修正，所以首先给每个导航加了个index属性，然后在遍历导航的时候，给每个导航加上一个data-index属性
  **router/index.js**
  ```js
  const routes = [
    {
      path: '/',
      component: app,
      redirect: '/spread',
      children: [
        {
          path: '/spread',
          component: spread,
          meta: {
            requireAuth: true // 需要登录的路由
          },
          index: 1
        },
        {
          path: '/overview',
          component: dataPreview,
          meta: {
            requireAuth: true
          },
          index: 2
        },
        .....
      ]
    },
    {
      path: '*',
      component: NotFoundView
    }
  ]
  ```
  **sideMemu.vue**
  ```xml
  <el-menu :default-index="onRoutes" :default-openeds="onRouteKeys" class="el-menu-style" router :collapse="sidebar.collapsed && !device.isMobile" @select="handleSelect">
    <template v-for="item in menuList">
      <sub-menu :param="item" :data-index="item.index"></sub-menu>
    </template>
  </el-menu>
  ```
  在`beforeRouteLeave`写了如下代码：
  ```js
  import { addClass, removeClass, hasClass } from '../common/util' 
  ....
  // 组件内导航钩子，处理未保存退出的情况
  beforeRouteLeave: function(to, from, next) {
    if (this.spreadData.length > 0 && JSON.stringify(this.spreadData) !== this.oldSpreadData && !this.hasSubmit) {
      next(false)
      this.$confirm('退出后将不保存修改的数据，确认退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 选择确定
        next()
      }).catch(() => {
        // 选择取消，使用原生js修改导航的active类
        let allSubItems = docuement.querySelectorAll('.sub-menu-item')
        for(let i=0; i<allSubItems.length; i++){
          removeCLass(allSubItems[i], 'is-active')
        }
        addClass(allSubItems[from.index], 'is-active')
      })
    } else {
      next()
    }
  }
  ```
  哎，写不下去了，直接说这种方法的带来的问题吧~，那就是会让原本很有序的导航active展示变得很混乱，临时改变导航的active类但是却并没有在正常之后改回来，于是就出现了多个导航在同一时间有active类

2. **正确的解决方法**
  其实思路换一下就好了，在当前路由下给对应的导航加上active类本身不是什么很难的事，既然用element会有bug，那不如不用它的，自己去实现这块的功能。
  首先删除原来写在`<el-menu></el-menu>`标签上的`:default-index="onRoutes"`属性，对于每个`<sub-menu></sub-menu>`动态去定义它的active类
  ```xml
  <el-menu :default-openeds="onRouteKeys" class="el-menu-style" router :collapse="sidebar.collapsed && !device.isMobile" @select="handleSelect">
    <template v-for="item in menuList">
      <sub-menu :param="item" :class="{'is-active2': onRoutes === item.href}"></sub-menu>
    </template>
  </el-menu>
  ```
  为了避免和element默认的`is-active`类出现样式冲突，这里将`is-active`类重命名为"is-active2"，然后自己写css去定义active导航的样式
  ```css
  .main-sidebar .el-menu-item.is-active2 {
    color: #fff !important;
  }
  .main-sidebar .el-menu-item.is-active2 .iconfont{
    color: #fff !important;
  }
  .main-sidebar .el-menu-item.is-active2 .icon-jiantou {
    visibility: visible;
  }
  ```
  这样因为每次都是去判断当前路由是否和item.href相同，也就是当路由没有正真跳转的时候`is-active2`的类所在的导航就会不会变，就是如此~
