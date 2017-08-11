<template>
  <div id="app">
    <v-topbar :message="title" :step="step" :other="other"></v-topbar>
    <transition :name="transitionName">
      <router-view class="wrap"></router-view>
    </transition>
    <v-reloadbox :content="reloadbox.content" @backPage="backPage" @clickReload="clickReload" v-if="reloadbox.show"></v-reloadbox>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
  </div>
</template>

<script>
  import bus from './bus';
  import Topbar from './components/component/topbar'
  import ReloadBox from './components/component/ReloadBox'
  import AgreementBox from './components/component/AgreementBox.vue'
  import AlertContent from './components/component/AlertContent.vue'
  import AlertBox from './components/component/AlertBox'
  import Inputbox from './components/component/InputBox.vue'
  import Mask from './components/component/Mask.vue'
  import Nextstep from './components/component/NextStep.vue'
  import NumberInput from './components/component/NumberInput.vue'
  import SelectBox from './components/component/SelectBox'
  import Switch from './components/component/Switch'
  import Tip from './components/component/Tip'
  import keyboard from './components/component/keyboard'
  import axios from 'axios'

  import config from './config'



  export default {
    name: 'app',
    data() {
      return {
        title: '',
        step: '',
        other: '',
        transitionName: '',
        reloadbox: {
          content: '',
          show: false,
          getBank: true,
          getDetail: true
        },
        alertbox: {
          content: '',
          btn: [],
          show: false
        }
      }
    },
    watch: {
      '$route' (to, from) {
        let allList = JSON.parse(localStorage.getItem('allList'));
        // 全部转换成小写
        allList = allList.map(item => {
          item = item.toLowerCase()
          return item
        })
        if ((/iPhone/).test(window.navigator.userAgent)) {
          if (parseInt(window.navigator.userAgent.match(/iPhone OS \d{0,}_/).join('').split(' ').reverse()[0].replace(
              /_/,
              '')) >= 9) {
            let to_path_arr = to.path.split('/');
            let from_path_arr = from.path.split('/');
            if (to_path_arr[1] == 1 && from_path_arr[1] != '') {
              this.transitionName = 'pageswitch-right';
            } else {
              // try {
                // 不在根据途径后面的数值大小，而是当前路径在allList的循序大小来判断往那边滑动
                let to_number = allList.indexOf(to_path_arr[1])
                let from_number = allList.indexOf(from_path_arr[1])
                if (from_number) {
                  this.transitionName = to_number < from_number ? 'pageswitch-right' : 'pageswitch-left'
                }
              // } catch (err) {
              //   console.log(err)
              //   const to_page_number = parseInt(to_path_arr[to_path_arr.length - 1])
              //   const from_page_number = parseInt(from_path_arr[from_path_arr.length - 1])
              //   if (from_page_number) {
              //     // 由于更新营业部被放在了手机校验的后面，滑页动画需要做额外的判断
              //     this.transitionName = to_page_number < from_page_number ? 'pageswitch-right' : 'pageswitch-left'
              //   }
              // }
            }
          }
        }
        if ((/Android/).test(window.navigator.userAgent)) {
          if (!window.navigator.userAgent.match(/Android [2-4].[0-4]/)) {
            let to_path_arr = to.path.split('/');
            let from_path_arr = from.path.split('/');
            if (to_path_arr[1] == 1 && from_path_arr[1] != '') {
              this.transitionName = 'pageswitch-right';
            } else {
              // try {
                // 不在根据途径后面的数值大小，而是当前路径在allList的循序大小来判断往那边滑动
                let to_number = allList.indexOf(to_path_arr[1])
                let from_number = allList.indexOf(from_path_arr[1])
                if (from_number) {
                  this.transitionName = to_number < from_number ? 'pageswitch-right' : 'pageswitch-left'
                }
              // } catch (err) {
              //   console.log(err)
              //   const to_page_number = parseInt(to_path_arr[to_path_arr.length - 1])
              //   const from_page_number = parseInt(from_path_arr[from_path_arr.length - 1])
              //   if (from_page_number) {
              //     this.transitionName = to_page_number < from_page_number ? 'pageswitch-right' : 'pageswitch-left'
              //   }
              // }
            }
          }
        }
      }
    },
    methods: {
      getQsDetail: function () {
        var self = this;
        axios.get(config.qsInterface + 'getQsDetail', {
          params: {
            qsid: config.qsId
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            localStorage.setItem('qsDetail', JSON.stringify(response.data));
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = "获取券商详情失败，请重新加载";
            self.reloadbox.show = true;
            self.reloadbox.getDetail = false;
          }
        }).catch(function (error) {
          self.reloadbox.content = "获取券商详情失败，请重新加载";
          self.reloadbox.show = true;
          self.reloadbox.getDetail = false;
        });
      },
      getBank: function () {
        var self = this;
        axios.get(config.qsInterface + 'getBank', {
          params: {
            qsid: config.qsId,
            sms: "1"
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            localStorage.setItem('bankList', JSON.stringify(response.data));
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = "券商支持银行列表加载失败，请重新加载";
            self.reloadbox.show = true;
            self.reloadbox.getBank = false;
          }
        }).catch(function (error) {
          self.reloadbox.content = "券商支持银行列表加载失败，请重新加载";
          self.reloadbox.show = true;
          self.reloadbox.getBank = false;
        });
      },
      backPage: function () {
        this.reloadbox.show = false;
      },
      clickReload: function () {
        this.reloadData();
      },
      reloadData: function () {
        this.reloadbox.show = false;
        if (this.reloadbox.getDetail == false) {
          this.getQsDetail();
        }
        if (this.reloadbox.getBank == false) {
          this.getBank();
        }
      },
      closeAlertBox: function () {
        this.alertbox.show = false;
      }
    },
    components: {
      'v-topbar': Topbar,
      'v-reloadbox': ReloadBox,
      'v-alertbox': AlertBox
    },
    created: function () {
      var self = this;
      self.getQsDetail();
      self.getBank();
      bus.$on('titleName', function (title, step, other) {
        self.title = title;
        self.step = step;
        self.other = other;
      });
    }
  }

