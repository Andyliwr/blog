<template>
  <div  :class="next? 'nextstep-on' : 'nextstep'" @click="nextstep">
    <span>{{text}}</span>
  </div>
</template>
<script>
  export default {
    name: 'nextstep',
    data() {
      return {}
    },
    props: ['next','text'],
    methods:{
      nextstep:function(){
        this.$emit('goNext');
      }
    }
  }

</script>
<style>
  .nextstep-on {
    width: 6.9rem;
    height: 0.8rem;
    background-color: #3a83d7;
    line-height: 0.8rem;
    border-radius: 0.1rem;
    text-align: center;
    margin: 0.6rem auto 0.3rem;
    border: 1px solid #3a83d7;
    font-size: 0.36rem;
    color: #fefefe;
  }
  
  .nextstep {
    width: 6.9rem;
    height: 0.8rem;
    background-color: #fff;
    color: #999;
    border: 1px solid #d7d7d7;
    line-height: 0.8rem;
    border-radius: 0.1rem;
    text-align: center;
    margin: 0.6rem auto 0.3rem;
    font-size: 0.36rem;
  }

</style>
