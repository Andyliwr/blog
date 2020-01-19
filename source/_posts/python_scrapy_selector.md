---
title: Python scrapy 选择器
date: 2017-10-28 13:17:00
tags:
 - python
 - 毕设
---

### 前言

之前介绍了如何写一个最简单的爬虫，今天我们来讲一讲 scrapy 的选择器。 在爬虫程序的 parse 方法里，response 对象承载着爬虫爬取得到的最原始的数据，如何从这些混乱的数据中得到我们想要的数据就是接下来我们应该思考的。其实 python 爬虫和 nodejs 爬虫在这方面很类似，都是将原始数据传递给一个解析器，然后通过 xml 或者 html 的选择器去获取数据。只是不同的是，nodejs 是使用的是 cheerio 而 python 使用的是 xpath 或者 css。

再介绍选择器之前介绍一个很实用的工具，它是 scrapy 自带的 shell 工具，通过输入`scrapy shell <url>`可以进入命令行模式，这样可以让你在不写爬虫程序的情况下测试你的选择器，例如：
![scrapy shell](http://ouizhbgin.bkt.clouddn.com/blog/2017/10/28/scrapy_shell.png)

### 选择器

scrapy 提供两种选择器 --- reponse.css()和 response.xpath()，作为前端我选择 css，因为熟悉。

**1、css 选择器**

* **获取页面标题**

```python
response.css('title::text').extract()
```

通过`response.css('title')`获取到的只是一个`<title></title>`元素，只有在后面加上`::text`，才会得到元素里面具体的文字。还没完，通过`response.css('title::text')`获取到的只是一个 Selector 对象，只有调用`.extract()`才会的得到真正的内容。如果数据有多个但是你只想要第一个的话，那就使用`.extract_first()`

* **获取元素的属性**

```python
response.css('.result-item-title>a::attr(href)').extract()
```

通过`::attr(属性名)`就能获取到这个元素的属性值，抓取 a 标签里的 href 属性或者获取 img 元素的图片地址都需要这么干。

* **去掉获取到的文字中的空格**
  使用 python 字符串对象的 strip 方法就能轻易的做到这一点，不过有时候获取的数据有多条的时候，你得写一个循环去帮你逐条处理。

```python
item['author'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(1)>a::text').extract()
for i in range(0, len(item['author'])):
    item['author'][i] = item['author'][i].strip()
```

    去掉换行的话，使用`.replace('\n', '')`就可以了。

* **进阶用法---使用 re 和 set**
  re 可以提取数据的公共部分。我们假设一种情形，你要获取的 html 是这样子的：

```
<p class="target">
  哈哈哈
  <em>hahah</em>
  哈哈哈
</p>
```

    通过`response.css('.target::text()').extract()`得到的只是`哈哈哈<em>hahah</em>哈哈哈`，但是你想要的其实是“哈哈哈hahah哈哈哈”，这个时候可以使用re方法来过滤掉`<em></em>`，使用方法如下：
    ```python
    response.css('.target').extract()
    # 输出
    <p class="target">哈哈哈<em>hahah</em>哈哈哈</p>

    response.css('.target:text').extract()
    # 输出
    哈哈哈 \n 哈哈哈

    response.css('.target').extract().re(r'(.*)<em>(.*)</em>(.*)')
    # 输出
    哈哈哈hahah哈哈哈
    ```

set 方法的用法，我也研究得不是很清楚，可以参考官方给的[实例](https://docs.scrapy.org/en/latest/topics/selectors.html#set-operations)

**2、xpath 选择器**
这里只能给个[传送门](https://docs.scrapy.org/en/latest/topics/selectors.html)了，大致的原理都是一样的，区别就是 class 和 id 选择器，属性选择器的写法有所不同。

在接下来的文章，我将继续介绍`scrapy`的更多内容，敬请期待~
