<template>
  <div class="agreementsign">
    <div class="agreement-content" style="margin-top: 0.2rem;">
      <v-agreementbox :agreement_list="agreement_list" @showAgreement="showAgreement"></v-agreementbox>
    </div>
    <div class="assign-tips" v-if="is_show_tips">采用电子签名签订的电子合同、风险提示书具有与纸质合同、纸质风险提示书同等的法律效力。</div>
    <div class="certificate">
      <input type="checkbox" v-model="checked" style="display: none;" id="agree">
      <label for="agree" :class="{unchecked:!checked}">我已认真阅读并同意签署<span class="resultPage">《客户风险承受能力初次评估结果告知函》</span></label>
    </div>
    <div class="agreement-bottom">
      <v-nextstep :next="nextstep.next && checked" :text="nextstep.text" class="bottom-next-btn" @goNext="allowNext"></v-nextstep>
    </div>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-alertcontent @closeAlertContent="closeAlertContent" :is_show="alertcontent.show" :content="alertcontent.content"></v-alertcontent>
    <v-mask :is_show="alertcontent.show || alertbox.show" @hide="cancelSelect"></v-mask>
    <v-reloadbox :content="reloadbox.content" @clickReload="clickReload" @backPage="backPage" v-if="reloadbox.show"></v-reloadbox>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>

<script>
  import router from '../../router'
  import AgreementBox from '../component/AgreementBox'
  import Nextstep from '../component/NextStep'
  import AlertContent from '../component/AlertContent'
  import Alertbox from '../component/AlertBox'
  import ReloadBox from '../component/ReloadBox'
  import Indicator from '../component/Indicator'
  import Mask from '../component/Mask'
  import axios from 'axios'
  
  import bus from '../../bus'
  import config from '../../config'
  import cert from '../../cert'
  import agreement from '../../agreement'
  import tools from '../../tools'

  export default {
    name: 'agreementsign',
    data() {
      return {
        title: '签署协议',//标题
        nextstep: {
          next: true,
          text: '已阅读并同意签署'
        },
        agreement_list: [],//协议列表
        is_show_indicator: true,//是否显示加载图标
        is_show_tips: true, // 是否显示风险提示
        is_degree_same_account: false, // 用户风险等级是否和开立账户匹配
        checked: true, // 是否选中单选框
        alertcontent: {
          content: '',
          show: false,
        },
        alertbox: {
          content: [],
          show: false
        },
        is_sign_agreement: 1,
        is_agreement_success: [],//协议是否签署成功
        reloadbox: {
          content: '',
          show: false
        }
      }
    },
    components: {
      'v-nextstep': Nextstep,
      'v-agreementbox': AgreementBox,
      'v-alertcontent': AlertContent,
      'v-mask': Mask,
      'v-alertbox': Alertbox,
      'v-reloadbox': ReloadBox,
      'v-indicator': Indicator
    },
    methods: {
      clickReload: function () {
        this.getAgreementList();
      },
      backPage: function () {
        tools.exitKaihu();
      },
      closeAlertBox: function () {
        this.alertbox.show = false;
      },
      allowNext: function () {
        this.is_show_indicator = true;
        if(config.qsId == '109'){
          this.forEachAgreement();
        }
        else{
          this.isCertInstall();
        }
      },
      showAgreement: function (no) {//显示协议内容
        this.is_show_indicator = true;
        var self = this;
        axios.get(config.qsInterface + 'agreementDetail', {
          params: {
            econtract_id: no,
            qsid: config.qsId,
            type: ''
          }
        }).then(function (response) {
          self.is_show_indicator = false;
          if (response.data.error_no == 0) {
            self.alertcontent.content = response.data.econtract_content;
            self.alertcontent.show = true;
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          console.log(error);
          self.is_show_indicator = false;          
        });
      },
      closeAlertContent: function () {
        this.alertcontent.show = false;
      },
      cancelSelect: function () {
        this.alertcontent.show = false;
        this.alertbox.show = false;
      },
      isCertInstall: function () {//是否安装证书
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
              self.forEachAgreement();
            }
          } else {
            cert.zhongDengCertApplyState(self, 2);
          }
        });
      },
      forEachAgreement: function () {//遍历协议，尽心签署
        var self = this;
        if (this.is_sign_agreement == 0) {
           this.is_show_indicator = false;
           tools.stepSync('AgreementSign');
           var nextlist = JSON.parse(localStorage.getItem('nextList'));
           tools.nextpage = nextlist[nextlist.indexOf('AgreementSign')+1];
           tools.afterBackToOpenAccountStep();
        } else {
          if(config.qsId != '109'){
            cert.zhongDengCertQuery('0', this, 2);
          }
          for (let i = 0; i < this.agreement_list.length; i++) {
            agreement.getSignCert(self.agreement_list[i], i, self, 2);
          }
        }
      },
      getAgreementList: function () {//获取协议列表
        var self = this;
        axios.get(config.qsInterface + 'agreementList').then(function (response) {
          if (response.data.error_no == 0) {
            if (self.is_sign_agreement == 0) {
              self.is_agreement_success[0] = false;
            } else {
              for (var i = 0; i < response.data.resultList.length; i++) {
                self.is_agreement_success[i] = false;
              }
            }
            self.agreement_list = response.data.resultList;
            self.is_show_indicator = false;
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = '获取电子协议列表失败，请重新加载';
            self.reloadbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.reloadbox.content = '获取电子协议列表失败，请重新加载';
          self.reloadbox.show = true;
        });
      }
    },
    created: function () {
      bus.$emit('titleName', this.title, 9);
      this.getAgreementList();
    }

  }

</script>

<style>
  .agreement-bottom {
    position: fixed;
    bottom: 0;
    height: 1.3rem;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #eee;
  }

  .bottom-next-btn {
    margin: 0.2rem auto 0.3rem;
  }

  .assign-tips {
    font-size: .28rem;
    color: #999;
    padding: .24rem .16rem;
    background: #fff;
  }
  .certificate {
    padding-bottom: 1.5rem;
  }
</style>
