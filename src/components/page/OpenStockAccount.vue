<template>
  <div class="openstockaccount">
    <v-tip :content="tipcontent[0]" style="padding:0.2rem 0.3rem;"></v-tip>
    <div class="switch" style="border-top:1px solid #d7d7d7;">
      上海A股
      <span class="switch-icon">
        <v-switch @showSelectedItem="shanghai" :id="id.shanghai" :default="true"></v-switch>
      </span>
    </div>
    <div class="switch">
      深圳A股
      <span class="switch-icon">
        <v-switch @showSelectedItem="shenzhen" :id="id.shenzhen" :default="true"></v-switch>
      </span>
    </div>
    <!--<div class="switch">
        上海场内基金
        <span class="switch-icon"><v-switch @showSelectedItem="shfund" :id="id.shfund" :default="true"></v-switch></span>
    </div>
    <div class="switch">
      深圳场内基金
      <span class="switch-icon"><v-switch @showSelectedItem="szfund" :id="id.szfund" :default="true"></v-switch></span>
    </div> -->
    <div class="tips">默认新开上海A股账户，下挂深圳A股账户，账户实际开通情况以开户成功短信内容为准。</div>
    <!--基金 start-->
    <!--<v-tip :content="tipcontent[1]" style="padding:0.2rem 0.3rem;"></v-tip>
    <div class="switch">
      余额理财
      <span class="switch-icon">
        <v-switch @showSelectedItem="yuelicai" :id="id.yuelicai" :default="false"></v-switch>
      </span>
    </div>
    <v-agreementbox :agreement_list="jijin_agreement_list" @showAgreement="showAgreement"></v-agreementbox>
    <div class="tips2">备注内容：在不影响您正常炒股的前提下，为您的账户余额自动参与申港证券基金理财，详情见申港证券基金合同以及快速取现业务用户服务协议。</div>
    <div class="tips">采用电子签名签订的电子签名合同，风险揭示具有与纸质合同、纸质风险提示书同等的法律效力。</div>
    <div class="certificate">
      <input type="checkbox" v-model="checked" style="display: none;" id="agree">
      <label for="agree" :class="{unchecked:!checked}">本人已阅读并同意签署以上协议，自愿开通电子签名约定权限，并承担由此产生的一切法律后果。</label>
    </div>-->
    <!--基金 end-->
    <v-nextstep :next="nextstep.next" :text="nextstep.text" @goNext="allowNext"></v-nextstep>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>

<script>
import router from '../../router'
import Tip from '../component/Tip.vue'
import Nextstep from '../component/NextStep.vue'
import Switch from '../component/Switch'
import AlertBox from '../component/AlertBox'
import Mask from '../component/Mask'
import Indicator from '../component/Indicator'
// import AgreementBox from '../component/AgreementBox'
import bus from '../../bus'
import axios from 'axios'

import config from '../../config'
import tools from '../../tools'

