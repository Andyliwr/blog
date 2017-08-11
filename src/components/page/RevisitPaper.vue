<template>
  <div class="revisitpaper">
    <div class="revisit-content" style="padding:0 0.2rem;margin-bottom:2.5rem;">
      <div class="questionitem">
        <div class="question-item" v-for="(item,index) in question_data.resultList" v-bind:key="index">
          <h3 class="question-name">{{index+1}}.{{item.question_content}}</h3>
          <ul class="question-content clearfix" style="border:none;">
            <li v-for="(value,key,inx) in item.answer_content" :class="{'testpaper-option-item':question_type === 'test','revisit-option-item':question_type==='revisit'}" v-bind:key="inx">
              <div :class="{checked:radios[index].indexOf(key) > -1}" @click="clickItem(key,index,item)">{{value}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="revisit-bottom">
      <v-nextstep :next="nextstep.next" :text="nextstep.text" class="bottom-next-btn" @goNext="allowNext"></v-nextstep>
    </div>
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
  import AgreementBox from '../component/AgreementBox'
  import Nextstep from '../component/NextStep'
  import AlertBox from '../component/AlertBox'
  import Mask from '../component/Mask'
  import Reloadbox from '../component/ReloadBox'
  import Indicator from '../component/Indicator'
  import axios from 'axios'
  
  import bus from '../../bus'
  import config from '../../config'
  import tools from '../../tools'

  export default {
    name: 'revisitpaper',
    data() {
      return {
        title: '问卷回访',
        nextstep: {
          next: true,
          text: '下一步'
        },
        is_show_indicator: true,
        radios: [],
        default_answer: [],
        question_data: {},
        question_type: 'revisit',
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
      'v-reloadbox': Reloadbox,
      'v-mask': Mask,
      'v-indicator': Indicator
    },
    methods: {
      clickReload: function () {
        this.getRevisitpaper();
      },
      backPage: function () {
        router.push('/openthirdpartyaccount/12');
      },
      closeAlertBox:function(){
        this.alertbox.show = false;
      },
      allowNext: function () {
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
          this.alertbox.cotnent = ["您的第" + uncheck_question.join(',') + "题未填写！"];
          this.alertbox.show = true;
          var position = document.querySelector(".questionitem .question-item:nth-child(" + uncheck_question[0] + ")")
            .offsetTop;
          document.querySelector(".wrap").scrollTop = position;
        } else {
          var str = '';
          for (let i = 0; i < this.radios.length; i++) {
            if (this.default_answer[i] != '') {
              if (this.default_answer[i] != this.radios[i]) {
                str += i+1 + ',';
              }
            }
          }
          if (str != '') {
            this.alertbox.content = ['您选择的第' + str.substring(0,str.length-1) + '题答案不符合证监会规定开户要求，请您选择正确答案'];
            this.alertbox.show = true;
            this.is_show_indicator = false;
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
                axios.get(config.qsInterface + 'uploadRevisitpaper', {
                  params: {
                    paper_answer: self.answer_string
                  }
                }).then(function (response) {
                  if (response.data.error_no == 0) {
                    self.is_show_indicator = false;
                    tools.stepSync('uploadRevisitpaper');
                    var nextlist = JSON.parse(localStorage.getItem('nextList'));
                    tools.nextpage = nextlist[nextlist.indexOf('Revisitpaper') + 1];
                    tools.afterBackToOpenAccountStep();
                  } else {
                    self.is_show_indicator = false;
                    self.alertbox.content = [response.data.error_info];
                    self.alertbox.show = true;
                  }
                }).catch(function (error) {
                  self.is_show_indicator = false;
                  self.alertbox.content = ['提交问卷回访答案失败！'];
                  self.alertbox.show = true;
                });
              }
            });
          }
        }
      },
      clickItem: function (key, index, item) {
        var checked = this.radios[index];
        if (item.question_kind == 1) {
          if (checked.indexOf(key) > -1) {
            checked = checked.replace(key, '');
          } else {
            checked = checked + ',' + key;
          }
          this.radios.splice(index, 1, checked);
        } else {
          this.radios.splice(index, 1, key);
        }

      },
      getRevisitpaper: function () {
        var self = this;
        axios.get(config.qsInterface + 'Revisitpaper').then(function (response) {
          if (response.data.error_no == 0) {
            self.is_show_indicator = false;
            self.question_data = response.data;
            for (var i = 0; i < self.question_data.resultList.length; i++) {
              self.radios.push(self.question_data.resultList[i].default_answer);
              self.default_answer.push(self.question_data.resultList[i].default_answer);
            }
          } else {
            self.is_show_indicator = false;
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.reloadbox.content = '获取问卷回访内容失败，请重新加载。';
            self.reloadbox.show = true;
          }
        }).catch(function (error) {
          self.is_show_indicator = false;
          self.reloadbox.content = '获取问卷回访内容失败，请重新加载。';
          self.reloadbox.show = true;
        });
      },
    },
    created: function () {
      bus.$emit('titleName', this.title, 13);
      this.getRevisitpaper();
    },
    computed: {
      answer_string() {
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
  .question-name {
    color: #333;
    font-size: 0.32rem;
    padding: 0.2rem 0;
  }

  .question-content li.revisit-option-item {
    float: left;
    margin-right: 0.2rem;
  }

  .question-content li.revisit-option-item div {
    display: block;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.28rem;
    width: 3.3rem;
    border: 1px solid #d7d7d7;
    background-color: #fff;
    text-align: center;
    border-radius: 0.1rem;
    color: #999;
  }

  .question-content li.revisit-option-item div.checked {
    border: 1px solid #3a83d7;
    color: #3a83d7;
  }

  .revisit-content {
    padding-bottom: 1.3rem;
  }

  .revisit-bottom {
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

</style>
