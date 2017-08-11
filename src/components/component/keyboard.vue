<template>
  <transition name="slideboard">
    <div class="keyboard">
      <h1 class="top">加密传输 保障安全<span class="complete" @click="closeKeyBoard">完成</span></h1>
      <div class="item-box" @click="clickKeyBoard">
        <div class="item" style="border-left:none;">1</div>
        <div class="item">2</div>
        <div class="item" style="border-right:none;">3</div>
        <div class="item" style="border-left:none;">4</div>
        <div class="item">5</div>
        <div class="item" style="border-right:none;">6</div>
        <div class="item" style="border-left:none;">7</div>
        <div class="item">8</div>
        <div class="item" style="border-right:none;">9</div>
        <div class="item" style="color: #f64d54;border-left:none;border-bottom:none;background-color:#e9e8e8;font-size:16px;">安全输入</div>
        <div class="item" style="border-bottom:none;">0</div>
        <div class="item" style="border-right:none;border-bottom:none;text-indent:-9999px;">删除</div>
      </div>
    </div>
  </transition>
</template>
<script>
  import bus from '../../bus'
  import fastclick from 'fastclick'

  export default {
    name: 'keyboard',
    data() {
      return {

      }
    },
    methods: {
      clickKeyBoard: function (event) {
        if(event.target.innerText.length>2) return false;
        this.$emit('clickKeyBoard', event.target.innerText);
      },
      closeKeyBoard: function () {
        this.$emit('closeKeyBoard');
      }
    },
    created: function () {
      document.body.addEventListener('touchstart', function () {});
    }
  }

</script>
<style>
  .keyboard {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    user-select: none;
    background: #eee;
  }
  .slideboard-enter-active,
  .slideboard-leave-active {
    transition: all 0.5s;
  }

  .slideboard-enter,
  .slideboard-leave-active {
    bottom: -300px;
  }

  .keyboard .top {
    font-size: 16px;
    text-align: center;
    color: #f64d54;
    line-height: 45px;
    border-top: 1px solid #d7d7d7;
    border-bottom: 2px solid #d7d7d7;
    background-color: #f8f8f8;
    box-sizing: border-box;
  }

  .keyboard .top .complete {
    color: #333;
    position: absolute;
    right: 10px;
  }

  /*.item-box {
    width: 100%;
    background-color: #eee;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
  }

  .item-box .item {
    box-sizing: border-box;
    background-color: #fff;
    flex: 0 0 33.3%;
    height: 48px;
    text-align: center;
    font-size: 18px;
    border: 2px solid #d8dcdf;
    line-height: 48px;
    position: relative;
  }*/
  .item-box {
    width: 100%;
    background-color: #d8dcdf;
    display: block;
    font-size: 0;
  }

  .item-box .item {
    box-sizing: border-box;
    background-color: #fff;
    display: inline-block;
    width: 33.3%;
    height: 48px;
    text-align: center;
    font-size: 18px;
    border: 2px solid #d8dcdf;
    line-height: 48px;
    position: relative;
  }
  .item-box .item::before {
    content: '';
    display: block;
    position: absolute;
    top: -60px;
    background: #fff;
    border: 1px solid #d7d7d7;
    border-radius: 3px;
    width: 100%;
    height: 100%;
    display: none;
    font-size: 30px;
  }

  .item-box .item:nth-child(1):before {
    content: '1';
  }

  .item-box .item:nth-child(2):before {
    content: '2';
  }

  .item-box .item:nth-child(3):before {
    content: '3';
  }

  .item-box .item:nth-child(4):before {
    content: '4';
  }

  .item-box .item:nth-child(5):before {
    content: '5';
  }

  .item-box .item:nth-child(6):before {
    content: '6';
  }

  .item-box .item:nth-child(7):before {
    content: '7';
  }

  .item-box .item:nth-child(8):before {
    content: '8';
  }

  .item-box .item:nth-child(9):before {
    content: '9';
  }

  .item-box .item:nth-child(11):before {
    content: '0';
  }

  .item-box .item:nth-child(12):before {
    background: url('../../images/backspace.png') no-repeat center center;
    background-size: 22px 45px;
    background-color: #fff;
  }

  .item-box .item:active {
    background-color: #e9e8e8;
  }

  .item-box .item:active:before {
    display: block;
  }

  .item-box .item:nth-child(10):before {
    display: none;
  }

  .item-box .item:last-child {
    background: url('../../images/backspace.png') no-repeat center center;
    background-size: 15px 30px;
    background-color: #fff;
  }

  .item-box .item:last-child:active {
    background-color: #e9e8e8;
  }

</style>
