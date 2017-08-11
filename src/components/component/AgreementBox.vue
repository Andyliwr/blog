<template>
  <div class="agreementbox" >
        <div class="agreement_item" v-for="item in agreement_list" @click="showAgreement(item.econtract_id)">
          {{item.econtract_name}}
          <span class="right-arrow"></span>
        </div>
  </div>
</template>

<script>
  export default {
    name: 'agreementbox',
    data() {
      return {
      }
    },
    props:['agreement_list'],
    methods:{
      showAgreement:function(id){
        this.$emit('showAgreement',id);
      }
    }
  }

</script>
<style>
  .agreement_item {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #d7d7d7;
    padding: 0 0.3rem;
    box-sizing: border-box;
    font-size: 0.34rem;
    background-color: #fff;
    position:relative;
  }
  .agreement_item .right-arrow{
    right:0;
  }
</style>
