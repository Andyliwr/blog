<template>
  <div class="openthirdpartyaccount">
    <v-tip :content="tipcontent[0]" style="padding:0.2rem 0.3rem;"></v-tip>
    <v-selectbox :labeltitle="selectbox.labeltitle" :options="selectbox.options" @selectItem="selectItem" style="border-top:1px solid #d7d7d7;"></v-selectbox>
    <div class="bank-num" style="margin-top:0.2rem;">
      <v-numberinput :labeltitle="inputbox[0].labeltitle" :placeholder="inputbox[0].placeholder" v-if="is_show_banknum" :value="inputbox[0].value"
        :isfocus="inputbox[0].focus" @Input="bankNum" @clearInputValue="clearBankNum"></v-numberinput>
    </div>
    <div class="bank-pwd" v-if="is_show_bankpwd" style="margin-top:0.2rem;">
      <v-numberinput :labeltitle="inputbox[1].labeltitle" :placeholder="inputbox[1].placeholder" :value="inputbox[1].value" :isfocus="inputbox[1].focus"
        @Input="bankPwd" @clearInputValue="clearBankPwd" :ispassword="inputbox[1].is_password"></v-numberinput><span class="icon-eye" @click="showPassword"><img src="../../images/setPassword/view.png" alt="" v-if="is_show_pwd"><img src="../../images/setPassword/unview.png" alt="" v-else></span></div>
    <div class="bank-notice">
      <v-tip :content="tipcontent[1]" style="padding:0 0.3rem;" v-if="banknotice1"></v-tip>
      <v-tip :content="tipcontent[2]" style="padding:0 0.3rem;" v-if="banknotice2"></v-tip>
    </div>
    <v-tip :content="tipcontent[3]" style="padding:0.2rem 0.3rem;"></v-tip>
    <v-agreementbox :agreement_list="agreement_list" style="border-top:1px solid #d7d7d7;" @showAgreement="showAgreement"></v-agreementbox>
    <div class="certificate" style="margin-top:0.2rem;"><input type="checkbox" v-model="checked" style="display: none;" id="agree"><label for="agree" :class="{unchecked:!checked}">我已认真阅读并同意签署以上协议</label></div>
    <v-nextstep :next="nextstep.next" :text="nextstep.text" @goNext="allowNext"></v-nextstep>
    <v-keyboard @closeKeyBoard="closeKeyBoard" v-if="is_show_key_board" @clickKeyBoard="clickKeyBoard"></v-keyboard>

    <div class="bank-box">
      <transition name="scale">
        <div class="bank-alert" v-if="is_show_bank_box">
          <h2>请确认您的存管银行</h2>
          <div class="bank-info">
            <div class="bank-icon"><img :src="bank_box.bank_icon" alt=""></div>
            <div class="bank-content">
              <div class="inner-box">
                <div class="bank-name"> {{bank_box.bank_name}}
                </div>
                <div class="bank-account" v-if="is_show_banknum"> {{inputbox[0].value}}

                </div>
              </div>
            </div>
          </div>
          <div class="pwd-box" v-if="is_show_bankpwd">
            <v-numberinput :labeltitle="inputbox[2].labeltitle" :value="this.inputbox[1].value" :ispassword="inputbox[2].is_password"
              @Input="bankBoxPwd"></v-numberinput><span class="icon-eye" @click="showBankBoxPassword"><img src="../../images/setPassword/view.png" alt="" v-if="is_show_bank_box_pwd"><img src="../../images/setPassword/unview.png" alt="" v-else></span></div>
          <div class="tips" v-if="is_show_bankpwd">
            <p v-for="item in bank_box.bank_tip"> {{item}}

            </p>
          </div>
          <div class="bank-alert-btn" :class="{'border-top':!is_show_bankpwd}">
            <div class="back" @click="hide">返回修改 </div>
            <div class="comfirm" @click="goNextPage">确定 </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="hide"></v-alertbox>
    </div>
    <v-mask @hide="hide" :is_show="is_show_mask"></v-mask>
    <v-alertcontent @closeAlertContent="hide" :is_show="alertcontent.show" :content="alertcontent.content"></v-alertcontent>
    <v-reloadbox :content="reloadbox.content" @clickReload="clickReload" @backPage="backPage" v-if="reloadbox.show"></v-reloadbox>
    <v-indicator v-if="is_show_indicator"></v-indicator>
    <div class="block" style="height:240px;width:100%;" v-if="is_show_key_board">
    </div>
  </div>
