---
title: 使用vscode调试python代码
date: 2017-09-11 18:27:16
tags:
 - python
---

最近在整 python 爬虫，使用的编辑器是 vscode，头疼的问题来了。vscode 天生支持对 nodejs 的调试，那么怎么使用 vscode 来调试 python 代码呢？

其实 vscode 调试程序方法都是修改`launch.json`，但是配置 nodejs 和配置 python 有些差异。下面就看看具体怎么调试 python 吧：

1、vscode 安装 python 扩展，在 vscode 扩展管理器中搜索 pyhon，排名第一的就是我们需要下载的包---python。点击安装后重载窗体

![python扩展](https://fs.andylistudio.com/blog/post20170911_01.png/default)

2、点击调试--打开`launch.json`的按钮（那个小齿轮的图标）进入到调试配置页面。此时应该能看到 vscode 已经为我们初始化好了一些 python 的任务。

![launch.json](https://fs.andylistudio.com/blog/post20170911_02.png/default)

3、注意看，每个配置对象里基本都有这样一个属性---`"pythonPath": "${config:python.pythonPath}"`，这是配置 python 的安装地址，需要打开设置，在`setting.json`中配置如下：

```
// Python specific
"python.pythonPath": "D:/python/python.exe",
"python.linting.pylintEnabled": false,
"python.linting.flake8Enabled": true,
"python.linting.flake8Args": ["--max-line-length=248"],
"python.formatting.provider": "autopep8"
```

其中 python.pythonPath 就是填写 python 的安装地址，`pylint`和`flake8`是 python 代码风格控制插件，如果你写的代码不符合常见风格，就会报错。这里我们选用 flake8，`autopep8`是代码格式化插件。设置完这些之后，保存`setting.json`。应为`flake8`和`autopep8`这些我们都没装，所以 vscode 会在顶部提示是否需要安装`flake8`和`autopep8`，我们选择“是”。vscode 就会打开终端使用`pip`安装这些辅助包。

![setting.json](https://fs.andylistudio.com/blog/post20170911_03.png/default)

3、接下来是重点了，编辑`launch.json`，在 name 为 Python 的对象里新增一个名为 args 的属性，该属性是一个数组，数组元素就是你需要调试的 python 文件的文件名。比如`main.py`就写成`["main"]`

![args属性](https://fs.andylistudio.com/blog/post20170911_04.png/default)

4、然后点击右下角的“添加配置按钮”新增一个 python 任务，修改其中的`program`属性为你需要调试的 python 文件的地址，其中`${workspaceRoot}`代表项目根目录地址。

![main.py配置](https://fs.andylistudio.com/blog/post20170911_05.png/default)

![main.py配置2](https://fs.andylistudio.com/blog/post20170911_06.png/default)

5、最后打开调试面板，下拉框中选择名字为`main.py`的调试任务，启动调试就好了

![启动调试](https://fs.andylistudio.com/blog/post20170911_07.png/default)
