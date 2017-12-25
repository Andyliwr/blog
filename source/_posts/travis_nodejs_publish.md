---
title: 如何使用travis为nodejs持续集成
date: 2017-12-25 10:24:29
tags:
 - nodejs
 - travis
 - github
---

**持续集成**：Continuous Integration，简称CI，意思是，在一个项目中，任何人对代码库的任何改动，都会触发CI服务器自动对项目进行构建，自动运行测试，甚至自动部署到测试环境。这样做的好处就是，随时发现问题，随时修复。因为修复问题的成本随着时间的推移而增长，越早发现，修复成本越低。

下面来介绍如何为GitHub上托管的开源项目用Travis CI进行持续集成：

#### travis简介
`Travis CI`是在线托管的CI服务，用`Travis`来进行持续集成，不需要自己搭服务器，在网页上点几下就好，用起来更方便。最重要的是，它对开源项目是免费的，而且天生对github项目友好，所以使用travis集成githu项目是最好不过了。
[travis官网](https://travis-ci.com/)，直接使用github登录，第一次登录之后需要对已有的github项目进行授权，你只需把你需要使用travis的项目打上勾就好了。默认情况下，travis会在你push代码的时候会收到github的通知，然后为你执行部署的命令。

#### 具体改怎么做
先讲下我的需求：
博主一直使用`hexo`来写博客，并且想让自己的博客可以使用两个域名来访问---https://andyliwr.github.io以及http://www.andylistudio.com，andylistudio的域名是指向一台阿里云服务器，在服务器上使用`hexo server`启动了一个本地3000端口，并使用nginx转发到80。
那么现在来想一下在编写完一篇博客之后我们需要做的操作：
1. 执行`hexo clean`、`hexo generate`、`hexo deploy`将代码推送到github远程仓库，这样过一会儿github会自动更新https://andyliwr.github.io
2. 执行`git add .`、`git commit -am "xxx"`、`git push`将代码推送到管理博客的github的远程仓库，然后登陆阿里云的服务器，`cd`到管理博客的github项目根目录下，执行git pull拉取刚才的改动

博主觉得这样一个流程太复杂，能不能用些简单的方法将所有的动作简化为一个动作---那就是我只需要执行`git push`，其他的事都不用管了。我想到了持续集成，正好之前也了解到了travis，所以花了些时间学习了下`travis`，并且在历经磨难之后学会了`travis`☺。我突然想起了自己还在上海的时候，为了使用jekyll搭建自己的一个博客，整整花了一个周末折腾。

我们开始吧：
1. 首先我们需要在服务器上安装travis的运行环境，但是因为travis是基于`ruby`开发的，所以我们先要安装一个`ruby`。`ubuntu`安装`ruby`很简单
```
sudo apt-get update
sudo apt-get install ruby
```
  **PS**:这样安装的ruby很多时候安装不上travis，因为travis需要ruby2.0以上的版本，但是apt-get安装的是1.9版本。所以最好是选择源码安装
  ```
  # 卸载之前安装的ruby
  sudo apt-get remove ruby
  # ruby官方网站下载地址 http://www.ruby-lang.org/en/downloads/
  # 先安装一些编译需要用到的包
  sudo apt-get -y update
  sudo apt-get - y install build-essential zlib1g-dev libssl-dev libreadline6-dev libyaml-dev
  # 下载安装包并解压
  wget https://cache.ruby-lang.org/pub/ruby/2.4/ruby-2.4.3.tar.gz
  tar -zxvf  ruby-2.4.3.tar.gz
  cd ruby-2.4.3
  ./configure --prefix=/usr/local
  make
  sudo make install
  # 验证是否安装好了
  ruby -v
  ```
  然后是安装travis，执行运行如下命令:
  ```
  gem install travis
  ```
  **PS**: 如果安装太慢可以将`gem`源改成国内源，[参考方法](https://gems.ruby-china.org/)
2. 使用travis初始化你的项目
  因为我们需要使用travis将`hexo generate`生成的代码推送到github上，所以需要让服务器拥有github推送的代码的权限:
  ```
  # 生成密钥
  ssh-keygen -t rsa -C "andyliwr@outlook.com"

  # 开启ssh服务
  eval `ssh-agent -s`

  # 添加密钥
  ssh-add ~/.ssh/id_rsa.pub

  # 查看刚才生成的公钥，并复制它，将它添加到GitHub的ssh key里去
  cat ~/.ssh/id_rsa.pub

  # 在~/.ssh/添加一个ssh_config文件，输入如下内容
  Host github.com
    User git
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes

  # 使用ssh克隆项目，这里使用ssh地址
  git clone git@github.com:Andyliwr/blog_manager.git
  ```
  这样我们服务器就拥有了推送代码到github的权限。
  **PS**：腾讯云服务ssh秘钥只有root用户才有权限更改和查看，所以在创建秘钥的时候别忘了先将.ssh目录的属主改成ubuntu
  ```
  sudo chown ubuntu:ubuntu /home/ubuntu/.ssh/ -R
  ```
3. 初始化travis配置文件
  在github项目根目录下执行如下命令：
  ```
  # 使用 githu 登录 travis，期间需要输入github的用户名和密码
  travis login --auto
  # 创建配置文件
  touch .travis.yml
  # 使用travis加密你的ssh秘钥，会生成一个id_rsa.enc文件，并且会往.travis.yml里写入一个before_install的命令。这样你就能放心的将秘钥存储在github项目上了
  travis encrypt-file ~/.ssh/id_rsa --add
  # 移动下刚才生成的id_rsa.enc文件
  mkdir .travis && mv id_rsa.enc .travis/
  # 修改before_install命令了的id_rsa.enc的路径为.travis/id_rsa.enc
  ```
4. 如此一个travis项目算是初始化好了，你可以执行一个代码`push`，然后去travis的官网看下持续集成是否执行成功了。

#### 自定义travis的集成步骤
之前还是只初始化好了travis，下面我来介绍如定义自定步骤：
```
# 使用的语言
language:
 - node_js

# 使用的node版本
node_js:
 - "8.0.0"

# 仓库的分支
branches:
  only:
  - master

# 执行isntall前需要执行的命令
before_install:
  - openssl aes-256-cbc -K $encrypted_d839c941aa8f_key -iv $encrypted_d839c941aa8f_iv
  -in .travis/id_rsa_travis.enc -out .travis/id_rsa_travis -d

# 改变文件权限
  - chmod 600 .travis/id_rsa_travis

# 配置 ssh
  - eval $(ssh-agent)
  - ssh-add .travis/id_rsa_travis

# 配置git 的个人信息
  - git config --global user.name 'andyliwr'
  - git config --global user.email andyliwr@outlook.com

# 执行install
install:
  - npm install hexo-cli -g
  - npm install

# 执行命令脚本
script:
  - hexo clean
  - hexo g -d

```
**PS**：注意由于现在腾讯云服务器已经可以只用ssh秘钥访问github了所以在博客项目的`.config.yml`文件deploy里应该ssh地址
我这里感觉还有些问题，直接将`id_rsa_travis`秘钥存储在了github项目上，那么别人如果拿到了这个秘钥就能对我的github做任意的修改。这个问题以后再修复吧~
