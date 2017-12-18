---
title: mysql查询的小心得
date: 2017-11-08 15:26:51
tags:
  - 数据库
---
### 前言
最近在公司做一个日志统计的小后台，在拿到混乱的日志之后，将日志分解并储存到MySQL中。这一步起始早早就完成了，接下来是使用koa新建接口，对数据库做增删查改。下面记录下自己在使用mysql查询的遇到的一些问题。

#### MySQL如何对表中数据进行分组
需求是这样的，有一个记录日志表--logs，以及一个记录用户的表user，在logs中有一个外键指向user表的id字段。现在需要查找logs表并对users表的手机号码---mobile_tel进行去重。同时拿到user和logs表中的数据就需要使用到join，去重需要用到分组group by
group by意思就是将查询结果按照1个或多个字段进行分组，字段值相同的为一组。可用于单个字段分组，也可用于多个字段分组。
#### 表结构
**user表**
```SQL
CREATE TABLE IF NOT EXISTS `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` CHAR(10) NOT NULL,
    `mobile_tel` CHAR(11) NOT NULL UNIQUE,
    `utime` DATETIME NOT NULL,
    `dtime` DATETIME,
    UNIQUE `user_mobile_tel_unique` (`mobile_tel`),
    PRIMARY KEY (`id`)
)  ENGINE=INNODB;
```
**logs表**
device是一个设备表
```SQL
CREATE TABLE IF NOT EXISTS `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aip` CHAR(15),
    `qsid` CHAR(10) NOT NULL,
    `cannel` CHAR(10),
    `atime` DATETIME NOT NULL,
    `system_version` CHAR(10) NOT NULL,
    `app_version` CHAR(10) NOT NULL,
    `utime` DATETIME NOT NULL,
    `dtime` DATETIME,
    `user_id` INTEGER,
    `device_id` INTEGER,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`device_id`)
        REFERENCES `device` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
)  ENGINE=INNODB;
```
根据mobile_tel分组查询所有的log
```SQL
SELECT * FROM logs
  INNER JOIN user ON user.id = logs.user_id
  GROUP BY user.mobile_tel
```
得到的结果如下：
![分组查询](http://fs.andylistudio.com/1510133197210.png)
由于新装的mysql默认的sql_mode是加上了ONLY_FULL_GROUP_BY，意思就是说对于GROUP BY聚合操作，如果在SELECT中的列，没有在GROUP BY中出现，那么这个SQL是不合法的。
```sql
ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'test.tt.count' which is 
not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
```
关于MySQL到底设置ONLY_FULL_GROUP_BY好，还是不设置好，可以参考[这篇博客](http://www.ywnds.com/?p=8184)
因为确实需要用到NO_FULL_GROUP_BY分组查询，所以需要在数据库中设置下sql_mode：
```sql
# mysql命令行模式
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```
这样做有个缺陷，每次服务器重启或者电脑重启都需要重新设置。本来也想设置到mysql的配置文件里的，但是设置之后发现mysql不能启动了。这一点我也没找到很好的解决方案。

#### SQL日期格式化函数
当一个表存在日期的时候，通常取出来的时候都需要做些格式化，如何在SQL做格式化呢？将日期转变成年月日的形式，2017/11/10 16:16:00 变成 2017/11/10
```
SELECT DATE(h5log.logs.atime) AS atime FROM h5log.logs
```
或者使用DATE_FORMAT
```
SELECT DATE_FORMAT(h5log.logs.utime, '%Y-%d-%m %H:%i:%S') AS utime FROM h5log.logs
```
具体怎么使用请参考[这篇文章](http://www.w3school.com.cn/sql/sql_dates.asp)

#### 如何做每个分类的次数统计
需求如下：需要统计每个错误出现的次数，以及他们各自的占比。起始在错误出现次数不是很多的情况下，先取出所有的数据，然后使用循环做统计完全可以。但是这里我介绍一种直接使用SQL做统计的方法---使用SQL的条件语句WHILE-THEN
```sql
SELECT 
SUM(CASE WHEN error_id = 1 THEN 1 ELSE 0 END) AS 'error1',
SUM(CASE WHEN error_id = 2 THEN 1 ELSE 0 END) AS 'error2',
SUM(CASE WHEN error_id = 3 THEN 1 ELSE 0 END) AS 'error3',
....
SUM(CASE WHEN error_id = n THEN 1 ELSE 0 END) AS 'errorn',
SUM(1) AS 'total'
FROM h5log.user_action
	INNER JOIN h5log.logs ON h5log.user_action.log_id = h5log.logs.id
WHERE h5log.logs.qsid = 100
```
这样通过一次查询就可以得到所以错误出现的次数以及错误出现的总次数，得到结果后再写些除法的代码就能得到各种错误的占比了。

#### sequelizejs如何执行原生的js
使用sequelize.query方法，后面需要带上{ type: sequelize.QueryTypes.SELECT }参数，否则query每次返回结果就是一个数组，数据里的第一项才是我们需要的结果。
```js
(async function(){}(
    let errors = await sequelize.query("SELECT * from h5log.result WHERE type = 0", { type: sequelize.QueryTypes.SELECT })
))
```
#### 参考资料
[MySql版本问题sql_mode=only_full_group_by的完美解决方案](http://www.jb51.net/article/118538.htm)
[分组查询用法](http://www.cnblogs.com/snsdzjlz320/p/5738226.html)
