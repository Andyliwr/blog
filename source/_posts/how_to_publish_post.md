---
title: 如何发布博客
date: 2017-08-05 15:42:39
tags:
---
hexo是一个优秀的博客工具，通过将markdown文件转化成静态页面文件，使得使用者可以通过几行简单的命令和编写md文件来管理自己的博客。

下面来介绍如何使用hexo:

#### 1. **安装node.js**

点击进入[node.js官网](https://nodejs.org/en/)

![](https://olpkwt43d.qnssl.com/blog/post001/post-1-01.png)

目前node.js有两个推荐版本，分为通用版和最新版，点击可直接进行下载。下载好后，按照既定的套路安装即可。

安装好了之后在cmd中输入`node -v`来测试node是否安装成功.

#### 2. **安装hexo**
```bash
npm install -g hexo-cli
```
安装好hexo以后，在终端中输入：
```bash
hexo
```
如果出现如下输出，说明hexo安装成功。

![](https://olpkwt43d.qnssl.com/blog/post001/post-1-02.png)

#### 3. **安装博客依赖**

在终端中输入：
```bash
cd BehavioralGeneticsSQL-blog
npm install
```
#### 3. **启动博客**
```bash
hexo server
```
![](https://olpkwt43d.qnssl.com/blog/post001/post-1-05.png)
在浏览器中打开`http://localhost:4000`就能看到在本地启动的博客了。

![](https://olpkwt43d.qnssl.com/blog/post001/post-1-06.png)

#### 4. **新建博客文章**
```bash
// 新建一篇文章
hexo new "文章标题"
```
我们可以在本地博客文件夹`source->_post`文件夹下看到我们新建的markdown文件。

![](https://olpkwt43d.qnssl.com/blog/post001/post-1-03.png)

用Markdown编辑器打开文件，我们可以看到这样的内容：

![](https://olpkwt43d.qnssl.com/blog/post001/post-1-04.png)

编辑完刷新页面就能看到改动。

#### 5. **发布博客**

在终端输入：
```bash
hexo clean
hexo generate
hexo deploy
```
为了保证别人能拿到你写的内容，而不至于覆盖你的文章，你还需要将改动推送到github上
```bash
git add .
git commit -am "发布了一篇新文章"
git push
```
下次在写文章之前也要先看下是否有内容更新，如果有请先pull下来。


