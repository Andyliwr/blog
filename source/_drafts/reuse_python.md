---
title: 重拾Python
date: 2018-11-27 11:52:52
tags:
  - python
---

### 前言

#### 安装 python 包管理器

Pipenv 是 Python 项目的依赖管理器，和 nodejs 中的 npm 类似。

```
pip install pipenv
```

<p style="font-size: 13px; font-style: italic;">PS: windows 下安装完成之后终端输入`pipenv`显示命令未找到，这和环境变量设置有关。只需要查看安装时包的放置路径，然后将路径下放置的到环境变量中即可</p>

```
# 使用pip创建一个虚拟环境
cd my_project
pipenv install // 指定python版本使用 pipenv --python 3.7
pipenv shell // 激活virtualenv
项目下会多两个文件Pipfile  Pipfile.lock
项目安装包使用 pipenv install xxx 包会被写入到Pipfile中
使用 pipenv graph可以查看包以及包的依赖

```

#### pylint

```
# 初始化
pylint --persistent=n --generate-rcfile > pylint.conf
```

### windows 安装 pycrypto

easy_install http://www.voidspace.org.uk/python/pycrypto-2.6.1/pycrypto-2.6.1.win32-py2.7.exe
