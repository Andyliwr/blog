---
title: mongodb聚合查询
date: 2017-11-06 14:37:00
tags:
 - mongodb
---

### 前言

`mongo`如何根据每条记录的时间分组查询数据？比如查询用户每一天上传了哪些图片，最终返回结果是时间作为`key`值，`value`值是一个多张图片的数组。简单的想的话可以先查询到用户上传的所有图片，然后前端再做数组便利，将这些图片分组。那再数据量很大的时候又该怎么处理呢？
`mongodb`有提供一个`aggregate`方法，就是用来应对这种分组查询的。

### 数据准备

假设现在有一张名叫`histories`的表，它的数据结构如下，点击[这里](http://ouizhbgin.bkt.clouddn.com/blog/2017/11/06/mongo_history_data.json)下载全部数据：

```json
{
  "_id": ObjectId("59ffb36d662314030cdad763"),
  "filename": "1509929837131.png",
  "old_filename": "mysql_system_path.PNG",
  "filesize": "1509929837.126",
  "userid": ObjectId("59f7d33009bcb137983415f6"),
  "tmp_url": "D:\\PROJECT\\ldk-upload-img\\uploads\\upload_1053904e8f5135f8641505a9f5c5ef72.PNG",
  "remote_url": "http://oyh0gj8ht.bkt.clouddn.com/1509929837131.png",
  "time": ISODate("2017-11-05T00:57:17.228Z"),
  "__v": 0
}
```

我们要做的就是查找出`useri`d 为`“59f7d33009bcb137983415f6”`的用户每一天上传了那些图片，也就是`old_filename`和`remote_url`这两个字段。

### 学习 aggregate

先来学习聚合常用的操作：

* `$project`：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
* `$match`：用于过滤数据，只输出符合条件的文档。`$match`使用`MongoDB`的标准查询操作。
* `$limit`：用来限制`MongoDB`聚合管道返回的文档数。
* `$skip`：在聚合管道中跳过指定数量的文档，并返回余下的文档。
* `$unwind`：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
* `$group`：将集合中的文档分组，可用于统计结果。
* `$sort`：将输入文档排序后输出。
* `$geoNear`：输出接近某一地理位置的有序文档

然后浏览下聚合一些常用的表达式

* `$sum` 计算总和统计每个用户上传图片数量总数

```mongo
> db.histories.aggregate([{$group : {_id : "$userid", upload_num : {$sum : 1}}}])
{ "_id" : ObjectId("59f8600b06445e4780bb0a69"), "upload_num" : 6 }
{ "_id" : ObjectId("59f7d33009bcb137983415f6"), "upload_num" : 2 }
```

统计每个用户上传图片的总大小

```mongo
> db.histories.aggregate([{$group : {_id : "$userid", upload_num : {$sum : "$filesize"}}}])
{ "_id" : ObjectId("59f8600b06445e4780bb0a69"), "upload_num" : 10569636779.855999 }
{ "_id" : ObjectId("59f7d33009bcb137983415f6"), "upload_num" : 3019860521.908 }
```

* `$avg` 计算平均值统计每个用户上传图片平均大小，这个有些无聊>\_<

```mongo
> db.histories.aggregate([{$group : {_id : "$userid", upload_num : {$avg : "$filesize"}}}])
{ "_id" : ObjectId("59f8600b06445e4780bb0a69"), "upload_num" : 1509948111.4079998 }
{ "_id" : ObjectId("59f7d33009bcb137983415f6"), "upload_num" : 1509930260.954 }
```

* `$max`和`$min` 取得最大值和最小值计算得到用户所有上传历史里文件大小最大和最小的数值

```mongo
> db.histories.aggregate([{$group : {_id : "$userid", upload_max : {$max : "$filesize"}, upload_min : {$min : "$filesize"}}}])
{ "_id" : ObjectId("59f8600b06445e4780bb0a69"), "upload_max" : 1509951997.92, "upload_min" : 1509947349.678 }
{ "_id" : ObjectId("59f7d33009bcb137983415f6"), "upload_max" : 1509930684.782, "upload_min" : 1509929837.126 }
```

* `$push` 很重要的一个计算表达式，比如我要统计用户每天内上传了那些图片

```mongo
> db.histories.aggregate([
   {
     $project: {
       day: {
           $substr: [{ "$add": ["$time", 28800000] }, 0, 10]
       },
       "old_filename": 1,
       "remote_url": 1
     }
   },
   {
     $group: {
       _id: "$day",
       "upload_arr": { $push: { name: "$old_filename", link: "$remote_url" } }
     }
   }
 ])
```

`$project`就是定义会有那些字段参与到统计，中途可以创建全新的字段，或者对字段做格式化，比如为了拿到某一天的日期，我们需要将原本以 UTC 格式的存储的时间字段$time 加上`8*60*60*1000`毫秒就是 8 天的时间，这样时间就变成了北京时间。然后使用`$substr`操作截取字段的前 11 位，比如`"2017-11-06 15:28:00"`就变成了`"2017-11-06"`。另外由于在最终的统计结果中用到了文件名`old_filename`，以及远程地址`remote_url`，所以我们需要在`$project`中将它的值设置为 1，表示它需要被保留。在$group 中就可以对保留下来的数据做分组处理，\_id 是定义根据什么来分组，这里显然是根据时间，也就是新生成的 day 字段，最后新建一个 upload_arr 字段，用来保存所有在这一天内的上传的图片的信息。这下你明白`$push`的作用了吧，就是在结果文档中插入值到一个数组中。结果如下：

```json
{
  "_id": "2017-11-06",
  "upload_arr": [
      {"name": "mysql_system_path.PNG","link": "http://oyh0gj8ht.bkt.clouddn.com/1509930684790.png"},
      {"name": "github.PNG","link": "http: //oyh0gj8ht.bkt.clouddn.com/1509947349681.png"},
      {"name": "mysql_start.png","link": "http://oyh0gj8ht.bkt.clouddn.com/1509947447592.png"},
      {"name": "mysql_system_path.PNG","link": "http: //oyh0gj8ht.bkt.clouddn.com/1509947455689.png"},
      {"name": "Capture.jpg","link": "http://oyh0gj8ht.bkt.clouddn.com/1509947466105.jpg"},
      {"name": "andyliwr-ftp.png","link": "http://oyh0gj8ht.bkt.clouddn.com/1509947471882.png"},
      {"name": "post20170912_01.png","link": "http://oyh0gj8ht.bkt.clouddn.com/1509947591007.png"},
      {"name": "check.png","link": "http: //oyh0gj8ht.bkt.clouddn.com/1509951997921.png"
    }
  ]
},
{
  "_id": "2017-11-05",
  "upload_arr": [{"name": "mysql_system_path.PNG","link": "http://oyh0gj8ht.bkt.clouddn.com/1509929837131.png"}]
}
```

* 其他一些表达式：

1.  `$addToSet`, 在结果文档中插入值到一个数组中，但不创建副本。
2.  `$first`，根据资源文档的排序获取第一个文档数据。
3.  `$last`，根据资源文档的排序获取最后一个文档数据。

哎，当时没有时间去研究聚合查询，否则她说的那个`mongo`查询一堆数据最早时间和最晚时间解决起来不是分分钟的事情？我知道自己一直不够优秀，所以才会想要努力变得强大，你会相信我可以做到吗?

最后贴下我的最终代码：

```mongo
.aggregate([
  {
    $match: {
        "userid": ObjectId("59f7d33009bcb137983415f6")
    }
  },
  {
    $project: {
      day: {
          $substr: [{ "$add": ["$time", 28800000] }, 0, 10]
      },
      "old_filename": 1,
      "remote_url": 1
    }
  },
  {
    $group: {
      _id: "$day",
      "upload_arr": { $push: { name: "$old_filename", link: "$remote_url" } }
    }
  }
])
```
