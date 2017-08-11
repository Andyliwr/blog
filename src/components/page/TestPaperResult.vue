<template>
  <div class="testpaperresult">
    <div class="sales">
      <div class="head">
        投资者风险评估结果确认书
      </div>
      <div class="content">
        <p class="score-p">您的风险测评分数为：
          <span class="score">{{ riskData.paper_score }}分</span>
        </p>
        <table>
          <tbody>
            <tr>
              <td>风险等级</td>
              <td>{{ riskData.risk_level_name }}
                <router-link class="goBack" to="/testpaper/7">重新测评</router-link>
              </td>
            </tr>
            <tr>
              <td>拟投资期限</td>
              <td>{{ riskData.en_invest_term || '1到5年' }}</td>
            </tr>
            <tr>
              <td>拟投资品种</td>
              <td>{{ riskData.en_invest_kind || '复杂或高风险金融产品' }}</td>
            </tr>
            <tr>
              <td>购买建议</td>
              <td>{{ riskData.suggest_risk_promot || '低风险、中低分享、中风险、高风险' }}</td>
            </tr>
          </tbody>
        </table>
        <p class="tips">{{ riskData.tips || '温馨提示：本公司向您销售的金融产品或提供的金融服务将以您的风险承受能力等级和投资品种、期限为基础，若您提供的信息发生任何重大变化，您都应当及时书面通知本公司' }}</p>
      </div>
      <div class="certificate">
        <input type="checkbox" v-model="checked" style="display: none;">
        <label :class="{unchecked:!checked}">我已认真阅读并同意签署
          <span class="resultPage" @click="openAgreement">《客户风险承受能力初次评估结果告知函》</span>
        </label>
      </div>
      <v-nextstep :next="nextstep.next" :text="nextstep.text" @goNext="allowNext"></v-nextstep>
      <div class="middle-center">
        <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
      </div>
      <v-alertcontent @closeAlertContent="closeAlertContent" :is_show="alertcontent.show" :content="alertcontent.content"></v-alertcontent>
      <v-mask :is_show="alertcontent.show || alertbox.show" @hide="closeAlertBox"></v-mask>
      <v-indicator v-if="is_show_indicator"></v-indicator>
    </div>
  </div>
</template>
<script>
import router from '../../router'
import Nextstep from '../component/NextStep'
import Alertbox from '../component/AlertBox'
import AlertContent from '../component/AlertContent'
import Mask from '../component/Mask'
import Indicator from '../component/Indicator'
import axios from 'axios'

import agreement from '../../agreement'
import config from '../../config'
import bus from '../../bus'
import tools from '../../tools'

export default {
  name: 'testpaperresult',
  data() {
    return {
      title: '风险测评结果',//标题
      is_ql: false,//是否是齐鲁证券
      checked: true,//是否选中同意协议
      riskData: {},//风险测评结果数据
      agreementData: {}, // 告知函内容
      is_show_indicator: false,//是否显示加载中动画
      is_doing_agree: false, //是否完成签署
      alertbox: {
        content: [],
        show: false
      },
      alertcontent: {
        content: '',
        show: false,
      }
    }
  },
  components: {
    'v-nextstep': Nextstep,
    'v-alertbox': Alertbox,
    'v-alertcontent': AlertContent,
    'v-mask': Mask,
    'v-indicator': Indicator
  },
  methods: {
    closeAlertBox: function () {//关闭弹出框
      this.alertbox.show = false;
    },
    newAlertCancel: function () {
      tools.exitKaihu();
    },
    // 获取风险测评结果
    getRiskResult: function(){
      let self = this
      axios.get(config.qsInterface + 'getRiskResult')
        .then(function(response){
          if (response.data.error_no == 0) {
            self.is_show_indicator = false
            self.riskData = response.data
          } else {
            self.is_show_indicator = false
            self.alertbox.content = [response.data.error_info]
            self.alertbox.show = true
          }
        })
        .catch(function(error){
          self.is_show_indicator = false;
          self.alertbox.content = ['获取风险测评结果失败'];
          self.alertbox.show = true;
        })
    },
    // 获取告知函内容
    getAgreementDetail: function(econtractId){
      let self = this
      axios.get(config.qsInterface + 'AgreementDetail', {
          params: {
            econtract_id: econtractId,
            qsid: config.qsId
          }
        }).then(function(response){
          if (response.data.error_no == 0) {
            self.is_show_indicator = false
            self.alertcontent.content = response.data.econtract_content
          } else {
            self.is_show_indicator = false
            self.alertbox.content = [response.data.error_info]
            self.alertbox.show = true
          }
        })
        .catch(function(error){
          self.is_show_indicator = false;
          self.alertbox.content = ['获取告知函的内容失败'];
          self.alertbox.show = true;
        })
    },
    // 上传签署协议结果
    uploadTestPaperResult: function(){
      let self = this
      axios.get(config.qsInterface + 'confirmRiskResult').then(function(response){
          if (response.data.error_no == 0) {
            self.is_show_indicator = false
            self.is_doing_agree = false
            var nextlist = JSON.parse(localStorage.getItem('nextList'));
            tools.nextpage = nextlist[nextlist.indexOf('Testpaper') + 1];
            tools.afterBackToOpenAccountStep();
          } else {
            self.is_show_indicator = false
            self.alertbox.content = [response.data.error_info]
            self.alertbox.show = true
          }
        })
        .catch(function(error){
          self.is_show_indicator = false;
          self.alertbox.content = ['上传风险测评结果失败'];
          self.alertbox.show = true;
        })
    },
    // 打开告知函弹窗
    openAgreement: function(event){
      event.preventDefault();
      let self = this
      self.alertcontent.show = true
      if(self.riskData.protocal[0].econtract_id){
        self.getAgreementDetail(self.riskData.protocal[0].econtract_id)
      }
    },
    closeAlertContent: function () {
      this.alertcontent.show = false
    },
    allowNext: function () {//下一步按钮点击事件
      var self = this;
      // 防止重复点击签署按钮
      if(self.is_doing_agree){
        return;
      }
      if (this.nextstep.next) {
        self.is_doing_agree = true
        this.is_show_indicator = true
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
            if (config.qsId == 100) {
              axios.get(config.qsInterface + 'agreetestresult', {
                params: {
                  risk_score: self.riskData.paper_score,
                  risk_lvl_name: self.riskData.risk_level_name
                }
              }).then(function (response) {
                if (response.data.error_no == 0) {
                  self.is_show_indicator = false;
                  var nextlist = JSON.parse(localStorage.getItem('nextList'));
                  tools.nextpage = nextlist[nextlist.indexOf('Testpaper') + 1];
                  tools.afterBackToOpenAccountStep();
                } else {
                  self.is_show_indicator = false;
                  self.alertbox.content = [response.data.error_info];
                  self.alertbox.show = true;
                }
              }).catch(function (error) {
                self.is_show_indicator = false;
                self.alertbox.content = ['上传风险测评信息失败'];
                self.alertbox.show = true;
              });
            } else {
              self.is_show_indicator = false;
              // 并非直接进入下一步，获取协议签名，并签署协议
              agreement.getSignCert(self.riskData.protocal[0], 0, self, 4);
            }
          }
        });
      }
    }
  },
  created: function () {
    bus.$emit('titleName', this.title, 8);
    let self = this;
    // self.riskData = JSON.parse(localStorage.getItem('riskData'));
    // riskData = {"error_no":"0",
    // "invest_advice":null,
    // "corp_risk_level":"A4",
    // "paper_score":"60.0",
    // "error_info":"",
    // "risk_level_name":"相对积极型",
    // "tips":"温馨提示:本公司向您销售的金融产品或提供的金融服务将以您的风险承受能力等级和投资品种、期限为基础，若您提供的信息发生任何重大变化，您都应当及时书面通知本公司",
    // "protocal":[{"econtract_id":"10202","econtract_type":"1","econtract_version":"1","econtract_md5":"b5d9c3ac17d31e81a0f9f2b24bae913f","econtract_no":"1014","econtract_remark":null,"econtract_name":"投资者风险承受能力评估结果告知函"}]}
    if (config.qsId == 100) {
      self.is_ql = true;
    }
    self.getRiskResult();
  },
  computed: {
    nextstep() {
      return {
        next: this.checked,
        text: '下一步',
      }
    }
  }
}

