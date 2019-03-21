---
layout: post
title: React实现一个可拖拽改变宽度的滚动区域
comments: true
tags:
  - default
photos:
  - 'https://img.vim-cn.com/59/d7f8814d0f67906eee5ab7c3e0a2ee00bb2f26.jpg'
date: 2019-03-21 21:52:30
updated: 2019-03-21 21:52:30
---

### 前言

工作中有个项目需要使用react实现一个可拖拽改变大小的试图，这里记录下如何实现的

### 实现代码

```jsx
import React, { Component } from 'react';
import _ from 'underscore';
import IconFont from '@/components/IconFont/IconFont';
import styles from './ResizeDiv.less';

/**
 * 获取元素的偏移信息
 */
function getEleOffset(ele) {
  if (!ele) {
    return {
      clientTop: 0,
      clientLeft: 0,
      height: 0,
      width: 0,
    };
  }
  let clientTop = ele.offsetTop;
  let clientLeft = ele.offsetLeft;
  let current = ele.offsetParent;
  while (current !== null) {
    clientTop += current.offsetTop;
    clientLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return {
    clientTop,
    clientLeft,
    height: ele.offsetHeight,
    width: ele.offsetWidth,
  };
}

// 可调整宽高的Div
export default class ResizeDiv extends Component {
  state = {
    isHResize: false,
    isVResize: false,
    hNum: 100,
    vNum: 300,
    hNumLimit: 30,
    vNumLimit: 30,
  };

  resizeOffsetInfo = {
    clientTop: 0,
    clientLeft: 0,
  };

  leftHeight = 0;

  containerWidth = 0;

  componentDidMount() {
    this.initResizeInfo();
    const throttled = _.throttle(() => {
      this.initResizeInfo();
    }, 200);

    window.onresize = throttled;
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  /**
   * 初始化resize信息
   */
  initResizeInfo = () => {
    const hEle = document.getElementById('h_resize_container');
    const { vNum, hNum, hNumLimit, vNumLimit } = this.state;
    this.resizeOffsetInfo = getEleOffset(hEle);
    this.leftHeight = hEle.offsetHeight;
    this.containerWidth = document.getElementById('v_resize_container').offsetWidth;

    if (hEle.offsetHeight - hNum < hNumLimit) {
      this.setState({
        hNum: hEle.offsetHeight - hNumLimit,
      });
    }
    if (this.containerWidth - vNum < vNumLimit) {
      this.setState({
        vNum: this.containerWidth - vNumLimit,
      });
    }
  };

  /**
   * 开始拖动水平调整块
   */
  hResizeDown = () => {
    this.setState({
      isHResize: true,
    });
  };

  /**
   * 拖动水平调整块
   */
  hResizeOver = e => {
    const { isHResize, hNum, hNumLimit } = this.state;
    if (isHResize && hNum >= hNumLimit && this.resizeOffsetInfo.height - hNum >= hNumLimit) {
      let newValue = this.resizeOffsetInfo.clientTop + this.resizeOffsetInfo.height - e.clientY;
      if (newValue < hNumLimit) {
        newValue = hNumLimit;
      }
      if (newValue > this.resizeOffsetInfo.height - hNumLimit) {
        newValue = this.resizeOffsetInfo.height - hNumLimit;
      }
      this.setState({
        hNum: newValue,
      });
    }
  };

  /**
   * 开始拖动垂直调整块
   */
  vResizeDown = () => {
    this.setState({
      isVResize: true,
    });
  };

  /**
   * 拖动垂直调整块
   */
  vResizeOver = e => {
    const { isVResize, vNum, vNumLimit } = this.state;
    if (isVResize && vNum >= vNumLimit && this.containerWidth - vNum >= vNumLimit) {
      let newValue = e.clientX - this.resizeOffsetInfo.clientLeft;
      if (newValue < vNumLimit) {
        newValue = vNumLimit;
      }
      if (newValue > this.containerWidth - vNumLimit) {
        newValue = this.containerWidth - vNumLimit;
      }
      this.setState({
        vNum: newValue,
      });
    }
  };

  /**
   * 只要鼠标松开或者离开区域，那么就停止resize
   */
  stopResize = () => {
    this.setState({
      isHResize: false,
      isVResize: false,
    });
  };

  render() {
    const { isVResize, vNum } = this.state;
    const vCursor = isVResize ? 'col-resize' : 'default';
    const vColor = isVResize ? '#ddd' : '#fff';

    return (
      <div className={styles.container} onMouseUp={this.stopResize} onMouseLeave={this.stopResize}>
        <div id="v_resize_container" className={styles.content} onMouseMove={this.vResizeOver}>
          <div
            id="h_resize_container"
            style={{ width: vNum, cursor: vCursor }}
            className={styles.left}
            onMouseMove={this.hResizeOver}
          >
            'left area'
          </div>
          <div
            style={{ left: vNum, backgroundColor: vColor }}
            draggable={false}
            onMouseDown={this.vResizeDown}
            className={styles['v-resize']}
          >
            <IconFont className={styles['icon-equal']} type="icon-equal" />
          </div>
          <div style={{ marginLeft: vNum + 12, cursor: vCursor }} className={styles.right}>
            'right area'
          </div>
        </div>
      </div>
    );
  }
}

```

```css
.container {
  overflow: hidden;
}

.content {
  height: calc(100vh - 104px);
  position: relative;
  background: #ffffff;
}

.left {
  width: 300px;
  height: 100%;
  float: left;
  position: relative;
}

.h-resize {
  height: 4px;
  width: 100%;
  background: #fff;
  position: absolute;
  bottom: 100px;
  z-index: 1;
  cursor: row-resize;
  user-select: none;
}

.v-resize {
  height: 100%;
  width: 12px;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  position: absolute;
  background: #fff;
  left: 500px;
  z-index: 2;
  cursor: col-resize;
  user-select: none;
  text-align: center;
}

.v-resize .icon-equal {
  line-height: calc(100vh - 104px);
  font-size: 12px;
}

.right {
  margin-left: 504px;
  background-color: #f8f9fa;
  height: 100%;
  box-sizing: border-box;
}
```

### 结束

如果你有更好的建议或者困惑的地方，都可以发送邮件到我的邮箱 - [andyliwr@outlook.com](andyliwr@outlook.com)
