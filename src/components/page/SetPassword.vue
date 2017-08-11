<template>
  <div class="setpassword">
    <v-tip :content="tipcontent[0]" style="padding:0.2rem 0.3rem;"></v-tip>
    <div class="jy-box">
      <div style="margin:0.2rem 0 0.2rem;">
        <v-numberinput :labeltitle="inputbox[0].labeltitle" :placeholder="inputbox[0].placeholder" :value="inputbox[0].value" :isfocus="inputbox[0].focus"
          :ispassword="inputbox[0].is_password" @Input="jyPassword" @clearInputValue="clearjy"></v-numberinput>
      </div>
      <div>
        <v-numberinput :labeltitle="inputbox[1].labeltitle" :placeholder="inputbox[1].placeholder" style="margin: 0.2rem 0;border-top: 1px solid #d7d7d7;border-bottom: 1px solid #d7d7d7;"
          :value="inputbox[1].value" :isfocus="inputbox[1].focus" :ispassword="inputbox[0].is_password" @Input="qrjyPassword"
          @clearInputValue="clearqrjy"></v-numberinput>
      </div>
      <span class="icon-eye" @click="showjyPassword">
          <img src="../../images/setPassword/view.png" alt="" v-if="is_show_jy">
          <img src="../../images/setPassword/unview.png" alt="" v-else>
        </span>
    </div>
    <v-tip :content="tipcontent[1]" style="padding:0.2rem 0.3rem;"></v-tip>
    <div class="switch" style="border-top:1px solid #d7d7d7;">
      资金密码同交易密码
      <span class="switch-icon"><v-switch @showSelectedItem="switchMoneyBox" :id="id" :default="true"></v-switch></span>
    </div>
    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" :css="false">
      <div class="money-password-box" v-if="isShowMoneyPasswordBox">
        <div style="margin:0.2rem 0 0;">
          <v-numberinput :labeltitle="inputbox[2].labeltitle" :placeholder="inputbox[2].placeholder" style="" :value="inputbox[2].value"
            :isfocus="inputbox[2].focus" :ispassword="inputbox[2].is_password" @Input="zjPassword" @clearInputValue="clearzj"></v-numberinput>
        </div>
        <div style="margin:0.2rem 0;">
          <v-numberinput :labeltitle="inputbox[3].labeltitle" :placeholder="inputbox[3].placeholder" :value="inputbox[3].value" :isfocus="inputbox[3].focus"
            :ispassword="inputbox[2].is_password" @Input="qrzjPassword" @clearInputValue="clearqrzj"></v-numberinput>
        </div>
        <span class="icon-eye" @click="showzjPassword">
          <img src="../../images/setPassword/view.png" alt="" v-if="is_show_zj">
          <img src="../../images/setPassword/unview.png" alt="" v-else>
        </span>
      </div>
    </transition>
    <div class="tip-box clearfix">
      <div class="red-tip">
        <v-tip :content="tipcontent[2]"></v-tip>
      </div>
      <div class="blue-tip" @click="showPasswordRule">
        <v-tip :content="tipcontent[3]"></v-tip>
      </div>
    </div>
    <v-nextstep :next="nextstep.next" :text="nextstep.btn_text" @goNext="allowNext"></v-nextstep>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-keyboard @closeKeyBoard="closeKeyBoard" v-if="is_show_key_board" @clickKeyBoard="clickKeyBoard"></v-keyboard>
    <v-indicator v-if="is_show_indicator"></v-indicator>
    <div class="block" style="height:240px;width:100%;" v-if="is_show_key_board">

    </div>
  </div>
