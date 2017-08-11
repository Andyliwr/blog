<template>
  <transition name="fade">
  <div class="indicator">
    <div class="loadding">
      <div class="loadding-icon">
      </div>
      <div class="loadding-text">
        加载中...
      </div>
    </div>
    <div class="opacity-mask"></div>
  </div>
  </transition>
</template>
<script>
  export default{
    name:'indicator',
  }
</script>
<style>
   .loadding{
     width: 90px;
     height: 100px;
     background: rgb(0, 0, 0);
     opacity: 0.7;
     position: fixed;
     top: 50%;
     left: 50%;
     transform: translate3d(-50%,-50%,0);
     text-align: center;
     border-radius: 5px;
     z-index: 501;
   }
   .loadding-icon{
     border: 4px solid #fff;
     height: 24px;
     width: 24px;
     border-radius: 50%;
     border-left: 4px solid rgba(0, 0, 0, 0);
     animation: rotate  1s linear infinite;
     margin: 15px auto 15px;
   }
   @keyframes rotate{
     0%{
       transform: rotate(0deg);
     }
     100%{
       transform: rotate(360deg);
     }
   }
   .loadding-text{
     color: #fff;
     font-size: 16px;
   }
   .opacity-mask{
     position: fixed;
     right: 0;
     top:0;
     left: 0;
     bottom: 0;
     background: rgba(0, 0, 0, 0);
     z-index:500;
   }
  </style>
