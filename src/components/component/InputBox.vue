<template>
  <div class="inputbox">
    <label class="input-title">{{labeltitle}}</label><input type="text" :placeholder="placeholder" :readonly="readonly" v-model="input_text" @input="input" @focus="focusInput" @blur="blurInput" @click="handleDatePick">
    <span class="icon-close" v-show="show_clear" @click ="clear"></span>
  </div>
</template>
<script>
  export default {
    name: 'inputbox',
    props: ['labeltitle', 'placeholder', 'readonly', 'value'],
    data(){
      return {
        input_text: this.value,
        is_focus:false,
        show:false
      }
    },
    watch:{
      value:function(val){
        this.input_text = val;
      },
      input_text:function(val,oldval){
        this.$emit('showInputText',val);
      }
    },
    methods:{
      clear:function(){
        this.input_text ='';
        this.show = false;
      },
      input:function(){
        if(this.input_text.length > 0){
           this.show = true;
        }
      },
      focusInput:function(){
        this.is_focus = true;
        if(this.input_text.length > 0){
           this.show = true;
        }
      },
      blurInput:function(){
        var self = this;
        this.is_focus = false;
        setTimeout(function(){
          self.show = false;
        },100);
      },
      // 处理事件选择的特殊事件
      handleDatePick: function(){
         this.$emit('handleDatePick',null);
      }
    },
    computed:{
      is_show(){
        return this.is_focus && this.input_text.length > 0;
      },
      show_clear(){
        if(this.show || this.is_show){
          return true;
        }
        if(!this.show && !this.is_show){
          return false;
        }
      }
    }
  }
  
</script>
<style>
  .inputbox {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #d7d7d7;
    padding: 0 0.3rem;
    box-sizing: border-box;
    font-size: 0.34rem;
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
  }
  .inputbox input {
    width: 4.2rem;
    border: none;
    color: #333;
    outline: none;
  }
  
  .inputbox input.code {
    width: 2.1rem;
  }
  .icon-close{
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    position: absolute;
    top:50%;
    right: 15px;
    transform: translate3d(0,-50%,0);
    background:url('../../images/setPassword/close.png') no-repeat center center;
    background-size: contain;
  }
  .inputbox label {
    width: 2rem;
    display: inline-block;
    color: #333;
    margin-right: 0.6rem;
  }
  .double-input {
    display: inline-block;
  }
  
  .double-input .date-box {
    width: 2rem;
    text-align: center;
  }
</style>