export default {
  name: 'openstockaccount',
  data() {
    return {
      title: '开立账户',
      tipcontent: ['股票账户', '基金账户'],
      is_show_indicator: false,
      checked: true, //是否选中我同意
      nextstep: {
        next: true,
        text: '下一步'
      },
      account: {
        shanghai: true,
        shenzhen: true,
        yuelicai: false
        // shfund: true,
        // szfund: true
      },
      id: {
        shanghai: 'sh',
        shenzhen: 'sz',
        yuelicai: 'ye'
        // shfund: 'shf',
        // szfund: 'szf'
      },
      alertbox: {
        content: [],
        show: false
      },
      // jijin_agreement_list: [
      //   {
      //     download_url:"https://open.95538.cn/wt/download/protocol/13.pdf",
      //     econtract_id:"10",
      //     econtract_md5:"4ff64cf81337ce9fa6856577aebda3ed",
      //     econtract_name:"基金合同",
      //     econtract_no:"10"
      //   },
      //   {
      //     download_url:"https://open.95538.cn/wt/download/protocol/13.pdf",
      //     econtract_id:"10",
      //     econtract_md5:"4ff64cf81337ce9fa6856577aebda3ed",
      //     econtract_name:"申港证券基金快速获取合同",
      //     econtract_no:"10"
      //   }
      // ]
    }
  },
  components: {
    'v-tip': Tip,
    'v-nextstep': Nextstep,
    'v-switch': Switch,
    'v-alertbox': AlertBox,
    'v-mask': Mask,
    'v-indicator': Indicator,
    // 'v-agreementbox': AgreementBox
  },
  methods: {
    closeAlertBox: function () {
      this.alertbox.show = false;
    },
    allowNext: function () {
      var self = this;
      this.is_show_indicator = true;
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
          //   var kind1 = (self.account.shanghai)? '10' : '';
          //   var kind2 = (self.account.shenzhen)? '20' : '';
          //   var kind3 = (self.account.shfund)? '11' : '';
          //   var kind4 = (self.account.szfund)? '21' : '';
          //   var kind = [kind1,kind2,kind3,kind4];
          //   var exkind = "";
          //   for(var i=0; i<kind.length; i++){
          //     if(kind[i])
          //       exkind += kind[i] + '||';
          //   }
          //   exkind = exkind.substring(0,(exkind.length-2));
          //   var fdcompany = (kind1 && kind2) ? '10||20' : (kind1 || kind2);
          // if (kind1 || kind2) {
          //   console.log(exkind+"--");
          //   console.log(fdcompany);
          //   return false;
          //   self.openStockAccount({
          //     qsid: config.qsId,
          //     exchange_kind: exkind,
          //     fund_company: fdcompany
          //   });
          if (self.account.shanghai && self.account.shenzhen) {
            self.openStockAccount({
              qsid: config.qsId,
              exchange_kind: '1||2',
              fund_company: ''
            });
          } else if (self.account.shanghai || self.account.shenzhen) {
            var kind = self.account.shanghai ? 1 : 2;
            self.openStockAccount({
              qsid: config.qsId,
              exchange_kind: kind,
              fund_company: ''
            });
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = ['上海A股,深圳A股请至少选择一项'];
            self.alertbox.show = true;
          }
        }
      });
    },
    shanghai: function (val) {
      this.account.shanghai = val;
    },
    shenzhen: function (val) {
      this.account.shenzhen = val;
    },
    // yuelicai: function(val){
    //   this.account.yuelicai = val;
    // },
    // shfund: function (val) {
    //   this.account.shfund = val;
    // },
    // szfund: function (val) {
    //   this.account.szfund = val;
    // },
    openStockAccount: function (obj) {
      var self = this;
      axios.get(config.qsInterface + 'openstockaccount', {
        params: obj
      }).then(function (response) {
        if (response.data.error_no == 0) {
          self.is_show_indicator = false;
          var nextlist = JSON.parse(localStorage.getItem('nextList'));
          tools.nextpage = nextlist[nextlist.indexOf('openStockAccount') + 1];
          tools.afterBackToOpenAccountStep();
        } else {
          self.is_show_indicator = false;
          self.alertbox.content = [response.data.error_info];
          self.alertbox.show = true;
        }
      }).catch(function (error) {
        self.is_show_indicator = false;
        self.alertbox.content = ['开立账户失败！'];
        self.alertbox.show = true;
      })
    },
    // showAgreement: function (no) {//显示协议内容
    //   this.is_show_indicator = true;
    //   var self = this;
    //   axios.get(config.qsInterface + 'agreementDetail', {
    //     params: {
    //       econtract_id: no,
    //       qsid: config.qsId,
    //       type: ''
    //     }
    //   }).then(function (response) {
    //     self.is_show_indicator = false;
    //     if (response.data.error_no == 0) {
    //       self.alertcontent.content = response.data.econtract_content;
    //       self.alertcontent.show = true;
    //     } else {
    //       self.alertbox.content = [response.data.error_info];
    //       self.alertbox.show = true;
    //     }
    //   }).catch(function (error) {
    //     console.log(error);
    //     self.is_show_indicator = false;
    //   });
    // }
  },
  created: function () {
    bus.$emit('titleName', this.title, 11);
  }
}

</script>
<style>
.openstockaccount {
  background: #fff;
}
.openstockaccount .tip{
  background: #eee;
}
.openstockaccount .tips{
  color: #999;
  font-size: .3rem;
  padding: .1rem .2rem;
  background: #fff;
}
.openstockaccount .tips2{
  color: #898989;
  font-size: .3rem;
  padding: .1rem .2rem;
  background: #eee;
  line-height: 120%;
  margin-bottom: .2rem;
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
</style>
