<template>
  <div class="testpaper">
    <div class="tips" v-if="tips"><span class="info-icon"></span><span v-html="tips"></span></div>
    <div class="test-content">
      <div class="questionitem">
        <div class="question-item" v-for="(item,index) in question_data.resultList" v-bind:key="index">
          <h3 class="question-name">{{index+1}}.{{item.question_content}}</h3>
          <ul class="question-content">
            <li v-for="(value,key,inx) in item.answer_content" :class="{'testpaper-option-item':question_type === 'test','revisit-option-item':question_type==='revisit'}" v-bind:key="inx">
              <div :class="{checked:radios[index].indexOf(key) > -1}" @click="clickItem(key,index,item)">{{value}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="test-bottom">
      <v-nextstep :next="nextstep.next" :text="nextstep.text" class="bottom-next-btn" @goNext="allowNext"></v-nextstep>
    </div>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-reloadbox :content="reloadbox.content" @clickReload="clickReload" @backPage="backPage" v-if="reloadbox.show"></v-reloadbox>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>

<script>
  import router from '../../router'
  import Nextstep from '../component/NextStep'
  import AlertBox from '../component/AlertBox'
  import Mask from '../component/Mask'
  import ReloadBox from '../component/ReloadBox'
  import Indicator from '../component/Indicator'
  import axios from 'axios'
  
  import bus from '../../bus'
  import config from '../../config'
  import tools from '../../tools'

  export default {
    name: 'testpaper',
    data() {
      return {
        title: '风险测评',//标题
        nextstep: {
          next: true,
          text: '下一步'
        },
        radios: [],//答案
        question_data: {},//题目数据
        is_show_indicator: true,//是否显示加载图标
        tips: '', // 接口返回的tips内容
        question_type: 'test',//问题类型  test为风险测评 revist为问卷回访
        alertbox: {
          content: [],
          show: false
        },
        reloadbox: {
          content: '',
          show: false
        }
      }
    },
    components: {
      'v-nextstep': Nextstep,
      'v-alertbox': AlertBox,
      'v-mask': Mask,
      'v-reloadbox': ReloadBox,
      'v-indicator': Indicator
    },
    methods: {
      clickReload: function () {//点击重新加载按钮
        this.getTestPaper();
      },
      backPage: function () {//点击返回按钮
        tools.exitKaihu();
      },
      closeAlertBox: function () {//关闭弹出框
        this.alertbox.show = false;
      },
      allowNext: function () {//下一步按钮点击事件
        this.is_show_indicator = true;
        var uncheck_question = [];
        var self = this;
        for (var i = 0; i < this.radios.length; i++) {
          if (this.radios[i].replace(/,/g, '') == '') {
            uncheck_question.push(i + 1);
          }
        }
        if (uncheck_question.length > 0) {
          this.is_show_indicator = false;
          this.alertbox.content = ["您的第" + uncheck_question.join(',') + "题未填写！"];
          this.alertbox.show = true;
          var position = document.querySelector(".questionitem .question-item:nth-child(" + uncheck_question[0] + ")")
            .offsetTop;
          document.querySelector(".wrap").scrollTop = position;
        } else {
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
              axios.get(config.qsInterface + 'uploadTestpaper', {
                params: {
                  qsid: config.qsId,
                  paper_answer: self.answer_string
                }
              }).then(function (response) {
                if (response.data.error_no == 0) {
                  self.is_show_indicator = false;
                  // 不再使用这个riskData，问卷回访页会重新请求新的风险测评结果数据
                  // localStorage.setItem("riskData", JSON.stringify(response.data));
                  tools.stepSync('uploadTestpaper');
                  router.push('/testpaperresult/8');
                } else {
                  self.is_show_indicator = false;
                  self.alertbox.content = [response.data.error_info];
                  self.alertbox.show = true;
                }
              }).catch(function (error) {
                self.is_show_indicator = false;
                self.alertbox.content = ['提交风险测评内容失败'];
                self.alertbox.show = true;
              });
            }
          });
        }
      },
      clickItem: function (key, index, item) {//选择答案
        var checked = this.radios[index];
        if (item.question_kind == 1) {//如果为多选
          if (checked.indexOf(key) > -1) {//取消选择
            checked = checked.replace(key, '');
          } else {//添加
            checked = checked + ',' + key;
          }
          this.radios.splice(index, 1, checked);
        } else {
          this.radios.splice(index, 1, key);
        }
      },
      getTestPaper: function () {//获取风险测评数据
        var self = this;
        axios.get(config.qsInterface + 'Testpaper').then(function (response) {
          if (response.data.error_no == 0) {
            self.is_show_indicator = false;
            self.question_data = response.data;
            self.question_data.resultList.map(item => {item.answer_content = JSON.parse(item.answer_content)})
            for (var i = 0; i < self.question_data.resultList.length; i++) {
              self.radios.push(self.question_data.resultList[i].default_answer);
            }
            // 设置tips的内容
            self.tips = response.data.tips || ''
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = '获取风险测评内容失败，请重新加载。';
            self.reloadbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.reloadbox.content = '获取风险测评内容失败，请重新加载。';
          self.reloadbox.show = true;
        });
      }
    },
    created: function () {
      bus.$emit('titleName', this.title, 7);
      this.getTestPaper();
    },
    computed: {
      answer_string() {//计算选择答案拼接成一定格式的字符串
        let str = '';
        for (var i = 0; i < this.radios.length; i++) {
          var answer = this.radios[i].split(',');
          var total_answer = '';
          if (answer.length > 1) {
            for (var j = 0; j < answer.length; j++) {
              if (answer[j] != '') {
                total_answer += answer[j] + '^';
              }
            }
            total_answer = total_answer.substring(0, total_answer.length - 1);
          } else {
            total_answer = this.radios[i];
          }
          str += `${this.question_data.resultList[i].question_no}&${total_answer}|`;
        }
        return str;
      }
    }
  }

</script>

<style>
  .test-content {
    padding: 0 0.3rem;
    padding-bottom: 1.5rem;
  }

  .test-bottom {
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

  .question-name {
    color: #333;
    font-size: 0.32rem;
    padding: 0.15rem 0;
  }

  .question-content {
    border-bottom: 1px solid #d7d7d7;
    color: #666;
  }

  .question-content li.testpaper-option-item {
    padding: 0.2rem 0.2rem 0.2rem 0.1rem;
    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    border-right: 1px solid #d7d7d7;
    font-size: 0.3rem;
  }

  .question-content li.testpaper-option-item div {
    padding-left: 0.4rem;
    background: url(../../images/TestPaper/radiouncheck.png) no-repeat left center;
    background-size: 0.3rem 0.3rem;
    display: block;
  }

  .question-content li.testpaper-option-item div.checked {
    background: url(../../images/TestPaper/radiochecked.png) no-repeat left center;
    background-size: 0.3rem 0.3rem;
  }

  .tips {
    font-size: .3rem;
    color: #ef3e31;
    padding: .1rem .24rem .2rem .24rem;
  }

  .tips .info-icon {
    display: inline-block;
    vertical-align: text-bottom;
    width: .32rem;
    height: .32rem;
    background: url('../../images/tip.png');
    background-size: .32rem .32rem;
    margin-right: .15rem;
  }
</style>
