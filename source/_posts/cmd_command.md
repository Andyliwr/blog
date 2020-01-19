---
title: 如何使用windows bat编写一个快速启动工具
date: 2017-03-30 19:58:08
tags: 
  - windows
  - 毕设
---

最近做毕设的时候发现每次都需要输入命令启动 mongo 和 redis，还有一些爬虫和后台接口。感觉很麻烦，为什么不用 windows 上类似 shell 的 bat 语法写一个部署工具呢？

### 截图

![主界面](http://img.blog.csdn.net/20170330195438160)

![启动mongo](http://img.blog.csdn.net/20170330195452051)

![console](http://img.blog.csdn.net/20170330195504944)

注：图中所用软件为丑陋 cmd 的替换品 [cmder](https://github.com/cmderdev/cmder/releases/)

不多多说了，直接上代码吧，bat 语法大家可以自己搜索下。

### 主进程 `start.bat`

```bat
@echo off
echo 欢迎使用FollowHeart自动化工具，%username% ....
echo 使用之前请确保mongo和redis安装地址都已经加入到到了系统环境变量里
ECHO.
:: 公共参数设置 start
If %username% == Andyliwr (
  :: 记得改成ANDYLIWRTHS
  echo %computername%
  If %computername% == ANDYLIWRTHS (
     set projectAddr=C:\Users\Andyliwr\Documents\graduationDesign
     set mongoDbPath=D:\mongo\data
     set mongoLogPath=D:\mongo\log\mongo.log
     set mongoConfAddr=D:\mongo\mongod.conf
     set redisConfAddr=D:\redis\redis.windows.conf
  ) Else (
     set projectAddr=C:\Users\Andyliwr\Documents\graduationDesign
     set mongoDbPath=E:\mongo_install\data
     set mongoLogPath=E:\mongo_install\log\mongo.log
     set mongoConfAddr=E:\mongo_install\mongod.conf
     set redisConfAddr=E:\redis\redis.windows.conf
  )
) Else (
  If %username% == Greenovia (
     set projectAddr=G:\git项目\graduationDesign
     set mongoDbPath=F:\mongo\data
     set mongoLogPath=F:\mongo\log\mongo.log
     set mongoConfAddr=F:\mongo\mongod.conf
     set redisConfAddr=F:\redis\redis.windows.conf
  ) Else (
     echo 请使用文本编辑器打开start.bar手动配置地址：
     :: 请输入你当前的FollowHeart根目录地址:
     set projectAddr=xxx
     :: 请输入mongo数据存储地址(类似F:\mongo\data):
     set mongoDbPath=xxx
     :: 请输入mongo日志文件地址(类似F:\mongo\log\mongo.log):
     set mongoLogPath=xxx
     :: 请输入mongo配置文件的地址(类似F:\mongo\mongod.conf):
     set mongoConfAddr=xxx
     :: 请输入mongo配置文件的地址(类似F:\redis\redis.windows.conf):
     set redisConfAddr=xxx
  )
)
:: 公共参数设置 end
::清屏操作
rem cls
goto start
:start
    echo --------------------------------------------------
    echo --                FollowHeart部署               --
    echo --  1.启动mongo和redis                          --
    echo --  2.启动接口                                  --
    echo --  3.排行榜爬虫                                --
    echo --  4.百度贴吧榜爬虫                            --
    echo --  5.启动微信小城程序                          --
    echo --  6.新环境部署(该选项操作完成后会自动部署)    --
    echo --  7.END                                       --
    echo --------------------------------------------------
    ECHO.
    echo (请输入数字选择操作命令)
    set /p ans=
    if %ans%==1 goto startMongoAndRedis
    if %ans%==2 goto startApi
    if %ans%==3 goto startRankReptile
    if %ans%==4 goto startBdReptile
    if %ans%==5 goto startWechat
    if %ans%==6 goto deploy
    if %ans%==7 goto END
:startMongoAndRedis
    echo echo 正在启动redis和mongo...
    start "启动mongo和redis" startMongoAndRedis.bat %redisConfAddr% %mongoLogPath% %mongoDbPath%
    echo echo 已经启动redis和mongo...
    ECHO.
    ECHO.
    goto start
:startApi
    ECHO.
    echo 正在启动后端接口，请确保在启动接口之前已经执行过1了...
    start "启动后端接口" startApi.bat %projectAddr%
    echo 后端接口启动成功...
    ECHO.
    ECHO.
    goto start
:startBdReptile
    ECHO.
    echo 正在运行百度贴吧爬虫...
    start "启动百度贴吧爬虫" startBdReptile.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:startRankReptile
    ECHO.
    echo 正在运行排行榜爬虫...
    start "启动百度贴吧爬虫" startRankReptile.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:startWechat
    ECHO.
    echo 正在启动微信小程序...
   start "启动微信小程序" startWechat.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:deploy
    ECHO.
    echo ----执行static项目解压操作----
    :: 执行的逻辑命令--为bat文件传参
    start static.bat %uatPath% %sourcePath% %sourceDisk%
    echo ----static项目解压操作完成----
    goto start
:END
    ECHO.
    echo 退出批处理操作
pause
```

### 启动 redis 和 mongo `startMongoAndRedis.bat`

```bat
@echo off
echo echo 正在启动redis...
set redisConfAddr=%1
set mongoLogPath=%2
set mongoDbPath=%3
redis-server.exe %redisConfAddr% --loglevel verbose
If errorlevel 1 (
    echo Redis已经启动，请打开新的窗口输入redis-cli.exe开启你的管理吧...
) Else (
    echo Redis启动失败，请检查你配置的目录是否正确...
)
ECHO.
echo 正在启动Mongo...
mongod.exe --logpath=%mongoLogPath% --dbpath=%mongoDbPath% --journal --maxConns 20000
echo %errorlevel%
If errorlevel 1 (
    echo Mongo已经启动，请打开新的窗口输入mongo开启你的管理吧...
) Else (
    echo Mongo启动失败，请检查你配置的目录是否正确...
)
```

### 启动后端接口 `startApi`

```bat
@echo off
set projectAddr=%1
echo 正在启动后端接口，请确保在启动接口之前已经执行过1了...
cd %projectAddr%/api
If exist node_modules (
   echo "node包已安装..."
) Else (
    cnpm install
)
node .
If errorlevel 1 (
    echo 后端接口已经启动，请在浏览器中打开localhost:3000/explorer来查看吧...
) Else (
    echo 后端接口启动失败...
)
```

### 启动爬虫 startBdReptile.bat

```bat
@echo off
set projectAddr=%1
echo 正在运行百度贴吧爬虫...
cd %projectAddr%/reptile
If exist node_modules (
   echo node包已安装...
) Else (
   cnpm install
)
node networkReptile.js
```

### 踩的一些坑

创建 bat 文件最好先使用系统自带的记事本创建一个文本文件，然后在另存为 bat 文件，并且设置编码为 ASNI，不然很容易中文乱码的。包括使用一些主流的编辑器如 sublime 都会出现这种问题。博主建议使用 sublime 编辑 bat 文件，毕竟有语法高亮和快捷键，写起来很方便。然后编写完了别保存直接复制到记事本中保存，这样能避免中文乱码。如果你有更好的方法，不妨在评论中回复博主。
![保存编码的问题](http://img.blog.csdn.net/20170330195143921)

### 传送门：

1.  [小白都能看懂的 windows 常用 bat 批处理命令](http://www.imooc.com/article/8283)
2.  [Bat 语法命令](http://www.360doc.com/content/11/0804/10/4127803_137849318.shtml)
