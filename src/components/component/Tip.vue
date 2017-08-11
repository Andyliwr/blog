<template>
  <div class="tip">
    <p class="tip-content" v-html="content"></p>
  </div>
</template>
<script>
  export default {
    name: 'tip',
    data() {
      return {}
    },
    props: ['content']
  }

</script>
<style>
  .tip {
    width: 100%;
    box-sizing:border-box;
  }
  
  .tip-content {
    color: #999;
    font-size: 0.32rem;
  }
  
  .tip-content a,
  .tip-content span {
    color: #3a83d7;
    text-decoration: underline;
  }

</style>
