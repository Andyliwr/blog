<template>
  <div class="revenue">
    <div class="tips">本人声明为:</div>
    <v-radiobox v-for="(item, index) in radio_value" v-bind:key="item.index" :index="item.index" :value="item.value" :des="item.des" :title="item.title" @selectItem="selectItem"></v-radiobox>
    <div class="certificate" @click="changeChecked">
      <input type="checkbox" v-model="checked" style="display: none;">
      <label :class="{unchecked:!checked}">本人确认上述信息的真实、准确和完善、且在这些信息发生变更时，将在30日内通知贵机构，否则，本人将承担由此造成的不利后果。
      </label>
    </div>
    <v-nextstep :next="nextstep.next" :text="nextstep.text" class="bottom-next-btn" @goNext="allowNext"></v-nextstep>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <div class="middle-center">
      <v-alertbox :title="alertbox.title" :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>

<script>
import router from '../../router'
import Nextstep from '../component/NextStep'
import AlertBox from '../component/AlertBox'
import RadioBox from '../component/RadioBox'
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
      title: '个人税收居民身份确认',//标题
      qs_hotline: '',
      tel_href: '',
      radio_value: [
        {
          index: 0,
          value: true,
          title: '仅为中国税收民居',
          des: '中国境内有住所，或者无住所而在境内居住满一年的个人' 
        },
        {
          index: 1,
          value: false,
          title: '仅为非居民',
          des: '中国税收居民以外的个人' 
        },
        {
          index: 2,          
          value: false,
          title: '既是中国税收居民又是其他国家（地区）税收居民',
          des: '中国境内有住所，同时在国外也有住所的个人' 
        }
      ],
      selectValue: 1,
      checked: true,
      is_show_indicator: false,//是否显示加载图标
      alertbox: {
        title: '',
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
    'v-radiobox': RadioBox,
    'v-reloadbox': ReloadBox,
    'v-indicator': Indicator
  },
  methods: {
    closeAlertBox: function () {//关闭弹出框
      this.alertbox.show = false;
    },
    selectItem: function(obj){
      let self = this
      if(obj.value){
        self.radio_value.forEach(function(item, index, array){
          if(item.index === parseInt(obj.index)){
            console.log('yes')
            array[item.index].value = true
            self.selectValue = item.index+1
          }else{
            array[item.index].value = false
          }
        })
      }else{
        this.radio_value[parseInt(obj.index)].value = obj.value
      }
      if(obj.index === '1' || obj.index === '2'){
        self.alertbox.title = '无法继续办理';
        self.alertbox.content = ['非中国税收居民不能继续网上开户，请咨询客服热线<a :href="'+ self.tel_href +'" class="tel">'+self.qs_hotline+'</a>'];
        self.alertbox.show = true;
      }
    },
    changeChecked: function(){
      this.checked = !this.checked
    },
    allowNext: function (){
      let self = this
      if(self.selectValue === 1){
        self.is_show_indicator = true
        axios.get(config.qsInterface + 'revenue', {
          params: {
            residentType: 1
          }
        }).then(function(response){
          if (response.data.error_no == 0) {
            // 执行更新个人信息的步骤统计
            let nextlist = JSON.parse(localStorage.getItem('nextList'));
            if (nextlist.indexOf('updateClientInfo') > -1) {
              tools.nextpage = nextlist[nextlist.indexOf('updateClientInfo') + 1];
              tools.afterBackToOpenAccountStep();
            }
          } else {
            self.is_show_indicator = false
            self.alertbox.content = [response.data.error_info]
            self.alertbox.show = true
          }
        })
        .catch(function(error){
          self.is_show_indicator = false;
          self.alertbox.content = ['上传个人税收居民身份失败'];
          self.alertbox.show = true;
        })
      }
    }
  },
  created: function () {
    bus.$emit('titleName', this.title, 15);
    if (JSON.parse(localStorage.getItem('qsDetail'))) {
      let hotline = JSON.parse(localStorage.getItem('qsDetail')).qs_hotline;
      self.qs_hotline = hotline;
      self.tel_href = 'tel:' + hotline;
    };
  },
  computed: {
    nextstep() {
      return {
        next: this.checked && this.radio_value[0].value,
        text: '下一步',
      }
    }
  }
}

</script>

<style scoped>
.tips {
  font-size: .1rem;
  height: .6rem;
  line-height: .6rem;
  color: #333;
  padding-left: .2rem;
}
</style>
