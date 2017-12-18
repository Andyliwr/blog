---
title: vue如何提示保存后退出
date: 2017-12-08 17:45:31
tags: 
  - vue
  - 同花顺
---

假设有这样一个需求，用户在一个页面内编辑文字，但是并未点击保存并且跳转到了下一个路由。比较好的做法应该是给出一个提示---“您编辑的内容还未保存，是否确认退出？”用户如果点击“确定”，那么不保存当前内容直接退出，用户如果点击“取消”，则取消本次路由跳转，继续留在原来的页面。

#### 尝试的错误做法

一开始的时候我是想着使用vuex结合vue router的beforeEach导航守卫来实现。代码如下:

+ 首先在vuex中新增一个状态值---introduceState
```js
const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常
  state: {
    ....
    introduceState: false,
    ....
  },
  getters: {
    introduceState: state => state.currentMenus
  },
  mutations: {
    // 更新introduceState的值
    changeIntroduceState (state, value) {
      state.introduceState = value
    }
  }
})
```

+ 用户在点击跳转到另一个页面的时候会触发生命周期函数beforeDestroy，在这个函数中我们可以检测用户的编辑内容是否保存，如果尚未保存。
如果内容尚未保存，我们就弹出一个提示框，当用户选择取消的时候，就将vuex中的introduceState值更新为true。
```html
<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
export default {
  data() {
    return {
      contentHasSave: false // 记录用户是否已经保存内容
    }
  },
  methods： {
    ...mapMutations({
      changeIntroduceState: changeIntroduceState
    })
  }，
  beforeDestory: function(){
    if(!contentHasSave){
      // 使用element的提示框
      this.$confirm('您还未保存简介，确定需要提出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 选择确定，正常跳转
      })
      .catch(() => {
        // 选择取消
        this.changeIntroduceState(true)
      })
   }
  }
}
</script>

```
+ 最后在router的beforeEach的导航守卫里监测from为当前页面的所有路由跳转。当state的introduceState为true的时候使用next(false)来取消本次路由跳转
```js
import Vue from "vue";
import VueRouter from "vue-router";
import routeConfig from "./routes";
import {sync} from "vuex-router-sync";
import store from "../store";
//加载路由中间件
Vue.use(VueRouter)

//定义路由
const router = new VueRouter({
  routes: routeConfig,
  //mode: 'history'
})

sync(store, router)

router.beforeEach((to, from, next) => {
  // 简介也未提交，取消跳转
  if(from.fullPath === '/adwords/introduce' && store.state.introduceState === 'not-save'){
    next(false)
  }
})

export default router
```

这种做法其实是行不通的，因为beforeEach方法的执行其实是在组件beforeDestory的方法之前执行的，也就是说beforeEach执行的时候introduceState的值根本没有被更新为true。

#### 正确的做法

后来自己去翻vue router的官方文档，找到了一个绝妙的方法，那就是组件内的导航守卫。
```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

上面的描述很清楚，于是我就在组件的js代码里加了一个beforeRouteLeave方法，然后弹出提示框，实现提示保存后退出的功能。

```html
<script>
export default {
  data() {
    return {
      contentHasSave: false // 记录用户是否已经保存内容
    }
  },
   // 组件内导航钩子，处理未保存退出的情况
  beforeRouteLeave: function(to, from , next){
    if(this.buttonText === '提交'){
      next(false)
      this.$confirm('您还未保存简介，确定需要提出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 选择确定
        next()
      })
    }
  }
}
</script>
```
实现效果如下：
![编辑](http://fs.andylistudio.com/blog/introduce2.png)

![提示](http://fs.andylistudio.com/blog/introduce03.png)