<template>
  <div :class="{selectbox: true, adjustWidth: (labeltitle === '不良诚信记录' || labeltitle === '账户受益人' || labeltitle === '实际控制人')}">
     <label class="input-title">{{labeltitle}}</label>
     <div class="select-input">
      <select v-model="selected" :disabled="labeltitle === '不良诚信记录'">
        <option>请选择</option>
        <option v-for="item in options" v-text="item.name || item.bank_name" v-bind:key="item.name || item.bank_name"></option>
      </select>
      <span class="right-arrow"></span>
    </div>
  </div>
</template>
<script>
  export default{
    name:'selectbox',
    data(){
      return {
        selected:''
      }
    },
    props:{
      options:{
        type:Array
      },
      labeltitle:{
        type:String
      },
      defaultoption:{
        type:String
      }
    },
    watch:{
      selected:function(val,oldval){
        this.$emit('selectItem',val);
      },
      defaultoption: function(){
        this.selected = this.defaultoption;
      }
    },
    created:function(){
      this.selected = this.defaultoption ? this.defaultoption:'请选择';
    }
  }
</script>
<style>
  .selectbox {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #d7d7d7;
    padding: 0 0.3rem;
    box-sizing: border-box;
    font-size: 0.34rem;
    background-color: #fff;
    position: relative;
  }
   .selectbox label {
    width: 1.42rem;
    color: #999;
    display:inline-block;
  }
   .select-input {
    display: inline-block;
    width: 5.18rem;
    position: relative;
  }
  
  .select-input select {
    width: 4.7rem;
    border: none;
    color: #333;
    -webkit-appearance: none;
    background-color: #fff;
  }
  
  .right-arrow {
    display: inline-block;
    width: 0.32rem;
    height: 0.32rem;
    position: absolute;
    right: -0.6rem;
    top: 50%;
    margin-top: -0.16rem;
    margin-right: 0.3rem;
    background: url(../../images/select_arrow.png) no-repeat center center;
    background-size: 0.32rem 0.32rem;
  }
  
  .adjustWidth .input-title{
    width: 2rem !important;
    white-space: nowrap;
  }
  .adjustWidth .select-input{
    width: 4.5rem !important;
    padding-left: .1rem;
  }
</style>