---
layout: post
title: Html5 File API详解[转载]
comments: true
tags:
  - default
photos:
  - 'https://img.vim-cn.com/59/d7f8814d0f67906eee5ab7c3e0a2ee00bb2f26.jpg'
date: 2018-12-08 16:46:19
updated: 2018-12-08 16:46:19
---

### 前言

`HTML5` 为我们提供了一种通过 `File API` 规范与本地文件交互的标准方式。虽然也用过很多次了，但是一直不是很系统，今天参考别人的博客系统总结下。
`File API`提供了多种文件访问的接口：

1. `File`，独立文件，提供文件的只读信息，比如名称，文件大小，`minetype`以及文件的引用
2. `FileList`，文件对象的类数组序列，上传文件时选择多个文件或者拖拽上传拖拽多个文件的时候会有用到
3. `Blob`，将文件分割为字节

### 检查你的浏览器是否支持 File API

Chrome 浏览器 6.0 和 `Firefox 3.6` 均支持处理本地文件所必需的 API。从 `Firefox 3.6.3` 起，就不支持 `File.slice()` 方法了。
检查方法如下：

```js
// 检查当前浏览器是否支持File API
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // something
} else {
  alert('The File APIs are not fully supported in this browser.');
}
```

### 选择文件

#### 使用表单输入选择

使用标准 `<input type="file">` 元素可以打开一个文件选择的弹窗，用户选择完文件之后 input 元素会得到一个 FileList 对象

如果想选择多个文件，可以声明 multiple 属性。如果想要选择特定格式的文件，可以声明 accept 属性，常用的有如下这些：

1. 选择`txt`文件，accept="text/plain"
2. 选择`excel`文件，accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
3. 选择`png`图片，accept="image/png"

这里有一份各种文件类型对应的 accept 字段的[表格](https://file.lantingshucheng.com/1544260274522.txt)，请收好~

```html index.html
<input type="file" id="files" name="files[]" multiple /> <output id="list"></output>
<script>
  document.getElementById('files').addEventListener(
    'change',
    function() {
      var files = evt.target.files; // FileList 对象

      // 罗列一些属性
      var output = [];
      for (var i = 0, f; (f = files[i]); i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ', f.lastModifiedDate.toLocaleDateString(), '</li>');
      }
      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    },
    false
  );
</script>
```

点击这里查看[demo](https://codepen.io/Andyliwr/pen/LMPMEQ)

#### 使用拖拽操作选择

我们可以给元素添加 dragover 事件，如果拖动的是一个文件，就能在 event.dataTransfer.files 属性中拿到本次拖拽的图片

```js index.html
<div id="drop_zone">Drop files here</div>
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
</script>
```

点击这里查看[demo](https://codepen.io/Andyliwr/pen/KbPbVV)

### FileReader
当获取了 `File` 引用后，实例化 `FileReader` 对象，以便将其内容读取到内存中。加载结束后，将触发读取程序的 `onload` 事件，而其 `result` 属性可用于访问文件数据。
FileReader 包括四个异步读取文件的选项：
+ FileReader.readAsBinaryString(Blob|File) - result 属性将包含二进制字符串形式的 file/blob 数据。每个字节均由一个 [0..255] 范围内的整数表示。
+ FileReader.readAsText(Blob|File, opt_encoding) - result 属性将包含文本字符串形式的 file/blob 数据。该字符串在默认情况下采用“UTF-8”编码。使用可选编码参数可指定其他格式。
+ FileReader.readAsDataURL(Blob|File) - result 属性将包含编码为数据网址的 file/blob 数据。
+ FileReader.readAsArrayBuffer(Blob|File) - result 属性将包含 ArrayBuffer 对象形式的 file/blob 数据。
  
对您的 FileReader 对象调用其中某一种读取方法后，可使用 `onloadstart`、`onprogress`、`onload`、`onabort`、`onerror` 和 `onloadend` 跟踪其进度。

下面的示例从用户选择的内容中过滤掉了图片，对文件调用 reader.readAsDataURL()，并通过将“src”属性设为数据网址来呈现缩略图。

```html index.html
<style>
  .thumb {
    height: 75px;
    border: 1px solid #000;
    margin: 10px 5px 0 0;
  }
</style>

<input type="file" id="files" name="files[]" multiple />
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>
```
点击这里查看[demo](https://codepen.io/Andyliwr/pen/dwojPx)

#### 文件分割以及监控文件读取进度
对于大文件的上传，可以使用File接口分割文件，然后分布上传到服务器，由服务器组件负责按正确顺序重建文件，此外使用onloadstart 和 onprogress 事件可用于监控读取进度，点击这里[查看详情](https://www.html5rocks.com/zh/tutorials/file/dndfiles/)

### 结束
文章转载于 [通过 File API 使用 JavaScript 读取文件](https://www.html5rocks.com/zh/tutorials/file/dndfiles/)
如果你有更好的建议或者困惑的地方，都可以发送邮件到我的邮箱 - [andyliwr@outlook.com](andyliwr@outlook.com)
