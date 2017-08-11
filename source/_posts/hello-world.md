---
title: Hello World
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

``` bash
var startDate = new Date('2017/07/07') // 活动开始时间
var endDate = new Date('2017/09/08') // 活动结束时间
var endDateTime = endDate.getTime()
var startDateTime = startDate.getTime()
var userid = ''
var username = ''
var token = ''
var shareConfig = {
  url: 'http://khtest.10jqka.com.cn/dev/lidikang/yiwan_mncg_pc/apply.html',
  mUrl: 'http://ozone.10jqka.com.cn/tg_templates/doubleone/2017/kh/yiyuan_mncg/m/share.html',
  title: '零成本模拟炒股，盈利就分钱，万元现金上不封顶。',
  content: '我在同花顺参加亿元模拟炒股大赛，零成本、零风险，盈利就可瓜分100万元现金奖励，一起来吧！',
  imageUrl: 'http://khtest.10jqka.com.cn/dev/lidikang/gpkh_user_avatar.jpg'
}
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/deployment.html)
