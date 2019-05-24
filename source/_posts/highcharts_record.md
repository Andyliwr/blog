---
layout: post
title: 使用highcharts的一些心得
comments: true
tags:
  - 同花顺
  - highcharts
photos:
  - 'https://img.vim-cn.com/a5/165eb2ff596acadc27c34b748b6281253cde22.png'
date: 2019-05-05 10:15:06
updated: 2019-05-05 10:15:06
---

### 前言
运营平台的后台需要画几个关于统计的图表，看了下晚上的方案，最好的就是`highcharts`和`echarts`，听闻别人讲`echarts`体积还是有点大，不如`highcharts`来得轻巧，外加之前自己也使用`过highcharts`，对于它超级细化的配置还是印象很深刻的，所以最终决定使用`highcharts`来实现我的功能。可是之前都没有总结，再次使用起`highcharts`依旧需要翻看API文档，这篇文章重点不在于详细介绍`highcharts`每个配置的含义，而是讲解使用`highcharts`可以从什么地方快速获取资源。

### 资源网站
+ [highcharts API文档](https://api.highcharts.com/highcharts/)
+ [highcharts 常见demo](https://www.highcharts.com/demo)
+ [highcharts地图数据](https://www.highcharts.com.cn/mapdata)

### 折线图
使用highcharts画折线图，核心在于定义好options的series和xAxis，
```js option.js
import moment from 'moment';

const hours = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
  '24:00',
];
const prefix = moment().format('YYYY-MM-DD');

export default {
  chart: {
    scrollablePlotArea: {
      minWidth: 700,
    },
  },

  title: {
    text: '',
  },

  subtitle: {
    text: '',
  },

  xAxis: {
    type: 'datetime',
    labels: {
      align: 'left',
      x: 3,
      y: -3,
      formatter() {
        return this.value && this.value.split(' ').length > 1 ? this.value.split(' ')[1] : '未知时间';
      },
      style: { position: 'relative', top: '10px' },
    },
    title: {
      text: '时间段',
      style: {
        color: '#666666',
        fontSize: '12px',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    },
    className: 'x-axis',
    categories: hours.map(item => `${prefix} ${item}`),
  },

  yAxis: [
    {
      title: {
        text: null,
      },
      labels: {
        align: 'left',
        x: 3,
        y: 16,
        format: '{value:.,0f}',
      },
      showFirstLabel: false,
      index: 0,
    },
  ],

  legend: {
    align: 'center',
    verticalAlign: 'top',
    borderWidth: 0,
  },

  tooltip: {
    shared: true,
    crosshairs: [true, true],
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderRaduis: 4,
    shadow: true,
    useHTML: true,
    formatter() {
      let content = `<p>${this.x && this.x.split(' ').length > 1 ? this.x.split(' ')[1] : '未知时间'}</p>`;
      const names = ['新增用户数', '浏览用户数', '浏览次数'];
      this.points.forEach((item, index) => {
        const name = names[index];
        content += `<p style="overflow: hidden; width: 168px; line-height: 1.6em; padding: 0; margin: 0"><span style="float: left"><span style="display: inline-block; width: 6px; height: 6px; border-radius: 3px; background: ${
          item.color
        }; margin-right: 8px; vertical-align: middle"></span>${name}</span><span style="float: right">${item.y.toLocaleString(
          'en-US'
        )}</span></p>`;
      });
      return content;
    },
  },

  plotOptions: {
    series: {
      cursor: 'pointer',
      marker: {
        lineWidth: 1,
      },
      animation: false,
      dataLabels: {
        enabled: true,
        format: '{point.label}',
      },
      states: {
        inactive: {},
      },
    },
  },

  series: [
    {
      name: '新增用户数',
      turboThreshold: 0,
      _colorIndex: 0,
      _symbolIndex: 0,
      lineWidth: 1,
      dashStyle: 'Solid',
      color: '#1890ff',
      data: [
        43934,
        52503,
        57177,
        69658,
        97031,
        119931,
        137133,
        154175,
        43934,
        52503,
        57177,
        69658,
        97031,
        119931,
        137133,
        154175,
        43934,
        52503,
        57177,
        69658,
        97031,
        119931,
        137133,
        154175,
      ],
    },
    {
      name: '浏览用户数',
      turboThreshold: 0,
      _colorIndex: 1,
      _symbolIndex: 0,
      lineWidth: 1,
      color: '#faad14',
      data: [
        24916,
        24064,
        29742,
        29851,
        32490,
        30282,
        38121,
        40434,
        24916,
        24064,
        29742,
        29851,
        32490,
        30282,
        38121,
        40434,
        24916,
        24064,
        29742,
        29851,
        32490,
        30282,
        38121,
        40434,
      ],
    },
    {
      name: '浏览次数',
      turboThreshold: 0,
      _colorIndex: 2,
      _symbolIndex: 0,
      lineWidth: 1,
      color: '#52c41a',
      data: [
        null,
        null,
        7988,
        12169,
        15112,
        22452,
        34400,
        34227,
        7988,
        12169,
        15112,
        22452,
        34400,
        34227,
        7988,
        12169,
        15112,
        22452,
        34400,
        34227,
        7988,
        12169,
        15112,
        22452,
        34400,
        34227,
      ],
    },
  ],
};
```

### 结束
如果你有更好的建议或者困惑的地方，都可以发送邮件到我的邮箱 - [andyliwr@outlook.com](andyliwr@outlook.com)