</script>
<style>
.testpaperresult {
  text-align: center;
}

.testpaperresult .installing {
  width: 100%;
  text-align: center;
  font-size: 0.28rem;
  color: #999;
  margin-top: 0.15rem;
}

.testpaperresult .cert-install-status {
  width: 100%;
  font-size: 0.4rem;
  text-align: center;
  color: #3a83d7;
}

.sales {
  text-align: left;
  font-size: 0.32rem;
  width: 100%;
  padding: 0.3rem;
  box-sizing: border-box;
}

.sales .certificate {
  margin-left: 0;
}

.score-p {
  padding: .1rem 0 .4rem 0;
}

.sales table {
  border-collapse: collapse;
  width: 100%;
}

.sales table td {
  border: 1px solid #ccc;
  padding: .08rem .08rem;
}

.sales table tr>td:first-child {
  width: 2rem;
}

.sales table tr>td:nth-child(2) {
  padding-left: .1rem;
}

.goBack {
  text-decoration: underline;
  color: #3a83d7;
  margin-left: .4rem;
}

.sales .tips {
  color: #f36268;
  padding: .3rem 0;
  line-height: 120%;
  font-size: .32rem;
}

.sales .resultPage {
  color: #3a83d7;
}

.sales .new-alert {
  background: #fff;
  width: 6rem;
  border-radius: .3rem;
}

.sales .new-alert .new-alert-header {
  text-align: center;
  height: .8rem;
  line-height: .8rem;
  border-bottom: 1px solid #ccc;
}

.sales .new-alert .new-alert-content {
  padding: .2rem .28rem;
}

.sales .new-alert .new-alert-content .mark {
  color: #f64d54;
}

.sales .new-alert .new-alert-content>p:nth-child(2) {
  color: #999;
  padding: .3rem 0;
}

.sales .new-alert .new-alert-button {
  white-space: nowrap;
  position: relative;
  height: .8rem;
}

.sales .new-alert .new-alert-button>button {
  box-sizing: border-box;
  width: 50%;
  height: 100%;
  line-height: 100%;
  margin: 0;
  position: absolute;
  top: 0;
  background: transparent;
  border: 0;
  border-top: 1px solid #ccc;
}

.sales .new-alert .new-alert-button .new-alert-confirm {
  right: 0;
  color: #3a83d7;
  border-left: 1px solid #ccc;
  border-bottom-right-radius: .3rem;
}

.sales .new-alert .new-alert-button .new-alert-cancel {
  left: 0;
  color: #999;
  border-bottom-left-radius: .3rem;
}

.head {
  font-size: 0.4rem;
  text-align: center;
  color: #333333;
  margin: 0.1rem auto 0.4rem;
}

.content p {
  line-height: 0.6rem;
  font-size: 0.34rem;
  color: #333333;
}

.cow-icon {
  text-align: center;
  margin-top: 2.5rem;
}

.cow-icon img {
  width: 1rem;
  height: 1.6rem;
}

.score {
  color: #f64d54;
  font-size: 0.34rem;
}
</style>
