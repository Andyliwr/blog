<template>
  <div class="radiobox">
     <span :data-index="index" v-on:click="changeValue" :class="{'radio-span': true, 'selected': value}"></span>
     <div class="radio-text" :data-index="index" v-on:click="changeValue">
      <p class="title" v-html="title" :data-index="index" v-on:click="changeValue"></p>
      <p class="des" v-html="des" :data-index="index" v-on:click="changeValue"></p>
     </div>
  </div>
</template>
<script>
  export default{
    name:'selectbox',
    data(){
      return {
        selected:'',
        checked: true
      }
    },
    props:{
      index: {
        type: Number
      },
      value:{
        type: Boolean
      },
      des:{
        type: String
      },
      title: {
        type: String
      }
    },
    methods: {
      changeValue: function(event){
        event.preventDefault()
        this.$emit('selectItem', {index: event.target.dataset.index, value: !this.value})
      }
    }
  }
</script>
<style>
.radiobox{
  position: relative;
  height: 1.5rem;
  background: #fff;
  border-bottom: 1px solid #d7d7d7;
}
.radiobox .radio-span{
  height: .4rem;
  width: .4rem;
  box-sizing: border-box;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid #ccc;
  position: relative;
  top: -.3rem;
  margin-left: .26rem;
}
.radiobox .radio-span.selected{
  height: .44rem;
  width: .44rem;
}
.radiobox .radio-span.selected:after{
  content: '';
  position: absolute;
  left: .05rem;
  top: .05rem;
  display: inline-block;
  width: .3rem;
  height: .3rem;
  background: #2e6bb1;
  border-radius: 50%;
  box-sizing: border-box;
}
.radio-text{
  position: absolute;
  right: 0;
  top: 0;
  width: 88%;
  padding: .2rem .1rem .1rem .1rem;
}
.radio-text .title{
  font-size: .3rem;
  font-weight: bold;
  color: #333;
}
.radio-text .des{
  font-size: .2rem;
  color: #666;
}

.radiobox input {
  width: 0.34rem;
  height: 0.34rem;
  position: relative;
  top: 1px;
  margin-right: 0.05rem;
}
</style>