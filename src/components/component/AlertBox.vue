<template>
  <transition name="scale">
    <div class="alertbox">
      <h2 class="alert-box-title">{{title}}</h2>
      <div class="alert-box-content" :class="{left:content.length>1}">
        <p v-for="item in content" v-html="item"></p>
      </div>
      <div class="alert-box-btn" @click="closeAlertBox">
        {{btn}}
      </div>
    </div>
  </transition>
</template>
<script>
  import tools from '../../tools'
  import router from '../../router'
  export default {
    name: 'alertbox',
    data() {
      return {}
    },
    props: {
      is_show_alertbox:{
        type:Boolean
      },
      title: {
        type: String,
        default: '提示'
      },
      content: {
        type: Array,
      },
      btn: {
        type: String,
        default:'确定'
      }
    },
    methods: {
      closeAlertBox: function () {
        this.$emit('closeAlertBox');
      }
    }
  }

</script>

<style>
  .alertbox {
    border-radius: 0.15rem;
    width: 6.9rem;
    background: #fff;
    overflow: hidden;
    z-index: 1000;
  }

  .alert-box-title {
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.36rem;
    font-weight: bold;
    border-bottom: 1px solid #d7d7d7;
  }

  /*.alert-box-title .alert-close {
    display: inline-block;
    height: 0.48rem;
    width: 0.48rem;
    position: absolute;
    background: url(../../images/close.png) no-repeat;
    background-size: 100%;
    right: 0.2rem;
    top: 0.1rem;
  }*/

  .alert-box-content {
    padding: 0.3rem 0.2rem;
    text-align: center;
    font-size: 0.32rem;
    color: #666;
  }
  .left{
    text-align: left;
  }
  .alert-box-btn {
    padding: 0.2rem 0;
    text-align: center;
    font-size: 0.36rem;
    border-top: 1px solid #d7d7d7;
    background-color: #3a83d7;
    color: #efefef;
    overflow: hidden;
  }

  /*.alert-box-btn .alert-box-btn-item {
    flex: 1;
    text-align: center;
    font-size: 0.36rem;
    color: #666;
    box-sizing: border-box;
    height: 0.8rem;
  }*/

  /*.alert-box-btn .alert-box-btn-item:nth-child(1) {
    background-color: #3a83d7;
    color: #efefef;
  }

  .alert-box-btn .alert-box-btn-item:nth-child(2) {
    border-left: 1px solid #d7d7d7;
  }*/

   .scale-enter-active,
  .scale-leave-active {
    transition: all 0.5s;
  }
  
  .scale-enter,
  .scale-leave-active {
    opacity: 0;
    transform: scale(0.8, 0.8);
  }
  .tel{
    color: #3a83d7;
    text-decoration: none;
  }

</style>
