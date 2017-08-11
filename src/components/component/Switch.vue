<template>
  <div class="switch-btn">
    <div class="switch-btn-box">
      <input type="checkbox" :id="id" style="display:none;" v-model="check">
      <label :for="id" :class="check ? 'true' : 'false'"></label>
    </div>
  </div>
</template>
<script>
  export default{
    name:'switch',
    data(){
      return {
        check:false
      }
    },
    props:['id','default'],
    watch:{
      check:function(val,oldval){
        this.$emit('showSelectedItem',val);
      }
    },
    created:function(){
      this.check = this.default;
    }
  }
</script>
<style>
  .switch-btn{
    width: 45px;
    height: 26px;
  }
  .switch-btn  label{
    display: inline-block;
    width: 45px;
    height: 26px;
    position: relative;
    border-radius: 13px;
    background:#3a83d7;
    transition: all 0.5s;
    font-size: 12px;
    border: 1px solid #d7d7d7;
  }
  .switch-btn  label.true{
    background:#3a83d7;
  }
  .switch-btn  label.false{
    background: #fff;
  }
  .switch-btn{
    font-size: 0;
  }
  .switch-btn label:before{
    transition: all 0.5s;
    content:' ';
    display: inline-block;
    position: absolute;
    height: 26px;
    width: 26px;
    border-radius: 50%;
    top: 50%;
    transform:translate(20px,-50%);
    background-color: #fff;
    z-index: 2;
    border: 1px solid #d7d7d7;
    box-sizing: border-box;
  }
  .switch-btn label.true:before{
     transform:translate(20px,-50%);
  }
  .switch-btn label.false:before{
     transform:translate(-1px,-50%)
  }
</style>
