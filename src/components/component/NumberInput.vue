<template>
  <div class="numberinput">
    <label class="input-title">{{labeltitle}}</label><input type="text" :placeholder="placeholder" readonly="true" v-model="input_text" @click = "Input" :class="{focus:isfocus}" v-if="!ispassword"><input type="password" :placeholder="placeholder" readonly="true" v-model="input_text" @click = "Input" :class="{focus:isfocus}" v-if="ispassword"><span class="icon-close" v-if="isfocus" @click = "clearInputValue"></span>
  </div>
</template>
<script>
  export default {
    name: 'numberinput',
    props: ['labeltitle', 'placeholder', 'value','isfocus','ispassword',],
    data(){
      return{
        input_text:this.value,
      }
    },
    methods:{
      clearInputValue:function(){
        this.$emit('clearInputValue');
      },
      Input:function(){
        this.$emit('Input');
      }
    },
    watch:{
      value:function(val,oldval){
        this.input_text = val;
      },
      input_text:function(val,oldval){
        this.$emit('showInputText',val);
      }
    }
  }
  
</script>
<style>
  .numberinput {
    width: 100%;
    font-size: 0.34rem;
    background-color: #fff;
    position: relative;
    border-bottom: 1px solid #d7d7d7;
    border-top: 1px solid #d7d7d7;
  }
  .numberinput .icon-close{
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    position: absolute;
    top:50%;
    right: 40px;
    transform: translate3d(0,-50%,0);
    background:url('../../images/setPassword/close.png') no-repeat center center;
    background-size: contain;
  }
  .numberinput input {
    width: 100%;
    border: none;
    height: 1rem;
    line-height:normal;
    color: #333;
    padding-left: 2.9rem;
    padding-right: 0.3rem;
    box-sizing: border-box;
  }
  .numberinput input.focus{
    box-shadow: 0 0 7px #3a83d7;
  }
  .numberinput label {
    position: absolute;
    line-height: 1rem;
    width: 2rem;
    display: inline-block;
    color: #333;
    left: 0.3rem;
  }
</style>
