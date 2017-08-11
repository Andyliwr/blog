<template>
  <div class="updateopenbranch">
    <div class="selectbox" v-if="branch_list.length > 1" style="margin-top:0.2rem;border-top:1px solid #d7d7d7;">
      <label class="input-title">营业部</label>
      <div class="select-input">
        <select v-model="selected">
          <option v-for="item in branch_list" v-text="item.branch_name"></option>
        </select>
        <span class="right-arrow"></span>
      </div>
    </div>
    <div class="inputbox small-input-box" v-if="branch_list.length == 1" style="margin-top:0.2rem;border-top:1px solid #d7d7d7;">
      <label class="input-title">{{labeltitle}}</label><input type="text"  :readonly="true" :value="selected">
    </div>
    <div class="address clearfix" v-if="is_show_address">
      <label>{{inputbox.labeltitle}}</label>
      <p>{{inputbox.val}}</p>
    </div>
    <v-nextstep :text="nextstep.text" :next="nextstep.next" @goNext="allowNext"></v-nextstep>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <v-reloadbox :content="reloadbox.content" @clickReload="clickReload" @backPage="backPage" v-if="reloadbox.show"></v-reloadbox>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>
<script>
  import router from '../../router'
  import Inputbox from '../component/InputBox'
  import Nextstep from '../component/NextStep'
  import Alertbox from '../component/AlertBox'
  import Mask from '../component/Mask'
  import axios from 'axios'
  
  import bus from '../../bus'
  import config from '../../config'
  import tools from '../../tools'
  import Reloadbox from '../component/ReloadBox'
  import Indicator from '../component/Indicator'
  export default {
    name: 'updateopenbranch',
    data() {
      return {
        title: '选择营业部', //标题
        is_show_address: false, //是否显示地址
        inputbox: {
          labeltitle: '地址',
          value: ''
        },
        is_show_indicator: true, //是否显示加载动画
        labeltitle: '营业部',
        selected: '', //选中的营业部
        branch_list: [{}],
        nextstep: {
          next: true,
          text: '下一步'
        },
        alertbox: {
          content: [],
          show: false,
        },
        reloadbox: {
          content: '',
          show: '',
        }
      }
    },
    components: {
      'v-inputbox': Inputbox,
      'v-nextstep': Nextstep,
      'v-alertbox': Alertbox,
      'v-reloadbox': Reloadbox,
      'v-mask': Mask,
      'v-indicator': Indicator
    },
    methods: {
      clickReload: function () { //点击重新加载按钮
        this.reloadbox.show = false;
        this.getBranchList();
      },
      backPage: function () { //点击返回按钮
        router.push('/updateclientinfo/3');
      },
      closeAlertBox: function () { //关闭弹出框
        this.alertbox.show = false;
      },
      allowNext: function () { //下一步按钮点击事件
        this.is_show_indicator = true;
        var self = this;
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
            self.updateOpenBranch();
          }
        });
      },
      updateOpenBranch: function () { //更新营业部接口调用
        var branch_no = '';
        var self = this;
        for (var i = 0; i < this.branch_list.length; i++) {
          if (this.selected == this.branch_list[i].branch_name) {
            branch_no = this.branch_list[i].branch_no;
            break;
          }
        }
        axios.get(config.qsInterface + 'updateOpenBranch', {
          params: {
            qsid: config.qsId,
            branch_no: branch_no
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            if (config.qsId == 322) {
              sessionStorage.setItem('yybid', branch_no);
            }
            tools.stepSync('updateOpenBranch');
            self.is_show_indicator = false;
            var nextlist = JSON.parse(localStorage.getItem('nextList'));
            tools.nextpage = nextlist[nextlist.indexOf('updateOpenBranch') + 1];
            tools.afterBackToOpenAccountStep();
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.alertbox.content = ['更新营业部失败'];
          self.alertbox.show = true;
        });
      },
      getBranchList: function () { //获取营业部信息
        var self = this;
        axios.get(config.qsInterface + 'Branchlist').then(function (response) {
          if (response.data.error_no == 0) {
            self.is_show_indicator = false;
            self.branch_list = response.data.resultList;
            self.selected = self.branch_list[0].branch_name;
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = '获取营业部信息失败，请重新加载。';
            self.reloadbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.reloadbox.content = '获取营业部信息失败，请重新加载。';
          self.reloadbox.show = true;
        });
      }
    },
    created: function () {
      var self = this;
      bus.$emit('titleName', this.title, 4);
      self.getBranchList();
    },
    watch: {
      selected: function (branch_name, oldval) {
        for (var i = 0; i < this.branch_list.length; i++) {
          if (branch_name == this.branch_list[i].branch_name) {
            this.is_show_address = this.branch_list[i].address ? true : false;
            if (this.is_show_address) {
              this.inputbox.val = this.branch_list[i].address;
            }
            break;
          }
        }
      }
    }
  }

</script>
<style>
  .small-input-box label {
    width: 1.6rem;
    color: #999;
    margin-right: 0;
  }

  .small-input-box input {
    width: 4.7rem;
  }
  .updateopenbranch {
    width: 100%;
  }
  .updateopenbranch .address {
    width: 100%;
    border-bottom: 1px solid #d7d7d7;
    font-size: 0.34rem;
    min-height: 1rem;
    background-color: #fff;
    padding: 0 0.3rem;
    box-sizing: border-box;
  }

  .updateopenbranch .address label {
    float: left;
    width: 1.6rem;
    color: #999;
    line-height: 1rem;
  }

  .updateopenbranch .address p {
    float: left;
    width: 5rem;
    margin: 0.28rem 0 0.28rem 0;
  }

</style>
