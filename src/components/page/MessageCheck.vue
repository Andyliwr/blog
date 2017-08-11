<template>
  <div class="messagecheck">
    <div style="margin:0.2rem 0 0.2rem;">
      <v-numberinput :labeltitle="inputbox[0].labeltitle" :placeholder="inputbox[0].placeholder" :value="inputbox[0].value" @showInputText="showInputText" :isfocus="inputbox[0].focus" @Input="phoneNumber" @clearInputValue="clearPhone"></v-numberinput>
    </div>
    <div style="margin-bottom:0.2rem;border-top:1px solid #d7d7d7;border-bottom:1px solid #d7d7d7;">
      <div class="codebox">
        <label>{{inputbox[1].labeltitle}}</label>
        <input type="text" :placeholder="inputbox[1].placeholder" maxlength="6" v-model="inputbox[1].value" @click="codeNumber" readonly="true" :class="{'focus':inputbox[1].focus}">
        <div class="code-btn" @click="getCheckCode" :class="{'code-already-send':!code_btn.can_click}">{{code_btn.text}}</div>
      </div>
    </div>
    <transition @before-enter="beforeEnter" @enter="enter" :css="false">
      <v-tip :content="tipcontent[0]" v-if="alreadysend" style="margin-bottom: 0.15rem;padding:0 0.3rem;" class="slide-box"></v-tip>
    </transition>
    <div class="tip" @click="call" style="padding:0 0.3rem;">
      <p class="tip-content">如收不到验证码，请拨打客服热线
        <span>
          <a @click="doNothing" :href="tel_href" class="tel" v-if="is_can_call">{{qs_hotline}}</a>
          <span class="tel" v-if="!is_can_call">{{qs_hotline}}</a></span>
        </span>  
      </p>
    </div>
    <v-nextstep :text="nextstep.text" :next="nextstep.next" @goNext="clickNextStep"></v-nextstep>
    <h3 class="preopenaccount">开户前请准备好</h3>
    <div class="precondition">
      <ul class="clearfix">
        <li>
          <img src="../../images/messageCheck/idcard.png" />
          <p>二代身份证</p>
        </li>
        <li>
          <img src="../../images/messageCheck/bankcard.png" />
          <p>银行卡</p>
        </li>
        <li>
          <img src="../../images/messageCheck/wifi.png" />
          <p>3G及以上/wifi</p>
        </li>
      </ul>
    </div>
    <div class="bankicon" :class="{'bankicon-show':showbanklist}">
      <p>支持的银行卡</p>
      <ul>
        <li class="bank_box">
          <ol id="olone">
            <li v-for="item in banklist">
              <img :src="item.bank_logo_small">
              <span>{{item.bank_name}}</span>
            </li>
          </ol>
        </li>
      </ul>
    </div>
    <div class="supportbank">
      <span @click="showBankList">支持的银行卡</span>
    </div>
    <v-mask @hide="switchBankList" :is_show="alertbox.show || showbanklist"></v-mask>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="switchBankList"></v-alertbox>
    </div>
    <v-keyboard @closeKeyBoard="closeKeyBoard" v-show="is_show_key_board" @clickKeyBoard="clickKeyBoard"></v-keyboard>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>
<script>
import router from '../../router'
import Inputbox from '../component/InputBox'
import Tip from '../component/Tip'
import Nextstep from '../component/NextStep'
import Mask from '../component/Mask'
import AlertBox from '../component/AlertBox'
import NumberInput from '../component/NumberInput'
import KeyBoard from '../component/keyboard'
import Indicator from '../component/Indicator'
import axios from 'axios'

import Velocity from 'velocity-animate'
import bus from '../../bus'
import config from '../../config'
import tools from '../../tools'
import md5 from '../../md5'

