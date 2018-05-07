---
layout: post
title: travis自动化部署续篇
date: 2018-04-28 15:48:56
tags:
  - nodejs
  - travis
toc: true
---

### 前言
之前写过一篇文章--[如何使用travis为nodejs持续集成](https://andyliwr.github.io/2017/12/05/travis_nodejs_publish/)，主要是用来在`github`上自动化部署自己的博客。今天来继续来讲`travis`如何和自己的服务器取得联系，自动去服务器上执行`shell`命令来完成部署。

### 服务器配置
#### 创建travis管理员账号
```
#新建用户
useradd travis
#修改密码（应该不是必要，但是万一以后需要用密码登陆呢）,按照提示设置密码。
passwd travis
#为用户添加添加权限
sudo vim /etc/sudoers
```
找到`#Allow root to run any commands anywhere`这一行，在下方添加`travis ALL=(ALL:ALL) ALL`
编辑权限文件的时候如果出现保存不了的问题，可以输入`:wq!`强制保存

#### 生成部署秘钥
```
su travis
sudo ssh-keygen -t rsa
```
生秘钥的时候不要设置`passphase`，留空就好
如果ssh-keygen命令不存在，请先安装`openssh-client`。
```
sudo apt-get install ssh
```
如果出现不存在/home/travis的目录，则需要手动添加
```
sudo mkdir /home/travis
sudo chown travis:travis /home/travis
```

然后修改`.ssh`目录权限
```
#设置.ssh目录为700
chmod 700 ~/.ssh
#设置.ssh目录下的文件为600
chmod 600 ~/.ssh/*
ls -al
ls ~/.ssh/ -al
```

### 添加公钥到受信列表中
```
cat id_rsa.pub >> authorized_keys
cat authorized_keys
```

### 测试ssh登录
```
vi config
# 写入以下内容
------------
Host khweb
HostName 99.99.99.99(你的服务器ip)
#登陆的用户名
User travis
IdentitiesOnly yes
#登陆使用的密钥
IdentityFile ~/.ssh/id_rsa
-------------

ssh test
# 输出 Bad owner or permissions on /home/travis/.ssh/config
# 注意此时的测试是失败的，因为authorized_keys和config是我们后面添加的文件，文件权限并不是600

ls -al
chmod 600 config
chmod 600 authorized_keys
ls -al
ssh test
# 测试成功，生成了一个known_hosts文件，以后再登陆时就不需要在输入yes确认了，你可以再做一次测试
```

### 安装travis命令行工具
```
# 安装rvm
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
curl -sSL https://get.rvm.io | bash -s stable
source /home/travis/.rvm/scripts/rvm

# 安装ruby
rvm install ruby
gem -v
gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
gem sources -l

# 安装travis
gem install travis
```

### 登录travis并生成部署的秘钥
```
travis login
travis encrypt-file ~/.ssh/id_rsa --add
```
查看下`.travis.yml`就可以看到自动添加的改动
```diff
+ before_install:
+  - openssl aes-256-cbc -K $encrypted_20c4b952970b_key -iv
+    $encrypted_20c4b952970b_iv -in id_rsa.enc -out ~\/.ssh/id_rsa -d
```
这里我们改下，将`id_rsa.enc`移动到一个名为`.travis`的文件夹下，`~\/.ssh/id_rsa`也经常找不到，所以改成`~/.ssh/id_rsa`。最后就变成这样：
```
mkdir .travis && mv id_rsa.enc .travis/
```
```yml
before_install:
- openssl aes-256-cbc -K $encrypted_20c4b952970b_key -iv $encrypted_20c4b952970b_iv
  -in .travis/id_rsa.enc -out ~/.ssh/id_rsa -d
```

### 编写登录服务器之后的代码
#### 1. 复制本地文件到远程服务器
比如一个前端项目，在`npm run build`之后需要把打包的`dist`传到服务器的静态资源目录完成部署，这个时候就可以使用[`scp`](http://www.runoob.com/linux/linux-comm-scp.html)命令：
```yml
after_success:
 - chmod 600 ~/.ssh/id_rsa
 - scp -r dist/ travis@193.112.196.41:/var/www/admin
```
#### 2. 登录远程服务器并执行写好的shell脚本
在travis目录下新建一个`deploy.sh`，执行如下命令：
```
cd /home/ubuntu/mbook-koa
echo "从远程拉取代码"
git pull
echo "最新改动如下"
git diff HEAD^
echo "PM2 进程"
source /home/ubuntu/.nvm/nvm.sh
pm2 list
echo "重启mbook-koa"
pm2 restart mbook-koa

```
`.travis.yml`内容如下：
```yml
after_success:
 - chmod 600 ~/.ssh/id_rsa
 - ssh travis@193.112.196.41 "/home/ubuntu/mbook-koa/.travis/deploy.sh"
```

### 结束
最后贴个自己写好的`.travis.yml`，祝您编码愉快!
```yml
language: node_js
node_js:
 - '9'
branchs:
  only:
  - master
cache:
  directories:
    - "node_modules"
install:
 - npm install
scripts:
 - npm run test
addons:
  ssh_known_hosts:
   - 193.112.196.41
before_install:
 - openssl aes-256-cbc -K $encrypted_c2df1cea7f22_key -iv $encrypted_c2df1cea7f22_iv
   -in .travis/id_rsa.enc -out ~/.ssh/id_rsa -d
 - sudo apt-get update -q
 - sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
after_success:
 - chmod 600 ~/.ssh/id_rsa
 - ssh travis@193.112.196.41 "/home/ubuntu/mbook-koa/.travis/deploy.sh"
```
