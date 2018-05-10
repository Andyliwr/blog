---
title: 手机端调试的小技巧
date: 2017-06-12 14:34:34
tags:
  - 同花顺
---

做移动端开发的时候，每次想看某个变量的时候都得 alert，点来点去很麻烦，于是自己写了一个创建一个调试窗的方法，以后吧 console.log 换成这个，就可以在移动端界面中直接看到日志输出了。

使用方法：

1.  将 createLog 粘贴进你的代码

```javascript
function createLog(log) {
  var logDom = document.getElementById('consoleLog');
  if (logDom) {
    logDom.innerHTML += '<br>' + log;
  } else {
    var logDiv = document.createElement('div');
    logDiv.id = 'consoleLog';
    logDiv.innerHTML = log;
    logDiv.style.position = 'absolute';
    logDiv.style.top = '0';
    logDiv.style.left = '0';
    logDiv.style.backgroundColor = '#000000';
    logDiv.style.color = 'rgb(0, 247, 32)';
    logDiv.style.zIndex = '10000';
    logDiv.style.opacity = '.8';
    logDiv.style.minHeight = '40px';
    logDiv.style.maxHeight = '100px';
    logDiv.style.overflow = 'auto';
    logDiv.style.padding = '4px 6px';
    logDiv.style.boxSizing = 'border-box';
    logDiv.style.width = '100%';
    logDiv.style.fontSize = '12px';
    var closeBtn = document.createElement('span');
    closeBtn.style.display = 'inline-block';
    closeBtn.style.position = 'fixed';
    closeBtn.style.height = '16px';
    closeBtn.style.width = '16px';
    closeBtn.style.right = '6px';
    closeBtn.style.top = '6px';
    closeBtn.style.border = '1px solid #fff';
    closeBtn.style.borderRadius = '50%';
    closeBtn.innerText = 'X';
    closeBtn.style.fontSize = '12px';
    closeBtn.style.lineHeight = '16px';
    closeBtn.style.textAlign = 'center';
    closeBtn.style.color = '#ffffff';
    closeBtn.style.zIndex = '10001';
    closeBtn.addEventListener('click', function(event) {
      event.preventDefault();
      var logDom = document.getElementById('consoleLog');
      document.getElementsByTagName('body')[0].removeChild(logDom);
    });
    logDiv.appendChild(closeBtn);
    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(logDiv, body.childNodes[0]);
  }
}
```

2.  以后在使用`console.log`的时候变成`createLog(xxx)`

运行截图
![手机上的效果](https://fs.andylistudio.com/blog/post04/result.png/default)
