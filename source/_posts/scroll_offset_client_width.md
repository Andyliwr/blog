---
title:  scrollWidth,clientWidth,offsetWidth的区别
date: 2016-03-11 20:52:06
tags:
 - 同花顺
 - js
---

**`scrollWidth`**：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。 

**`clientWidth`**：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。 

**`offsetWidth`**：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。

通过一个`demo`来说明下：

## **情况1：**

元素内无内容或者内容不超过可视区，滚动不出现或不可用的情况下。`scrollWidth`=`clientWidth`，两者皆为内容可视区的宽度。`offsetWidth`为元素的实际宽度。
![情况1](http://img.blog.csdn.net/20170220114439342)


 

## **情况2**

元素的内容超过可视区，滚动条出现和可用的情况下。
`scrollWidth>clientWidth`。`scrollWidth`为实际内容的宽度。clientWidth是内容可视区的宽度。`offsetWidth`是元素的实际宽度。
	
![情况2](http://img.blog.csdn.net/20170220114455752)
