<template>
  <div class="alertcontent" :class="{'alertcontent-active':is_show}">
    <div class="content" v-html="content">
    </div>
    <span class="close" @click="closeAlertContent"></span>
  </div>
</template>

<script>
  export default{
    name:'alertcontent',
    props:{
      content:{
        type:String
      },
      is_show:{
        type:Boolean
      }
    },
    methods:{
      closeAlertContent:function(){
        document.querySelector('.alertcontent .content').scrollTop = 0;
        this.$emit('closeAlertContent')
      }
    }
  }
</script>

<style>
  .alertcontent{
    position:fixed;
    top:1.36rem;
    bottom:1.4rem;
    width:6.9rem;
    left:0.3rem;
    border-radius:0.1rem;
    background: #fff;
    border:1px solid #d7d7d7;
    padding:0.1rem 0.3rem;
    box-sizing:border-box;
    z-index:903;
    font-size: 0.28rem;
    transition: all 0.5s linear;
    transform: translate3d(0,-800px,0);
  }
  .alertcontent-active{
    transform: translate3d(0,0,0);
  }
  .alertcontent .content{
    overflow-y:auto;
    height:100%;
  }
  .alertcontent .close{
    position: absolute;
    top: -0.2rem;
    right: -0.2rem;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: url(../../images/close.png) no-repeat center center;
    background-size: contain;
    background-color: #fff;
    z-index: 200;
  }
</style>
