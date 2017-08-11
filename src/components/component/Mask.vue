<template>
    <div class="mask" @click="hideMask" :class="{'mask-active':is_show}">
    </div>
</template>
<script>
  export default {
    name: 'mask',
    data() {
      return {}
    },
    props:['is_show'],
    methods: {
      hideMask: function () {
        this.$emit('hide');
      }
    }
  }

</script>
<style>
  .mask {
    position:fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0 , 0, 0,0.5);
    z-index: 900;
    opacity: 0;
    transition: opacity 0.5s;
    visibility: hidden;
  }
  .mask-active{
    opacity: 1;
    visibility: visible;
  }

</style>
