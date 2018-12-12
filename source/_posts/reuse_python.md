---
title: 重拾Python
date: 2018-11-27 11:52:52
tags:
  - python
---

### 前言

#### 安装 Anaconda
那么问题来了本地已经安装了`python`为啥还需要使用`Anaconda`呢？
>1）Anaconda 附带了一大批常用数据科学包，它附带了 conda、Python 和 150 多个科学包及其依赖项。因此你可以立即开始处理数据。
>2）管理包Anaconda 是在 conda（一个包管理器和环境管理器）上发展出来的。在数据分析中，你会用到很多第三方的包，而conda（包管理器）可以很好的帮助你在计算机上安装和管理这些包，包括安装、卸载和更新包。
>3）管理环境为什么需要管理环境呢？比如你在A项目中用了 Python 2，而新的项目B老大要求使用Python 3，而同时安装两个Python版本可能会造成许多混乱和错误。这时候 conda就可以帮助你为不同的项目建立不同的运行环境。
>4) Anaconda支持windows、linux、Mac，这点非常好，这意味着你在任何环境下都能使用anaconda来管理你的代码。并且Anaconda和vscode是合作关系，Anaconda在vscode中得到了很好的支持
> 详情请参考[知乎问答](https://www.zhihu.com/question/58033789)
#### linux下安装Anaconda
访问官网，复制出来anaconda linux版本的下载地址
```bash
# 全局环境安装，所以还是切换到root账号比较靠谱
su root
wget https://repo.anaconda.com/archive/Anaconda3-5.3.1-Linux-x86_64.sh
# 为下载的bash文件添加可执行权限
chmod +x Anaconda3-5.3.1-Linux-x86_64.sh
# 执行bash文件
sudo ./Anaconda3-5.3.1-Linux-x86_64.sh
```
接下来安装开始，anaconda的安装地址建议放在`/usr/share/anaconda3`下，这样任何用户都能使用`anaconda`
然后就是编辑.bashrc文件，写入`source /usr/share/anaconda3/etc/profile.d/conda.sh`，执行`source ~/.bashrc`，这样就能在命令行执行`conda`命令了
```bash
conda list # 查看安装的包
conda install [package_name] # 安装包
spyder # 启动Spyder编辑器

# 更新conda，保持conda最新
conda update conda
 
# 更新anaconda
conda update anaconda
# 更新python
conda update python
# 假设当前环境是python 3.4, conda会将python升级为3.4.x系列的当前最新版本

# 安装新的环境
conda create --name py370 python=3.7.0
# 查看已经安装的环境
conda info --e
# 激活py370
source /usr/share/anaconda3/bin/activate py370
```
然后就会看到终端变成了`(py370) lidikang@khserver:~$ `的字样

### windows下载安装anaconda
官网[下载安装包](https://www.anaconda.com/download/#windows)，无脑点击下一步就好了，环境的创建可以在`anaconda navigator`的界面中创建
激活环境和linux一致，cmd中输入`D:/anaconda/Scripts/activate 环境`名就好了

