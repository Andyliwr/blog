---
title: 修复iphone下有输入框弹窗fixed失效的bug
date: 2017-09-12 17:25:10
tags:
---

在开发移动端的时候，经常会有这样的需求---有一个弹窗里面包含了一个登陆框，登录框需要对用户输入的值做验证，在值不正确的情况下使用 alert 提示用户输入有误。

在 Android 机上使用 fixed 来定位登录框是没有问题的，但是在 iphone 上 bug 就存在了，先来看看我录制的两个视频:
<video style="width: 600px" src="https://file.lantingshucheng.com/blog/post20170912_v02.mp4" controls="controls" height="400px">
您的浏览器不支持视频播放
</video>

注意看弹出 alert 的一瞬间透明背景的高度，是不是有些问题？再看另一个：
<video style="height: 400px" src="https://file.lantingshucheng.com/blog/post20170912_v03.mp4" controls="controls" height="400px">
您的浏览器不支持视频播放
</video>
以上问题还没看明白的话，我这儿还有个两个的 demo，掏出手机扫描下看看吧。左边是错误的 demo，右边是正确的 demo。点击”1000 元起始投资“后再点击”我已开户“才能看到登陆弹窗哦~

<div style="overflow: hidden; text-align: center"><div style="display: inline-block; width: 200px;"><img src="https://file.lantingshucheng.com/blog/post20170912_01.png/default"/><p style="text-align: center">错误的demo</p></div><div style="display: inline-block; width: 200px; margin-left: 40px"><img src="https://file.lantingshucheng.com/blog/post20170912_02.png/default"/><p style="text-align: center">正确的demo</p></div></div>

### **bug 产生的原因**

iphone 在键盘弹出的时候，页面的高度为屏幕高度减去键盘的高度，当 input 元素失去焦点，键盘的收起的 0.5s 内弹出了 alert 框，js 被停止执行，并且弹窗的 fixed 属性失效了。由于透明的黑色背景也是采用的 fixed 定位，所以在 fixed 失效的时透明的黑色背景的高度不会随着 body 的高度变大(键盘往下收缩，腾出来的空间显示页面)而变大。

<div style="text-align: center"><img style="display: inline-block; width: 300px" src="https://file.lantingshucheng.com/blog/post20170912_03.png/default"/> <img style="display: inline-block; width: 300px; margin-left: 30px;"  src="https://file.lantingshucheng.com/blog/post20170912_05.png/default"/></div>
根据以上分析，导致这种现象的有两个原因:
**第一**：使用了fixed定位
**第二**： alert弹出的时机太早了，应该等到键盘完全收起之后再弹出，这样就不会阻碍js的执行了。

所以改良之后的弹窗方案如下：

**html**

```html
<body>
    <div class="container">页面主体内容</div>
    <div class="alert-container">
    <div class="content" style="margin-top: -156px;">
        <div class="title">
        请先登录
        <i class="icon-close"></i>
        </div>
        <div class="login">
        <input id="phone" type="text" placeholder="请输入手机号">
        <div class="yzm-container">
            <input id="img-yzm" type="text" placeholder="请输入图形验证码">
            <img id="imagecodeSrc" src="//khtest.10jqka.com.cn/kh/apiprize/index.php?action=imgcode">
        </div>
        <div class="yzm-container">
            <input id="phone-yzm" type="text" placeholder="请输入手机验证码">
            <button id="getPhoneYzm">获取验证码</button>
        </div>
        <button id="doLogin" class="btn">立即登录</button>
        </div>
    </div>
    <div class="modal-bg"> </div>
    </div>
</body>
```

**css**