export default {
  name: 'messagecheck',
  data() {
    return {
      title: '手机验证', //页面标题
      alreadysend: false, // 判断验证码是否发送
      qs_hotline: '', //券商热线电话
      showbanklist: false, //控制银行列表是否显示
      go_to_next_step_flag: false, //能否跳转下一步
      is_show_key_board: false, //是否显示键盘
      input_index: '', //代表正在输入的输入框的索引
      is_can_input: false, //手机号输入框能否输入
      is_show_indicator: false, //是否显示加载图标
      tel_href: '',
      is_can_call: true,
      inputbox: [{
        'labeltitle': '手机号',
        'placeholder': '请输入手机号',
        'value': '',
        'focus': false
      },
      {
        'labeltitle': '短信验证码',
        'placeholder': '请输入验证码',
        'value': '',
        'focus': false
      }
      ],
      code_btn: {
        text: '获取验证码',
        can_click: true
      },
      tipcontent: ['验证码已发送，请留意手机短信'],
      nextstep: {
        next: false,
        text: '下一步'
      },
      banklist: [],
      alertbox: {
        content: ['发送验证码失败'],
        pagenext: false,
        show: false,
      },
      reloadbox: {
        content: "",
        show: false
      }
    }
  },
  computed: {
    //计算生成提示
    tipcontent_phone() {
      return '如收不到验证码，请拨打客服热线 <a @click="doNothing" href="tel:' + this.qs_hotline + '" class="tel">' + this.qs_hotline +
        '</a>'
    },
    //验证码输入的值
    code_input() {
      return this.inputbox[1].value;
    }
  },
  components: {
    'v-inputbox': Inputbox,
    'v-tip': Tip,
    'v-nextstep': Nextstep,
    'v-mask': Mask,
    'v-alertbox': AlertBox,
    'v-numberinput': NumberInput,
    'v-keyboard': KeyBoard,
    'v-indicator': Indicator
  },
  methods: {
    call: function (e) {
      var self = this;
      this.is_can_call = false;
      setTimeout(function () {
        self.is_can_call = true;
      }, 1000);
    },
    clearPhone: function () { //电话号码输入框的清楚按钮点击事件
      this.inputbox[0].value = '';
    },
    codeNumber: function () { //验证码输入框的点击事件
      if (this.is_show_key_board == false) {
        this.is_show_key_board = true;
      }
      this.input_index = 1;
      this.inputbox[1].focus = true;
      this.inputbox[0].focus = false;
    },
    phoneNumber: function () { //电话号码输入框的点击事件
      if (this.is_can_input) {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.input_index = 0;
        this.inputbox[0].focus = true;
        this.inputbox[1].focus = false;
      }
    },
    closeKeyBoard: function () { //数字键盘的点击完成
      this.is_show_key_board = false;
      for (var i = 0; i < 2; i++) {
        this.inputbox[i].focus = false;
      }
    },
    clickKeyBoard: function (val) { //点击数字键盘按键事件
      var self = this;
      if (val == '安全输入') { } else if (val == '删除') {
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
        if (self.input_index == 0) {
          if (self.inputbox[0].value.length < 11) {
            self.inputbox[0].value += val;
          }
        }
        if (self.input_index == 1) {
          if (self.inputbox[1].value.length < 6) {
            self.inputbox[1].value += val;
          }
        }

      }
    },
    allowNext: function () { //获取开户步骤
      var self = this;
      axios.get(config.qsInterface + 'openaccountstate').then(function (response) {
        if (response.data.error_no == 0) {
          if (response.data.nextList.length < 1) {
            self.alertbox.content = ['无法获取开户步骤，请稍后再试'];
            self.alertbox.show = true;
            self.is_show_indicator = false;
          }
          localStorage.setItem('nextList', JSON.stringify(response.data.nextList))
          localStorage.setItem('allList', JSON.stringify(response.data.allList))
          // 申港没有RiskResult这个节点，改为使用risk_eval_finished字段来判断是否已经走了风险测评结果页
          localStorage.setItem('risk_eval_finished', response.data.risk_eval_finished)
          self.isRejected(response.data);
        } else {
          self.alertbox.content = [response.data.error_info];
          self.alertbox.show = true;
          self.is_show_indicator = false;
        }
      }).catch(function (error) {
        self.alertbox.content = ['获取开户进度失败'];
        self.alertbox.show = true;
        self.go_to_next_step_flag = false;
        self.is_show_indicator = false;
      });
    },
    isRejected: function (data) { //判断驳回
      localStorage.setItem("thirdParty", '');
      var nextListStr = data.nextList.toString();
      tools.nextpage = data.nextList[0];
      // !(nextListStr.indexOf('Revisitpaper') > -1)
      if (data.revisitkey == true) { //不含有问卷回访
        if (!(nextListStr.indexOf("openThirdPartyAccount") > -1)) { //不含有三方存管
          this.openAccountResult(data.nextList);
        } else {
          if (tools.nextpage == "openThirdPartyAccount") {
            var thirdParty = 'true';
            localStorage.setItem('thirdParty', thirdParty);
          }
          //排除正常走完流程的情况
          if (tools.nextpage != "OpenAccountResult") {
            //是否是步骤驳回标志：处理驳回时用户无法返回上一步骤
            sessionStorage.setItem("rejectedSign", "true");
            this.is_show_indicator = false;
            this.backToOpenAccountInfo(tools.nextpage);
            this.go_to_next_step_flag = false;
          }
        }
      } else {
        this.go_to_next_step_flag = true;
      }
      if (this.go_to_next_step_flag) {
        if (JSON.parse(localStorage.getItem('nextList')).length == 1) {
          localStorage.setItem('success', 'success');
        }
        tools.stepSync('Register');
        this.is_show_indicator = false;
        tools.afterBackToOpenAccountStep();
      }
    },
    openAccountResult: function (nextlist) {
      var self = this;
      axios.get(config.qsInterface + 'openaccountresult').then(function (response) {
        if (response.data.error_no == 0) {
          let openStatus = response.data.bank_account[0].open_status;
          if (openStatus == 2 || openStatus == 3) {
            nextlist[1] = 'openAccountResult';
            nextlist[0] = 'openThirdPartyAccount';
            localStorage.setItem('nextList', JSON.stringify(nextlist));
            tools.nextpage = 'openThirdPartyAccount';
          }
          if (tools.nextpage == "openThirdPartyAccount") {
            var thirdParty = 'true';
            localStorage.setItem('thirdParty', thirdParty);
          }
          //排除正常走完流程的情况
          self.go_to_next_step_flag = true;
          if (tools.nextpage != "OpenAccountResult") {
            //是否是步骤驳回标志：处理驳回时用户无法返回上一步骤
            sessionStorage.setItem("rejectedSign", "true");
            self.is_show_indicator = false;
            self.backToOpenAccountInfo(tools.nextpage);
            self.go_to_next_step_flag = false;
          }
          if (self.go_to_next_step_flag) {
            if (JSON.parse(localStorage.getItem('nextList')).length == 1) {
              localStorage.setItem('success', 'success');
            }
            tools.stepSync('Register');
            self.is_show_indicator = false;
            tools.afterBackToOpenAccountStep();
          }
        } else {
          self.alertbox.content = [response.data.error_info];
          self.alertbox.show = true;
          self.is_show_indicator = false;
        }
      }).catch(function (error) {
        self.alertbox.content = ['获取开户结果失败！'];
        self.alertbox.show = true;
        self.is_show_indicator = false;
      });
    },
    backToOpenAccountInfo(nextpage) { //驳回提示信息
      this.is_show_indicator = false;
      switch (nextpage) {
        case "Sendpic":
          this.alertbox.content = ["由于您的照片审核不通过,请重新上传照片"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "updateClientInfo":
          this.alertbox.content = ["由于您的资料审核不通过,请修改为真实的个人信息"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "updateOpenBranch":
          this.alertbox.content = ["由于您选择的营业部审核不通过,请重新选择"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "reqVideo":
          this.alertbox.content = ["由于您视频见证审核不通过,请重新进行视频见证"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "certinstall":
          this.alertbox.content = ["由于您证书安装审核不通过,请重新申请安装证书"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "Testpaper":
          this.alertbox.content = ["由于风险测评结果审核不通过,请重新测评"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "AgreementSign":
          this.alertbox.content = ["由于您协议签署审核不通过,请重新签署协议"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "openStockAccount":
          this.alertbox.content = ["由于您开立账户审核不通过,请重新开立账户"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "setPassword":
          this.alertbox.content = ["由于您密码设置审核不通过,请重新设置密码"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "openThirdPartyAccount":
          this.alertbox.content = ["由于您三方存管绑定审核不通过,请重新绑定三方存管"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
        case "Revisitpaper":
          this.alertbox.content = ["由于您问卷回访审核不通过,请重新填写问卷回访"];
          this.alertbox.show = true;
          this.alertbox.pagenext = true;
          break;
      }
    },
    clickNextStep: function () { //点击下一步按钮事件
      var self = this;
      if (this.nextstep.next) {
        this.is_show_indicator = true;
        if (window.navigator.userAgent.indexOf('iPhone') > -1) {
          this.closeKeyBoard();
        }
        callNativeHandler('khh5', {
          "action": "getNetworkType",
          "reqId": "getNetworkType",
          "param": {}
        }, function (data) {
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          if (data.param.networkType == '0') {
            self.alertbox.content = ['网络连接失败，请重新连接网络'];
            self.alertbox.show = true;
            self.is_show_indicator = false;
          } else {
            self.register();
          }
        });
      }
    },
    showBankList: function () { //显示银行列表
      this.showbanklist = true;
    },
    switchBankList: function () { //跳转对应驳回页面
      this.showbanklist = false;
      this.alertbox.show = false;
      if (this.alertbox.pagenext) {
        switch (tools.nextpage) {
          case 'Sendpic':
            router.push('/sendpic/2');
            break;
          case "updateClientInfo":
            router.push('/updateclientinfo/3');
            break;
          case "updateOpenBranch":
            router.push('/updateopenbranch/4');
            break;
          case "reqVideo":
            router.push('/reqvideo/5');
            break;
          case "certinstall":
            router.push('/certinstall/6');
            break;
          case "Testpaper":
            router.push('/testpaper/7');
            break;
          case "AgreementSign":
            router.push('/agreementsign/9');
            break;
          case "openStockAccount":
            router.push('/openstockaccount/10');
            break;
          case "setPassword":
            router.push('/setpassword/11');
            break;
          case "openThirdPartyAccount":
            router.push('/openthirdpartyaccount/12');
            break;
          case "Revisitpaper":
            {
              router.push('/revisitpaper/13');
              break;
            }
        }
      }
    },
    getCheckCode: function () { //发送验证码
      var self = this;
      if (this.code_btn.can_click == true) {
        axios.get(config.qsInterface + 'sendcode', {
          params: {
            mobile_tel: self.inputbox[0].value,
            qsId: config.qsId,
            open_type: 1
          }
        }).then(function (response) {
          if (response.data.error_no != 0) {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.alertbox.content = ['发送验证码失败'];
          self.alertbox.show = true;
        });
        var time = 60;
        this.alreadysend = true;
        this.code_btn.can_click = false;
        this.code_btn.text = time + 's';

        var timer = setInterval(function () {
          time--;
          self.code_btn.text = time + 's';
          if (time == 0) {
            self.code_btn.text = '重新发送';
            self.code_btn.can_click = true;
            clearInterval(timer);
          }
        }, 1000);
      }
    },
    showInputText: function (val) { //获取手机号码的值
      this.inputbox[0].value = val;
    },
    register: function () { //注册接口
      var self = this;
      axios.get(config.qsInterface + 'register', {
        params: {
          qsid: config.qsId,
          mobile_tel: self.inputbox[0].value,
          mobile_code: self.inputbox[1].value,
          open_flag: 1,
          channel: 'html5'
        }
      }).then(function (response) {
        if (response.data.error_no == 0) {
          localStorage.setItem('registerInfo', JSON.stringify(response.data));
          localStorage.setItem('telKey', JSON.stringify(self.inputbox[0].value.substring(5, 11)));
          if (config.qsId == '322') {
            sessionStorage.setItem("branch_no", tools.getcookie("branch_no"));
          }
          self.allowNext();
        } else {
          self.alertbox.content = [response.data.error_info];
          self.alertbox.show = true;
          self.is_show_indicator = false;
        }
      }).catch(function (error) {
        self.alertbox.content = ['手机验证失败'];
        self.alertbox.show = true;
        self.is_show_indicator = false;
      });
    },
    //提示信息的下拉动画
    beforeEnter: function (el) {
      el.style.height = 0;
      el.style.opacity = 0;
      el.style.transformOrigin = 'top'
    },
    enter: function (el, done) {
      Velocity(el, {
        opacity: 1,
        height: '24px'
      }, {
          duration: 300
        }, {
          complete: done
        })
    },
    doNothing: function () {
      return false
    }
  },
  created: function () {
    // 测试环境代码
    router.push('/revenue/15');
    var self = this;
    tools.clearUserlessCookie(); //清理不必要的cookie
    bus.$emit('titleName', this.title, 1);
    callNativeHandler('khh5', {
      "action": "getPhoneNum",
      "reqId": "getPhoneNum",
      "param": {}
    }, function (data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (!data.param.mobileTel) {
        self.is_can_input = true;
      }
      self.inputbox[0].value = data.param.mobileTel || '';
      //手机号伪码
      localStorage.setItem('recognizeId', data.param.recognizeId);
    });
    if (JSON.parse(localStorage.getItem('qsDetail'))) {
      self.qs_hotline = JSON.parse(localStorage.getItem('qsDetail')).qs_hotline;
      self.tel_href = 'tel:' + JSON.parse(localStorage.getItem('qsDetail')).qs_hotline;
    };
    if (JSON.parse(localStorage.getItem('bankList'))) {
      self.banklist = JSON.parse(localStorage.getItem('bankList')).resultList;
    }
  },
  watch: {
    code_input: function (val, oldval) { //检测验证码输入框值得改变
      if (val.length >= 4) {
        this.nextstep.next = true;
      } else {
        this.nextstep.next = false;
      }
    }
  }
}

</script>
<style>
.preopenaccount {
  margin-top: 0.5rem;
  width: 100%;
  font-size: 0.32rem;
  color: #999;
  padding-bottom: 0.1rem;
  border-bottom: 1px solid #d7d7d7;
  text-align: center;
  font-weight: 400;
}

.tel:hover {
  cursor: pointer;
}

.precondition {
  width: 100%;
  text-align: center;
  margin-top: 0.2rem;
  font-size: 0.32rem;
  color: #999;
  padding: 0 0.15rem;
  box-sizing: border-box;
  margin-top: 0.25rem;
}

.precondition ul li {
  float: left;
  display: block;
  width: 33.33%;
  color: #999;
  text-align: center;
}

.precondition ul li img {
  width: 0.8rem;
  height: 0.6rem;
}

.precondition ul li p {
  margin-top: 0.2rem;
  font-size: 0.32rem;
}

.supportbank {
  width: 100%;
  color: #3a83d7;
  text-align: center;
  bottom: 0.3rem;
  margin-top: 0.3rem;
  font-size: 0.32rem;
}

.bankicon {
  width: 100%;
  padding: 0.3rem;
  bottom: 0;
  background-color: #eee;
  position: fixed;
  z-index: 901;
  font-size: 0.32rem;
  box-sizing: border-box;
  transition: all 0.5s linear;
  transform: translate3d(0, 10rem, 0);
}

.bankicon-show {
  transform: translate3d(0, 0, 0);
}

.bankicon ul li {
  padding: 0.1rem 0;
}

.bankicon ul li img {
  width: 0.64rem;
  height: 0.32rem;
  margin-right: 0.2rem;
}

.bankicon ul li ol {
  font-size: 0;
}

.bankicon ul li ol li {
  width: 50%;
  float: left;
  font-size: 0.32rem;
  color: #666;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
}

.bankicon ul li ol li:nth-child(2n) {
  padding-left: 0.3rem;
}

#olone {
  padding-left: 0.3rem;
}

#oltwo {
  padding-left: 0.3rem;
}

.bankicon p {
  font-size: 0.34rem;
  color: #222;
  margin-bottom: 0.4rem;
}


/*.slideUp-enter-active,
  .slideUp-leave-active {
    transition: all 0.5s;
  }

  .messagecheck .slideUp-enter,
  .messagecheck .slideUp-leave-active {
    bottom: -10rem;
  }*/

.slide-box {
  overflow: hidden;
}

.codebox {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  box-sizing: border-box;
  font-size: 0.34rem;
  background-color: #fff;
  position: relative;
  box-sizing: border-box;
}

.codebox input {
  width: 100%;
  border: none;
  height: 1rem;
  line-height: normal;
  color: #333;
  padding-left: 2.9rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}

.codebox input.focus {
  box-shadow: 0 0 7px #3a83d7;
}

.codebox label {
  position: absolute;
  width: 2rem;
  display: inline-block;
  color: #333;
  left: 0.3rem;
}

.codebox .code-btn {
  width: 1.8rem;
  height: 0.7rem;
  position: absolute;
  top: 50%;
  margin-top: -0.35rem;
  right: 0;
  border-radius: 0.1rem;
  line-height: 0.7rem;
  text-align: center;
  background-color: #3a83d7;
  color: #fff;
  border: 1px solid #3a83d7;
  margin-right: 0.2rem;
  font-size: 0.3rem;
}

.codebox .code-already-send {
  background-color: #fff;
  color: #3a83d7;
  border: 1px solid #d7d7d7;
}
</style>
