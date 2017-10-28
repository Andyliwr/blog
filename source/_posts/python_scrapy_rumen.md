---
title: Python scrapy入门
date: 2017-10-28 12:15:00
tags:
 - python
 - 毕设
---

### 前言
有时候想法太多也不是个好事，最近想做的项目有三个：
1. 上线毕设项目---[微书](https://github.com/AndyliStudio/graduationDesign)
2. 实现一个博客的评论系统---[wecomment](https://github.com/andyliwr/wecomment)
3. 实现一个图片上传工具，方便自己写博客---[ldk-upload-img](https://github.com/andyliwr/ldk-upload-img)

谈正题，讲下自己学习`scrapy`的过程，以及如何写一个爬虫。
学习一个新框架最好的方法就是去看它的官网，初次打开`scrapy`的官网，眼前一亮，让自己瞬间但觉到要是能掌握这门武技就能变成无敌黑客。
![scrapy官网](http://ouizhbgin.bkt.clouddn.com/blog/2017/10/28/scrapy_office.png)

### 安装`scrapy`
1. **windows下安装**
python安装包的时候依赖关系复杂，有时候存粹使用`pip install xxx`并不能安装成功，我们得找条捷径。参考官网给的安装教程，我选择了使用[anaconda](https://anaconda.org)。可是国内访问国外网站很慢，而且奇葩的时`anaconda`还很大，大概400多M.。当我发现我睡了一觉起来还没有下载成功的时候，果断点击了`取消下载`。这里给大家推荐两个镜像：
	+ 清华大学`anaconda`镜像 --- [https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)，如不能访问，请使用下面一个
	清华大学镜像还给了个替换`corda`下载源的方法，我试了下确实安装依赖速度上提升不少
	```
	conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
	conda config --set show_channel_urls yes
	```
	+ 中国科学技术大学镜像 --- [http://mirrors.ustc.edu.cn](http://mirrors.ustc.edu.cn/)

	总之呢，下载下来`anaconda`的安装`exe`文件，然后一直点击下一步`安装`就行。windows版本的`anaconda`还带有一个管理界面，安装包只需要搜索下，点击安装就好了。而且不用每次打开cmd去激活anaconda，管理界面也有打开cmd和Ipython的快捷方式。
	![anaconda包管理器](http://ouizhbgin.bkt.clouddn.com/blog/2017/10/28/scrapy_anaconda_ev.png)
	![anaconda打开终端](http://chuantu.biz/t6/115/1509161137x2890174172.png)

2. **linux下安装**
linux下的安装和window下类似，只是是下载`xxx.sh`文件，最后就是阅读安装协议，配置安装地址之类的。
```
sudo ./xxx.sh
```

### `scrapy`创建以及运行项目
创建项目，在终端中输入`scrapy startproject first_spider`，创建完成之后项目结构如下：
```
tutorial/
  scrapy.cfg          # 部署爬虫的配置文件
  tutorial/           # 项目根目录
    __init__.py
    items.py          # 定义每个爬虫需要爬取的数据结构
    pipelines.py      # 处理爬虫得到的数据，去重，存入数据库
    settings.py       # 爬虫设置
    spiders/          # 爬虫目录，放置所有的爬虫
      __init__.py
```

1. **新建一个爬虫axdzs**
```
# genspider后面的第一个参数是爬虫的名称，第二个是爬虫爬取的网址
scrapy genspider quotes quotes.toscrape.com
```
2. **修改spiders目录下新生成的quotes.py文件为如下代码**：
```python
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes" # 定义爬虫的名字

    # 发送请求
    def start_requests(self):
        urls = [
            'http://quotes.toscrape.com/page/1/',
            'http://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    # 处理请求返回的数据
    def parse(self, response):
        # response相当于一个html对象，里面包含原页面所有html元素
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        # 打开文件，将response存储进去
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.log('Saved file %s' % filename)
```

3. **运行爬虫**
```
scrapy crawl quotes
```
在控制台看到如下输出，并且项目根目录下多了两个文件 --- quotes1.html和quotes2.html：
```log
2016-12-16 21:24:05 [scrapy.core.engine] INFO: Spider opened
2016-12-16 21:24:05 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2016-12-16 21:24:05 [scrapy.extensions.telnet] DEBUG: Telnet console listening on 127.0.0.1:6023
2016-12-16 21:24:05 [scrapy.core.engine] DEBUG: Crawled (404) <GET http://quotes.toscrape.com/robots.txt> (referer: None)
2016-12-16 21:24:05 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://quotes.toscrape.com/page/1/> (referer: None)
2016-12-16 21:24:05 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://quotes.toscrape.com/page/2/> (referer: None)
2016-12-16 21:24:05 [quotes] DEBUG: Saved file quotes-1.html
2016-12-16 21:24:05 [quotes] DEBUG: Saved file quotes-2.html
2016-12-16 21:24:05 [scrapy.core.engine] INFO: Closing spider (finished)
```

如此一个最简单的爬虫就写好了，有木有很简单？
在接下来的文章，我将继续介绍scrapy的进阶内容，敬请期待。如果你有任何的疑问，欢迎写邮件到我的邮箱(andyliwr@outlook.com)