```css
/* 禁止body滚动，设置container滚动，因为接下来弹框需要使用absolute定位，弹框是body的子元素，body高度不定位为视窗高度的话，使用绝对定位无法将弹窗垂直居中。*/
html,
body {
  height: 100%;
  overflow: hidden;
}
/* 这里container的height要是100%，不然container无法滚动了*/
.container {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
/* 黑色透明背景，使用觉得定位，弹窗的margin-top值再创建弹窗的时候使用js动态计算，确保弹窗垂直居中*/
.modal-bg {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  overflow: hidden;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
}
/* 弹出框，也使用绝对定位*/
.alert-container {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
  text-align: center;
  position: fixed;
}
.alert-container .content {
  background: #fff;
  color: #2c2c2c;
  background-size: 100% 100%;
  position: relative;
  left: 8%;
  top: 50%;
  width: 84%;
  z-index: 2000;
  border-radius: 0.1rem;
  padding: 0 0.36rem;
  box-sizing: border-box;
}
.alert-container .content .title {
  padding: 0.24rem 0 0.18rem 0;
  font-size: 0.32rem;
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}
.alert-container .content .title .icon-close {
  display: inline-block;
  width: 0.35rem;
  height: 0.35rem;
  position: absolute;
  top: 50%;
  margin-top: -0.16rem;
  right: 0;
}
.alert-container .content .login {
  padding-top: 0.3rem;
}
.alert-container .content .login input {
  outline: none;
  height: 0.76rem;
  font-size: 0.26rem;
  vertical-align: middle;
}
.alert-container .content .login #phone {
  width: 100%;
  border: none;
  border-bottom: 1px solid #dcdcdc;
}
.alert-container .content .login .yzm-container {
  width: 100%;
  height: 0.76rem;
  white-space: nowrap;
  border-bottom: 1px solid #dcdcdc;
}
.alert-container .content .login .yzm-container > input {
  float: left;
  border: none;
  width: 100%;
  padding-right: 1.6rem;
  box-sizing: border-box;
}
.alert-container .content .login .yzm-container > img {
  height: 0.5rem;
  width: 1.4rem;
  margin-top: 0.13rem;
  vertical-align: middle;
  float: left;
  margin-left: -1.4rem;
}
.alert-container .content .login #getPhoneYzm {
  width: 1.4rem;
  height: 0.76rem;
  float: right;
  background: none;
  border: none;
  color: #5589ff;
  margin-left: -1.4rem;
  font-size: 0.26rem;
  outline: none;
}
```

**javascript**

```javascript
/**
 * 创建弹窗
 */
function createAlertDiv(title, content, closeStat) {
  //对于已经存在的alert先去掉
  $('.alert-container').remove();
  $('.modal-bg').remove();
  //动态生成dom
  try {
    var alertHtml = '<div class="alert-container"><div class="content"><div class="title">' + title + '<i class="icon-close"></i>     </div>' + content + '</div><div class="modal-bg"></div></div>'
    $('body').append(alertHtml)
    // 根据弹窗的实际高度动态计算弹窗的margin-top值，这里不使用transform是为了低端机兼容
    $('.alert-container .content').css('margin-top', -($('.alert-container .content').height() / 2) + 'px')
    $('.modal-bg, .icon-close').click(function() {
      // 如果是登录弹窗，关闭弹窗应当还原登陆弹窗数据
      if ($('.alert-container .login').length > 0) {
        skeyArr = []
        telphone = ''
        isPhoneCorrect = false
        imageCode = ''
        isImageCodeCorrect = false
        isGetYzmCanBeClick = true
        phoneYzm = ''
        isPhoneYzmCorrect = false
        clearInterval(yzmTimer);
        yzmTimer = null
      }
      $('.alert-container').remove();
      $('.modal-bg').remove();
      // 关闭弹窗统计
      hxmClickStat(pageId + '.' + closeStat)
   })
   //阻止屏幕滑动
   $('.alert-container').bind('touchmove', function(e) {
     e.preventDefault();
   });
  } catch (err) {
   console.log(err)
  }
}

// 弹出错误提示的时候需要延时500ms
....
$.ajax({
  url: xxx,
  success: function(res){
    if(res.data.code === '0'){
        // 正确的处理逻辑
    }else{
        iphoneDelayDone(function(){alert(res.data.msg)})
    }
  }
})
....
function iphoneDelayDone(callback) {
  if (platform === 'iphone') {
    setTimeout(function() {
      if (typeof callback === 'function') {
        callback()
      }
    }, 500)
  } else {
    if (typeof callback === 'function') {
      callback()
    }
  }
}
```

最后贴一个正确效果的视频。
<video style="height: 400px" src="https://file.lantingshucheng.com/blog/post20170912_v01.mp4" controls="controls" height="400px">