</template>
<script>
  import router from '../../router'
  import Inputbox from '../component/InputBox'
  import Tip from '../component/Tip.vue'
  import Nextstep from '../component/NextStep'
  import Switch from '../component/Switch'
  import AlertBox from '../component/AlertBox'
  import NumberInput from '../component/NumberInput'
  import KeyBoard from '../component/keyboard'
  import Indicator from '../component/Indicator'
  import Mask from '../component/Mask'
  import bus from '../../bus'
  import tools from '../../tools'
  import config from '../../config'
  import axios from 'axios'
  
  import Velocity from 'velocity-animate'

  export default {
    name: 'setpassword',
    data() {
      return {
        title: '设置密码',
        tipcontent: ['设置交易密码，用于股票交易', '设置资金密码，用于银行卡转账', '提示：请记录以防止您忘记密码', '密码设置规则'],
        isShowMoneyPasswordBox: false,
        is_show_key_board: false,
        is_show_indicator: false,
        input_index: '',
        id: 'money_switch',
        is_show_jy: false,
        is_show_zj: false,
        inputbox: [{
            labeltitle: '交易密码',
            placeholder: '请输入6位数字交易密码',
            value: '',
            focus: false,
            is_password: true,
          },
          {
            labeltitle: '确认密码',
            placeholder: '请再次输入6位数字交易密码',
            value: '',
            focus: false,

          },
          {
            labeltitle: '资金密码',
            placeholder: '请输入6位数字资金密码',
            value: '',
            focus: false,
            is_password: true,
          },
          {
            labeltitle: '确认密码',
            placeholder: '请再次输入6位数字资金密码',
            value: '',
            focus: false,

          }
        ],
        nextstep: {
          next: true,
          btn_text: '下一步'
        },
        alertbox: {
          content: '',
          show: false
        }
      }
    },
    components: {
      'v-tip': Tip,
      'v-nextstep': Nextstep,
      'v-inputbox': Inputbox,
      'v-switch': Switch,
      'v-alertbox': AlertBox,
      'v-mask': Mask,
      'v-numberinput': NumberInput,
      'v-keyboard': KeyBoard,
      'v-indicator': Indicator
    },
    methods: {
      //以下四个方法为清除输入框中的值
      clearjy: function () {
        this.inputbox[0].value = '';
      },
      clearqrjy: function () {
        this.inputbox[1].value = '';
      },
      clearzj: function () {
        this.inputbox[2].value = '';
      },
      clearqrzj: function () {
        this.inputbox[3].value = '';
      },
      checkjyPassword: function () {//交易密码校验
        if (this.inputbox[0].value == '' || this.inputbox[1].value == '') {
          this.alertbox.content = ['密码不能为空'];
          this.alertbox.show = true;
          return false;
        }
        if (this.inputbox[0].value.trim().length != 6 || this.inputbox[1].value.trim().length != 6) {
          this.alertbox.content = ['密码必须为六位数字'];
          this.alertbox.show = true;
          return false;
        }
        if (this.inputbox[0].value != this.inputbox[1].value) {
          this.alertbox.content = ['交易密码和确认密码必须相同'];
          this.alertbox.show = true;
          return false;
        }
        if (this.checkEqualNumber(this.inputbox[0].value) || this.checkEqualNumber(this.inputbox[1].value)) {
          this.alertbox.content = ['同一数字不能出现3次，请重新输入'];
          this.alertbox.show = true;
          return false;
        }
        if (this.checkSubsequentNumbers(this.inputbox[0].value) || this.checkSubsequentNumbers(this.inputbox[1].value)) {
          this.alertbox.content = ['连续的数字不能超过4个，请重新输入'];
          this.alertbox.show = true;
          return false;
        }
        if (this.checkOwnInfo(this.inputbox[0].value) || this.checkOwnInfo(this.inputbox[1].value)) {
          this.alertbox.content = ['密码不能是生日、手机号、身份中号码中的一段,请重新输入'];
          this.alertbox.show = true;
          return false;
        }
        return true;
      },
      checkzjPassword: function () {//资金密码校验
        if (this.inputbox[2].value == '' || this.inputbox[3].value == '') {
          this.alertbox.content = ['密码不能为空'];
          this.alertbox.show = true;
          return false;
        }
        if (this.inputbox[2].value.trim().length != 6 || this.inputbox[3].value.trim().length != 6) {
          this.alertbox.content = ['密码必须为六位数字'];
          this.alertbox.show = true;
          return false;
        }
        if (this.inputbox[2].value != this.inputbox[3].value) {
          this.alertbox.content = ['资金密码和确认密码必须相同'];
          this.alertbox.show = true;
          return false;
        }
        if (this.checkEqualNumber(this.inputbox[2].value) || this.checkEqualNumber(this.inputbox[3].value)) {
          this.alertbox.content = ['同一数字不能出现3次，请重新输入'];
          this.alertbox.show = true;
          return false;
        }
        if (this.checkSubsequentNumbers(this.inputbox[2].value) || this.checkSubsequentNumbers(this.inputbox[3].value)) {
          this.alertbox.content = ['连续的数字不能超过4个，请重新输入'];
          this.alertbox.show = true;
          return false;
        }
        if (this.checkOwnInfo(this.inputbox[2].value) || this.checkOwnInfo(this.inputbox[3].value)) {
          this.alertbox.content = ['密码不能是生日、手机号、身份中号码中的一段,请重新输入'];
          this.alertbox.show = true;
          return false;
        }
        return true;
      },
      checkEqualNumber: function (num) {//检测同一个数字是否出现次数大于3
        var count = {};
        for (var i = 0; i < num.length; i++) {
          if (!count[num[i]]) {
            count[num[i]] = 0;
          }
          count[num[i]]++;
        }
        for (var key in count) {
          if (count[key] >= 3) {
            return true;
          }
        }
        return false;
      },
      checkSubsequentNumbers: function (num) {//检测连续数据是否大于3个 类似 1234 2345
        for (var i = 2; i < num.length - 1; i++) {
          if ((num[i - 2] == num[i - 1] - 1) && (num[i - 1] == (num[i] - 1)) && (num[i] == (num[i + 1] - 1))) {
            return true;
          }
          if ((num[i - 2] - 1 == num[i - 1]) && ((num[i - 1] - 1) == num[i]) && ((num[i] - 1) == num[i + 1])) {
            return true;
          }
        }
        return false;
      },
      checkOwnInfo: function (num) {//检测密码不能为身份证号或生日中的部分数字
        var client_info = JSON.parse(localStorage.getItem('clientinfo' + localStorage.getItem('telKey')));
        if (!client_info) {
          client_info = JSON.parse(localStorage.getItem("registerInfo"));
        }
        var id_card = client_info['id_no'] || '';
        var tel_num = tools.getcookie('mobile_tel') || '';
        if (id_card.indexOf(num) > -1 || tel_num.indexOf(num) > -1) {
          return true;
        }
        return false;
      },
      showjyPassword: function () {
        this.is_show_jy = !this.is_show_jy;
        this.inputbox[0].is_password = !this.inputbox[0].is_password;
      },
      showzjPassword: function () {
        this.is_show_zj = !this.is_show_zj;
        this.inputbox[2].is_password = !this.inputbox[2].is_password;
      },
      zjPassword: function () {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.input_index = 2;
        this.inputbox[0].focus = false;
        this.inputbox[1].focus = false;
        this.inputbox[2].focus = true;
        this.inputbox[3].focus = false;
      },
      qrzjPassword: function () {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.input_index = 3;
        this.inputbox[0].focus = false;
        this.inputbox[1].focus = false;
        this.inputbox[2].focus = false;
        this.inputbox[3].focus = true;
      },
      jyPassword: function () {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.input_index = 0;
        this.inputbox[0].focus = true;
        this.inputbox[1].focus = false;
        this.inputbox[2].focus = false;
        this.inputbox[3].focus = false;
      },
      qrjyPassword: function () {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.input_index = 1;
        this.inputbox[1].focus = true;
        this.inputbox[0].focus = false;
        this.inputbox[2].focus = false;
        this.inputbox[3].focus = false;
      },
      closeKeyBoard: function () {
        this.is_show_key_board = false;
        for (var i = 0; i < 4; i++) {
          this.inputbox[i].focus = false;
        }
      },
      clickKeyBoard: function (val) {
        var self = this;
        if (val == '安全输入') {} else if (val == '删除') {
          if (self.inputbox[this.input_index].value.length > 1) {
            self.inputbox[this.input_index].value = self.inputbox[this.input_index].value.substring(0, self.inputbox[
                this.input_index].value.length -
              1);
          } else if (self.inputbox[this.input_index].value.length == 1) {
            self.inputbox[this.input_index].value = self.inputbox[this.input_index].value.substring(0, self.inputbox[
                this.input_index].value.length -
              1);
          }
        } else {
          if (self.inputbox[this.input_index].value.length < 6) {
            self.inputbox[this.input_index].value += val;
          }
        }
      },
      switchMoneyBox: function (val) {
        this.isShowMoneyPasswordBox = (!val);
        if (val) {
          this.inputbox[2].value = '';
          this.inputbox[3].value = '';
        }
      },
      allowNext: function () {//下一步按钮点击事件
        var self = this;
        self.is_show_key_board = false;
        callNativeHandler('khh5', {
          "action": "getNetworkType",
          "reqId": "getNetworkType",
          "param": {}
        }, function (data) {
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          if (data.param.networkType == '0') {
            self.is_show_indicator = false;
            self.alertbox.content = ['网络连接失败，请重新连接网络'];
            self.alertbox.show = true;
          } else {
            if (self.checkjyPassword()) {
              if (self.isShowMoneyPasswordBox) {
                if (self.checkzjPassword()) {
                  self.is_show_indicator = true;
                  self.setPassword({
                    encode_type: "0",
                    capital_password: self.inputbox[2].value,
                    transaction_password: self.inputbox[0].value,
                    connect_password: self.inputbox[2].value
                  });
                }
              } else {
                self.is_show_indicator = true;
                self.setPassword({
                  encode_type: "0",
                  capital_password: self.inputbox[0].value,
                  transaction_password: self.inputbox[0].value,
                  connect_password: self.inputbox[0].value
                });
              }
            }
          }
        });

      },
      setPassword: function (obj) {//设置密码接口
        var self = this;
        axios.get(config.qsInterface + 'setPassword', {
          params: obj
        }).then(function (response) {
          if (response.data.error_no == 0) {
            self.is_show_indicator = false;
            tools.stepSync('setPassword');
            var nextlist = JSON.parse(localStorage.getItem('nextList'));
            tools.nextpage = nextlist[nextlist.indexOf('setPassword') + 1];
            tools.afterBackToOpenAccountStep();
          } else {
            self.is_show_indicator = false;
            self.aletbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.alertbox.content = ['设置密码失败！'];
          self.alertbox.show = true;
        });
      },
      showPasswordRule: function () {
        this.alertbox.content = ['1.连续数字不能超过3个,如1234XX、4321XX均不符合要求;', '2.同一数字不能出现3次,如111XXX、X1X1X1、X1X11X;',
          '3.不能是生日、手机号、身份中号码中的一段,比如身份证号码是:330719196804253671,密码不能是:680425。'
        ];
        this.alertbox.show = true;
      },
      closeAlertBox: function () {
        this.alertbox.show = false;
      },
      beforeEnter: function (el) {
        el.style.height = 0;
        el.style.transformOrigin = 'top'
      },
      enter: function (el, done) {
        Velocity(el, {
          height: '2.6rem'
        }, {
          duration: 300
        }, {
          complete: done
        })
      },
      leave: function (el, done) {
        Velocity(el, {
          height: '0'
        }, {
          duration: 300
        }, {
          complete: done
        })
      }
    },
    created: function () {
      bus.$emit('titleName', this.title, 10);
    },
    watch: {
      // is_show_key_board: function (val) {
      //   if (val) {
      //     document.querySelector('.setpassword').style.marginBottom = "240px";
      //   } else {
      //     document.querySelector('.setpassword').style.marginBottom = '0px';
      //   }
      // }
    }
  }

</script>

<style>
  .jy-box {
    position: relative;
  }

  .jy-box .icon-eye,
  .money-password-box .icon-eye {
    position: absolute;
    display: block;
    width: 0.5rem;
    height: 0.4rem;
    top: 1.55rem;
    right: 0.3rem;
  }

  .money-password-box .icon-eye {
    top: 1.75rem;
  }

  .jy-box .icon-eye img,
  .money-password-box .icon-eye img {
    display: block;
    width: 0.5rem;
    height: 0.4rem;
  }

  .setpassword label {
    color: #333;
  }

  .setpassword input {
    padding-left: 1.8rem;
  }

  .switch {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #d7d7d7;
    padding: 0 0.3rem;
    font-size: 0.34rem;
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
  }

  .switch-icon {
    display: block;
    height: 26px;
    width: 45px;
    position: absolute;
    top: 50%;
    right: 0.2rem;
    transform: translateY(-50%);
    border-radius: 12px;
  }

  .money-password-box {
    overflow: hidden;
    position: relative;
  }

  .tip-box {
    padding: 0.2rem 0.3rem 0;
  }

  .tip-box .red-tip {
    float: left;
  }

  .tip-box .blue-tip {
    float: right;
  }

  .tip-box .red-tip .tip-content {
    color: #f64d54;
    float: left;
  }

  .tip-box .blue-tip .tip-content {
    color: #3a83d7;
  }

</style>
