<template>
  <div class="reloadbox">
    <div class="content">
      <div class="top">
        <img src="../../images/common/empty_failed@2x.png" alt="">
        <p>{{content}}</p>
      </div>
      <div class="btn-box">
        <span class="reload" @click="clickReload">重新加载</span>
        <span class="back" @click="backPage">返回</span>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'reloadbox',
    props:{
      content:{
        type:String,
        default:'网络出错了，请点击按钮重新加载！'
      }
    },
    methods:{
      clickReload:function(){
        this.$emit('clickReload');
      },
      backPage:function(){
        this.$emit('backPage');
      }
    }
  }

</script>
<style>
  .reloadbox {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
    z-index: 300;
  }
  .reloadbox .content{
    position: absolute;
    width: 100%;
    top: 50%;
    transform:translateY(-50%);
  }
  .reloadbox .top{
    text-align: center;
  }
  .reloadbox img{
    display: inline-block;
    width: 2rem;
  }
  .reloadbox p{
    line-height: 0.6rem;
    color: #B5B5B5;
    font-size: 0.28rem;
    padding-bottom: 0.2rem;
  }
  .reloadbox .btn-box{
    font-size: 0;
    text-align: center;
    margin-top: 0.8rem;
  }
  .reloadbox .btn-box span{
    display: inline-block;
    border: 1px solid #acacac;
    width: 2.4rem;
    font-size: 0.32rem;
    line-height: 0.7rem;
    border-radius: 0.1rem;
    text-align: center;
    color: #848484;
  }
  .reloadbox .btn-box .reload{
    margin-right: 0.4rem;
  }
</style>