</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .wrap {
    /*position: absolute;
    top: 0.96rem;
    left: 0;
    bottom: 0;*/
    height: 100%;
    padding-top: 0.96rem;
    box-sizing: border-box;
    width: 100%;
    overflow-y: auto;
  }

  .pageswitch-left-enter-active {
    animation: page-switch-left-in .5s linear;
  }

  .pageswitch-left-leave-active {
    animation: page-switch-left-out .5s linear;
  }

  .pageswitch-right-enter-active {
    animation: page-switch-right-in .5s linear;
  }

  .pageswitch-right-leave-active {
    animation: page-switch-right-out .5s linear;
  }

  @keyframes page-switch-left-in {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    50% {
      transform: translate3d(50%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes page-switch-left-out {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(-50%, 0, 0);
    }
    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }

  @keyframes page-switch-right-in {
    0% {
      transform: translate3d(-100%, 0, 0);
    }
    50% {
      transform: translate3d(-50%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes page-switch-right-out {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(50%, 0, 0);
    }
    100% {
      transform: translate3d(100%, 0, 0);
    }
  }

  .middle-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1000;
  }

  .certificate {
    font-size: 0.32rem;
    display: block;
    color: #333;
    box-sizing: border-box;
    margin: 0.2rem 0.3rem 0 0.3rem;
  }

  .certificate input {
    width: 0.34rem;
    height: 0.34rem;
    position: relative;
    top: 1px;
    margin-right: 0.05rem;
  }

  .certificate label {
    line-height: 0.42rem;
    display: inline-block;
    height: 0.42rem;
    background: url(images/openThirdPartyAccount/agree_icon_check.png) no-repeat left center;
    background-size: 0.4rem 0.4rem;
    padding-left: 0.5rem;
  }

  .certificate label.unchecked {
    background: url(images/openThirdPartyAccount/agree_icon_nocheck.png) no-repeat left center;
    background-size: 0.4rem 0.4rem;
  }

  .certificate a {
    color: #3a83d7;
    text-decoration: underline;
  }

  .small-input-box label {
    width: 1.6rem;
    color: #999;
    margin-right: 0;
  }

  .small-input-box input {
    width: 4.7rem;
  }

</style>