</template>
<script>
  import router from '../../router'
  import Tip from '../component/Tip.vue'
  import Selectbox from '../component/SelectBox'
  import Nextstep from '../component/NextStep'
  import AgreementBox from '../component/AgreementBox'
  import axios from 'axios'
  
  import bus from '../../bus'
  import config from '../../config'
  import cert from '../../cert'
  import tools from '../../tools'
  import agreement from '../../agreement'
  import NumberInput from '../component/NumberInput'
  import Keyboard from '../component/keyboard'
  import Mask from '../component/Mask'
  import Alertbox from '../component/AlertBox'
  import AlertContent from '../component/AlertContent'
  import Indicator from '../component/Indicator'
  export default {
    name: 'openthirdpartyaccount',
    data() {
      return {
        title: '三方存管',
        tipcontent: ['选择开户银行',
          '',
          '',
          '签署三方存管协议'
        ],
        checked: true,
        has_content: false,
        is_show_banknum: false,
        is_show_bankpwd: false,
        is_show_key_board: false,
        is_show_indicator: false,
        is_show_pwd: false,
        nextstep: {
          next: true,
          text: '下一步'
        },
        banknotice1: false,
        banknotice2: false,
        agreement_list: [{
          econtract_name: '《三方存管协议》',
          econtract_id: ''
        }],
        inputbox: [{
            labeltitle: '银行卡号',
            placeholder: '请输入银行账号',
            value: '',
            focus: false,
          },
          {
            labeltitle: '密码',
            placeholder: '请输入银行卡密码',
            value: '',
            focus: false,
            is_password: true
          },
          {
            labeltitle: '密码',
            is_password: true
          }
        ],
        selectbox: {
          labeltitle: '选择银行',
          options: []
        },
        is_agreement_success: [],
        bankItem: '',
        input_index: '',
        is_show_bank_box: false,
        is_show_bank_box_pwd: false,
        alertbox: {
          content: [],
          show: false
        },
        bank_box: {
          bank_name: '',
          bank_icon: '',
          bank_tip: []
        },
        alertcontent: {
          content: '',
          show: false
        },
        reloadbox: {
          content: '',
          show: false,
          getAgreement: true,
          getBank: true
        }
      }
    },
    components: {
      'v-tip': Tip,
      'v-nextstep': Nextstep,
      'v-selectbox': Selectbox,
      'v-agreementbox': AgreementBox,
      'v-numberinput': NumberInput,
      'v-keyboard': Keyboard,
      'v-mask': Mask,
      'v-alertbox': Alertbox,
      'v-alertcontent': AlertContent,
      'v-indicator': Indicator
    },
    methods: {
      clickRealod: function () {
        if (this.reloadbox.getAgreement == false) {
          this.getAgreement();
        }
        if (this.reloadbox.getBank == false) {
          this.getBank();
        }
      },
      backPage: function () {
        tools.exitKaihu();
      },
      showAgreement: function (id) {
        var self = this;
        if (this.bankItem == '') {
          return;
        } else {
          this.is_show_indicator = true;
          if (this.bankItem.multi_econtract == 1) {
            axios.get(config.qsInterface + 'agreementdetail', {
              params: {
                econtract_id: id
              }
            }).then(function (response) {
              self.is_show_indicator = false;
              if (response.data.error_no == 0) {
                self.alertcontent.content = response.data.econtract_content.replace(/\\/g, '');
                self.alertcontent.show = true;
              } else {
                self.alertbox.content = [response.data.error_info];
                self.alertbox.show = true;
              }
            }).catch(function (error) {
              self.is_show_indicator = false;
              self.alertbox.content = ['查看协议请求失败'];
              self.alertbox.show = true;
            })
          } else {
            if (!this.has_content) {
              axios.get(config.qsInterface + 'agreementdetail', {
                params: {
                  econtract_id: id
                }
              }).then(function (response) {
                self.is_show_indicator = false;
                if (response.data.error_no == 0) {
                  self.alertcontent.content = response.data.econtract_content.replace(/\\/g, '');
                  self.alertcontent.show = true;
                  self.has_content = true;
                } else {
                  self.alertbox.content = [response.data.error_info];
                  self.alertbox.show = true;
                }
              }).catch(function (error) {
                self.is_show_indicator = false;
                self.alertbox.content = ['查看协议请求失败'];
                self.alertbox.show = true;
              })
            } else {
              self.alertcontent.show = true;
              self.is_show_indicator = false;
            }
          }
        }

      },
      bankBoxPwd: function () {},
      hide: function () {
        this.is_show_bank_box = false;
        this.alertbox.show = false;
        this.alertcontent.show = false;
      },
      goNextPage: function () {
        this.is_show_bank_box = false;
        this.is_show_indicator = true;
        if(config.qsId == '109'){
          this.uploadThirdPartyAccount();;
        }
        else{
          this.isCertInstall();
        }
      },
      showBankBoxPassword: function () {
        this.is_show_bank_box_pwd = !this.is_show_bank_box_pwd;
        this.inputbox[2].is_password = !this.inputbox[2].is_password;
      },
      showPassword: function () {
        this.is_show_pwd = !this.is_show_pwd;
        this.inputbox[1].is_password = !this.inputbox[1].is_password;
      },
      bankNum: function () {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.inputbox[0].focus = true;
        this.inputbox[1].focus = false;
        this.input_index = 0;
      },
      bankPwd: function () {
        if (this.is_show_key_board == false) {
          this.is_show_key_board = true;
        }
        this.inputbox[1].focus = true;
        this.inputbox[0].focus = false;
        this.input_index = 1;
      },
      clearBankNum: function () {
        this.inputbox[0].value = '';
      },
      clearBankPwd: function () {
        this.inputbox[1].value = '';
      },
      closeKeyBoard: function () {
        this.is_show_key_board = false;
        for (var i = 0; i < 2; i++) {
          this.inputbox[i].focus = false;
        }
      },
      clickKeyBoard: function (val) {
        if (val == '安全输入') {} else if (val == '删除') {
          if (this.inputbox[this.input_index].value.length > 1) {
            if (this.input_index == 0) {
              if (this.inputbox[0].value.substr(-1) == ' ') {
                this.inputbox[this.input_index].value = this.inputbox[this.input_index].value.substring(0, this.inputbox[
                  this.input_index].value.length - 2);
              } else {
                this.inputbox[this.input_index].value = this.inputbox[this.input_index].value.substring(0, this.inputbox[
                  this.input_index].value.length - 1);
              }
            } else {
              this.inputbox[this.input_index].value = this.inputbox[this.input_index].value.substring(0, this.inputbox[
                this.input_index].value.length - 1);
            }
          } else if (this.inputbox[this.input_index].value.length == 1) {
            this.inputbox[this.input_index].value = this.inputbox[this.input_index].value.substring(0, this.inputbox[
              this.input_index].value.length - 1);
          }
        } else {
          if (this.input_index == 1) {
            if (this.inputbox[this.input_index].value.length < 6) {
              this.inputbox[this.input_index].value += val;
            }
          }
          if (this.input_index == 0) {
              this.inputbox[this.input_index].value += val;
              if (this.inputbox[this.input_index].value.replace(/ /g, '').length % 4 == 0) {
                this.inputbox[this.input_index].value += ' ';
              }
          }
        }
      },
      isCertInstall: function () {
        var self = this;
        var userId = cert.createUserId();
        callNativeHandler('khh5', {
          "action": "isCertInstall",
          "reqId": "isCertInstall",
          "param": {
            "userId": userId
          }
        }, function (data) {
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          if (data.param.flag == 0) {
            if (data.param.networkType == 0) {
              self.is_show_indicator = false;
              self.alertbox.content = ["网络连接失败，请重新连接网络！"];
              self.alertbox.show = true;
            } else {
              self.uploadThirdPartyAccount();
            }
          } else {
            cert.zhongDengCertApplyState(self, 3);
          }
        });
      },
      uploadThirdPartyAccount: function () {
        var qsDetail = JSON.parse(localStorage.getItem('qsDetail'));
        var is_sign_agreement = qsDetail.qs_is_sign_agreement;
        if (config.qsId != '59' && config.qsId != '340' && is_sign_agreement == '1') {
          var sign = this.isAgreementSign();
          if (!sign) {
            this.is_show_indicator = false;
            this.alertbox.content = ['协议签署失败，请重新签署'];
            this.alertbox.show = true;
            return;
          }
        }
      },
      openThirdPartyAccount: function () {
        var obj = {
          bank_no: this.bankItem.bank_no,
          bank_account: this.inputbox[0].value.replace(/ /g, ''),
          bk_password: this.inputbox[1].value,
          encode_type: '0',
          fun_flag: this.bankItem.fun_flag
        };
        var self = this;
        axios.get(config.qsInterface + 'openthirdpartyaccount', {
          params: obj
        }).then(function (response) {
          if (response.data.error_no == 0) {
            self.is_show_indicator = false;
            var nextlist = JSON.parse(localStorage.getItem('nextList'));
            tools.nextpage = nextlist[nextlist.indexOf('openThirdPartyAccount') + 1];
            tools.afterBackToOpenAccountStep();
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.alertbox.content = ['存管银行绑定失败'];
          self.alertbox.show = true;
        })
      },
      isAgreementSign: function () {
        var self = this;
        if(config.qsId != '109'){
          cert.zhongDengCertQuery(0, this, 3);
        }
        var multiEcontract = sessionStorage.getItem("multiEcontract");
        if (multiEcontract == '1') {
          var agreementList = JSON.parse(localStorage.getItem("agreementList"));
          for (var i = 0; i < agreementList.length; i++) {
            agreement.getSignCert(agreementList[i], i, this, 3);
          }
        } else {
          this.getAgreement();
        }
        return true;
      },
      getAgreement: function () {
        var self = this;
        axios.get(config.qsInterface + 'agreementdetail', {
          params: {
            econtract_id: self.bankItem.econtract_id
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            var agreementList = [response.data];
            for (var i = 0; i < agreementList.length; i++) {
              agreement.getSignCert(agreementList[i], i, self, 3);
            }
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = '获取单个协议内容失败，请重新加载。';
            self.reloadbox.show = true;
            self.getAgreement = false;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.reloadbox.content = '获取单个协议内容失败，请重新加载。';
          self.reloadbox.show = true;
          self.getAgreement = false;
        });
      },
      allowNext: function () {
        this.closeKeyBoard();
        if (this.bankItem == '') {
          this.alertbox.content = ['请选择开户银行'];
          this.alertbox.show = true;
          return;
        } else {
          if (this.is_show_banknum) {
            if (this.inputbox[0].value.replace(/ /g, '').length == 0) {
              this.alertbox.content = ['银行卡号不能为空'];
              this.alertbox.show = true;
              return;
            } else {
              if (this.luhnCheck(this.inputbox[0].value.replace(/ /g, ''))) {
                if (this.is_show_bankpwd) {
                  if (this.inputbox[1].value.length == 0) {
                    this.alertbox.content = ['密码不能为空'];
                    this.alertbox.show = true;
                    return;
                  } else {
                    if (this.inputbox[1].value.length != 6) {
                      this.alertbox.content = ['密码必须为6位数字'];
                      this.alertbox.show = true;
                      return;
                    } else {
                      if (this.checked) {
                        this.showBankBox();
                      } else {
                        this.alertbox.content = ['请签署协议'];
                        this.alertbox.show = true;
                        return;
                      }
                    }
                  }
                } else {
                  if (this.checked) {
                    this.showBankBox();
                  } else {
                    this.alertbox.content = ['请签署协议'];
                    this.alertbox.show = true;
                    return;
                  }
                }
              } else {
                this.alertbox.content = ['银行卡号必须符合Luhn校验'];
                this.alertbox.show = true;
                return;
              }
            }
          } else {
            if (this.checked) {
              this.showBankBox();  
            } else {
              this.alertbox.content = ['请签署协议'];
              this.alertbox.show = true;
              return;
            }
          }
        }
      },
      showBankBox: function () {
        this.is_show_bank_box = true;
        this.bank_box.bank_name = this.bankItem.bank_name;
        this.bank_box.bank_icon = this.bankItem.bank_logo_large;
        this.bank_box.bank_tip = [];
        if (this.bankItem.pinyin == 'zhongguo') {
          this.bank_box.bank_tip.push(this.bank_box.bank_name + '需输入电话银行密码,不是ATM机取款密码。如果不知道密码，您可以:');
        }
        if (this.bankItem.pinyin == 'minsheng') {
          this.bank_box.bank_tip.push(this.bank_box.bank_name + '需输入银行查询密码,不是ATM机取款密码。如果不知道密码，您可以:');
        }
        this.bank_box.bank_tip.push('咨询' + this.bank_box.bank_name + '客服' + this.bankItem.bank_tel);
        this.bank_box.bank_tip.push('更换其他银行卡');
      },
      luhnCheck: function (bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) {
          //前15或18位倒序存进数组
          newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
          if ((j + 1) % 2 == 1) {
            //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
          } else //偶数位
            arrOuShu.push(newArr[j]);
        }
        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
          jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
          jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }
        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
          sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }
        for (var n = 0; n < arrOuShu.length; n++) {
          sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }
        for (var p = 0; p < jishu_child1.length; p++) {
          sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
          sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        } //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2); //计算Luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;
        if (lastNum == luhn && lastNum.length != 0) {
          return true;
        } else {
          return false;
        }
      },
      selectItem: function (bank_name) {
        this.has_content = false;
        this.inputbox[0].value = '';
        this.inputbox[1].value = '';
        var self = this;
        if (bank_name == "请选择") {
          this.is_show_banknum = false;
          this.is_show_bankpwd = false;
          this.banknotice1 = false;
          this.banknotice2 = false;
          this.bankItem = '';
          this.agreement_list = [{
            econtract_name: '《三方存管协议》',
            econtract_id: ''
          }];
        } else {
          for (var i = 0; i < this.selectbox.options.length; i++) {
            if (bank_name == this.selectbox.options[i].bank_name) {
              this.bankItem = this.selectbox.options[i];
              if (this.selectbox.options[i].is_support_multi_qs == "0") {
                this.tipcontent[1] = "如果您已在其他券商绑定过" + bank_name + "，请您用另外一张" + bank_name + "卡或选择其他银行绑定"
                this.banknotice1 = true;
              } else {
                this.banknotice1 = false;
              }
              if (this.selectbox.options[i].boundWay == '1') {
                this.tipcontent[2] = "开户成功后，首笔资金转入证券账户，需登录网上银行从银行端发起";
                this.banknotice2 = true;
              } else if (this.selectbox.options[i].boundWay == '2') {
                this.banknotice2 = true;
                this.tipcontent[2] = "开户成功后，请登录网上银行完成三方存管签约";
              } else if (this.selectbox.options[i].boundWay == '3') {
                this.tipcontent[2] = "先开通网银，完成三方存管签约，再登录网银完成三方存管签约手续";
                this.banknotice2 = true;
              } else {
                this.banknotice2 = false;
              }
              if (this.selectbox.options[i].bank_flag == '11') {
                this.is_show_banknum = true;
                this.is_show_bankpwd = true;
                if (this.selectbox.options[i].pinyin == 'zhongguo') {
                  this.inputbox[1].labeltitle = '查询密码';
                  this.inputbox[1].placeholder = "请输入电话银行密码";
                } else if (this.selectbox.options[i].pinyin == 'minsheng') {
                  this.inputbox[1].labeltitle = '查询密码';
                  this.inputbox[1].placeholder = "请输入银行查询密码";
                } else {
                  this.inputbox[1].labeltitle = '密码';
                  this.inputbox[1].placeholder = "请输入银行卡密码";
                }
              } else if (this.selectbox.options[i].bank_flag == '12' || this.selectbox.options[i].bank_flag == '21') {
                this.is_show_banknum = true;
                this.is_show_bankpwd = false;
              } else if (this.selectbox.options[i].bank_flag == '22') {
                this.is_show_banknum = false;
                this.is_show_bankpwd = false;
              }
              if (this.selectbox.options[i].multi_econtract == "1") {
                sessionStorage.setItem("multiEcontract", "1");
                axios.get(config.qsInterface + 'agreementlist', {
                  params: {
                    econtract_id: this.selectbox.options[i].econtract_id,
                    type: "bank"
                  }
                }).then(function (response) {
                  if (response.data.error_no == 0) {
                    localStorage.setItem('agreementList', JSON.stringify(response.data.resultList));
                    self.agreement_list = [];
                    for (var j = 0; j < response.data.resultList.length; j++) {
                      self.agreement_list.push(response.data.resultList[i]);
                      self.is_agreement_success[j] = false;
                    }
                  } else {
                    self.alertbox.content = [response.data.error_info];
                    self.alertbox.show = true;
                  }
                }).catch(function (error) {
                  self.alertbox.content = ['获取协议配置列表失败'];
                  self.alertbox.show = true;
                });
              } else {
                if (config.qsId == '322') {
                  self.getAgreementName(self.selectbox.options[i].econtract_id);
                } else {
                  axios.get(config.qsInterface + 'AgreementDetail', {
                    params: {
                      econtract_id: self.selectbox.options[i].econtract_id,
                    }
                  }).then(function (response) {
                    if (response.data.error_no == 0) {
                      self.agreement_list = [];
                      var obj = response.data;
                      obj.econtract_name = '《三方存管协议》';
                      self.agreement_list.push(obj);
                    }
                  });
                }
              }
              break;
            }
          }
        }
      },
      getAgreementName(id) {
        var self = this;
        axios.get(config.qsInterface + 'agreementdetail', {
          params: {
            econtract_id: id,
            type: 'bank'
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            this.agreement_list = [];
            this.agreement_list.push(response.data);
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.alertbox.content = ['获取协议名称失败'];
          self.alertbox.show = true;
        });
      },
    },
    watch: {
      // is_show_key_board: function (val) {
      //   if (val) {
      //     document.querySelector('.openthirdpartyaccount').style.marginBottom = "240px";
      //   } else {
      //     document.querySelector('.openthirdpartyaccount').style.marginBottom = '0px';
      //   }
      // }
    },
    computed: {
      is_show_mask() {
        return this.alertbox.show || this.is_show_bank_box || this.alertcontent.show;
      }
    },
    created: function () {
      var self = this;
      bus.$emit('titleName', this.title, 12);
      if (config.qsId == '322') {
        this.is_show_indicator = true;
        axios.get(config.qsInterface + 'getbank', {
          params: {
            qsid: config.qsId,
            sms: '1',
            yybid: sessionStorage.getItem("branch_no")
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            self.selectbox.options = response.data.resultList;
            self.is_show_indicator = false;
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = '券商支持的银行列表加载失败，请重新加载。';
            self.reloadbox.show = true;
            self.reloadbox.getBank = false;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.reloadbox.content = '券商支持的银行列表加载失败，请重新加载。';
          self.reloadbox.show = true;
          self.reloadbox.getBank = false;
        });
      } else {
        self.selectbox.options = JSON.parse(localStorage.getItem('bankList')).resultList;
      }
    },
  }

</script>
<style>
  .bank-notice {
    margin-top: 0.2rem;
  }

  .bank-notice .tip .tip-content {
    font-size: 0.3rem;
    color: #f64d54;
  }

  .bank-pwd,
  .pwd-box {
    position: relative;
  }

  .bank-pwd .icon-eye {
    position: absolute;
    display: block;
    width: 0.5rem;
    height: 0.4rem;
    top: 0.3rem;
    right: 0.3rem;
  }

  .pwd-box .icon-eye {
    position: absolute;
    display: block;
    width: 0.5rem;
    height: 0.4rem;
    top: 0.3rem;
    right: 0.3rem;
  }

  .bank-pwd .icon-eye img,
  .pwd-box .icon-eye img {
    display: block;
    width: 0.5rem;
    height: 0.4rem;
  }

  .pwd-box input {
    padding-left: 1.3rem;
  }

  .bank-num input,
  .bank-pwd input {
    padding-left: 1.8rem;
  }

  .bank-box {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 5.3rem;
    height: auto;
    z-index: 906;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }

  .bank-box .scale-enter-active,
  .bank-box .scale-leave-active {
    transition: all 0.2s;
  }

  .bank-box .scale-enter,
  .bank-box .scale-leave-active {
    opacity: 0;
    transform: scale(0.8, 0.8);
  }

  .bank-alert {
    background-color: #fff;
    border-radius: 0.1rem;
    font-size: 0.32rem;
  }

  .bank-alert h2 {
    font-size: 0.36rem;
    width: 100%;
    text-align: center;
    color: #222;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #d7d7d7;
  }

  .bank-alert .bank-info {
    height: 1.3rem;
    width: 100%;
    display: flex;
    box-sizing: border-box;
  }

  .bank-alert .bank-info .bank-icon {
    flex: 0 0 1rem;
    height: 100%;
    line-height: 1.3rem;
    margin: 0 0.1rem;
  }

  .bank-alert .bank-info .bank-icon img {
    width: 0.9rem;
    height: 0.9rem;
    display: inline-block;
    
  }

  .bank-alert .bank-info .bank-content {
    flex: 1;
    height: 100%;
    display: table;
    font-size: 0.32rem;
    color: #666;
  }

  .bank-alert .bank-info .bank-content .inner-box {
    display: table-cell;
    vertical-align: middle;
  }

  .bank-alert .tips {
    padding: 0.2rem;
    color: #3a83d7;
    font-size: 0.24rem;
    border-bottom: 1px solid #d7d7d7;
    box-sizing: border-box;
  }

  .bank-alert .bank-alert-btn {
    width: 100%;
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.36rem;
    display: flex;
  }

  .bank-alert .border-top {
    border-top: 1px solid #d7d7d7;
  }

  .bank-alert .bank-alert-btn .back {
    flex: 1;
    height: 100%;
    border-right: 1px solid #d7d7d7;
    box-sizing: border-box;
  }

  .bank-alert-btn .comfirm {
    flex: 1;
    height: 100%;
    color: #3a83d7;
  }

</style>
