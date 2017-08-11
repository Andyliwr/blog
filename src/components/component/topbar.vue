<template>
  <div class="topbar">
    <div class="title">
      <span id="backTo" @click="back"></span>
      <span>{{title || message}}</span>
    </div>
    <v-mask @hide="hide" :is_show="is_show_alert"></v-mask>
    <div class="scale-box" style="position: fixed;top: 50%;left: 50%;width: 6.3rem;z-index: 1000;transform:translate3d(-50%,-50%,0)">
      <transition name="scale">
        <div class="confirm" style="background-color: #fff;border-radius: 0.1rem;font-size: 0.36rem;" v-if="is_show_alert">
          <div class="isflag" style="border-bottom: 1px solid #D3D3D3;height: 1rem;line-height: 1rem;font-weight: bold;color: #333;text-align: center;">提示</div>
          <div class="content" style="padding:0.3rem 0;color:#666;border-bottom:1px solid #d7d7d7;text-align:center;">是否退出开户，并返回首页</div>
          <div class="anniu" style="font-size:0px;">
            <div class="quxiao" @click="cancel" style="display: inline-block;height:0.8rem;line-height:0.8rem;width:50%;border-right:1px solid #d7d7d7;color:#666; text-align:center; box-sizing:border-box; font-size:0.36rem;margin-right:-1px;"><span>取消</span></div>
            <div class="tuichu" @click="confirm" style="display: inline-block;height:0.8rem;line-height:0.8rem;width:50%; text-align:center;color:#3a83d7;box-sizing:border-box;font-size:0.36rem;"><span>确定</span></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import router from '../../router'
  import tools from '../../tools'
  import Mask from '../component/Mask'
  import bus from '../../bus'
  export default {
    name: 'topbar',
    data() {
      return {
        is_show_alert: false,
        is_click: true,
        title: '',
        callBackName: '' //当开户过程组件中含有二级页面的时候，点击返回时触发的回调方法名
      }
    },
    props: ['message', 'step', 'other'],
    methods: {
      hide: function () {
        this.is_show_alert = false;
      },
      cancel: function () {
        this.is_show_alert = false;
      },
      confirm: function () {
        this.is_show_alert = false;
        tools.exitKaihu();
      },
      back: function () {
        var self = this;
        if (this.is_click) {
          this.is_click = false;
          setTimeout(function () {
            self.is_click = true;
          }, 500);
          if (this.step <= 5) {
            if (this.step == 1) {
              tools.exitKaihu();
            } else {
              if(this.step == 5 && this.other.show_wait_page){
                this.other.show_wait_page = false;
                this.other.cancelquery();
                return false;
              }
              if (sessionStorage.getItem('rejectedSign') == 'true') {
                this.is_show_alert = true;
              } else {
                switch (this.step) {
                  case 5:
                      router.push('/updateclientinfo/3');
                    break;
                  case 4:
                    // router.push('/updateclientinfo/3');
                    // 返回的逻辑有些变化，updateopenbranch被提到了第二步
                    router.push('/1');
                    break;
                  case 3:
                    //如果callBackName不为空，代表原页面有二级页面，点击返回不是返回前一个页面
                    if(self.callBackName){
                      bus.$emit(self.callBackName, '')
                      //将title还原
                      self.title = self.message;
                    }else{
                      router.push('/sendpic/2');
                    }
                    break;
                  case 2:
                    // 上传身份证之后不能再回退了
                    tools.exitKaihu();
                    break;
                }
              }
            }
          }else if(this.step === 15){
            // 如果当前是税收页面直接返回到更新个人信息
            router.push('/updateclientinfo/3');
          }else {
            this.is_show_alert = true;
          }
        }
      }
    },
    created: function(){
      let self = this
      self.title = self.message
      // 监听从updateInfo传过来的信息
      bus.$on('openCreditRecord', (obj) => {
        if(obj.title){
          self.title = obj.title
        }
        self.callBackName = obj.callBackName || ''
      })
    },
    components: {
      'v-mask': Mask
    }
  }

</script>
<style>
  .topbar {
    position: absolute;
    height: 0.96rem;
    width: 100%;
    z-index: 800;
    top: 0;
    left: 0;
    right: 0;
  }

  .topbar .title {
    width: 100%;
    background-color: #2e6bb1;
    height: 0.96rem;
    line-height: 0.96rem;
    font-size: 0.36rem;
    color: #fefefe;
    text-align: center;
    font-weight: bold;
  }

  #backTo {
    display: inline-block;
    width: 0.6rem;
    height: 0.96rem;
    position: absolute;
    left: 0.3rem;
    background: url(../../images/back.png) no-repeat center center;
    background-size: 0.4rem 0.4rem;
  }

  .scale-enter-active,
  .scale-leave-active {
    transition: all 0.5s;
  }

  .scale-enter,
  .scale-leave-active {
    opacity: 0;
    transform: scale(0.8, 0.8);
  }

</style>
