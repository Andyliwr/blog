<template>
  <div class="updateclientinfo">
    <v-tip :content="tipcontent[0]" style="padding: 0.06rem 0.3rem;border-bottom:1px solid #d7d7d7;"></v-tip>
    <div class="input-box">
      <!--idCard start-->
      <v-inputbox :labeltitle="inputbox[0].labeltitle" :value="person_data.client_name" class="small-input-box" @showInputText="name"></v-inputbox>
      <v-inputbox :labeltitle="inputbox[1].labeltitle" :value="person_data.id_no" class="small-input-box" @showInputText="idNumber"></v-inputbox>
      <!--<div class="double-input-box">
              <label class="input-title">{{inputbox[2].labeltitle}}</label>
              <div class="double-input">
                <input type="text" class="date-box" :value="person_data.id_begindate" readonly="true" @click="getDatePickStart">          - <input type="text" class="date-box" :value="person_data.id_enddate" readonly="true" @click="getDatePickEnd"></input>
              </div>
            </div>-->
      <!--<v-inputbox :labeltitle="inputbox[2].labeltitle" :value="person_data.issued_depart" class="small-input-box" @showInputText="issuedDepart"></v-inputbox>-->
      <v-inputbox :labeltitle="inputbox[2].labeltitle" :value="person_data.id_address" class="small-input-box" @showInputText="idAddress"></v-inputbox>
      <v-inputbox :labeltitle="inputbox[3].labeltitle" :value="person_data.id_begindate" :readonly="true" class="small-input-box" @handleDatePick="getDatePickStart"></v-inputbox>
      <v-inputbox :labeltitle="inputbox[4].labeltitle" :value="person_data.id_enddate" readonly="true" class="small-input-box" @handleDatePick="getDatePickEnd"></v-inputbox>
      <!--<v-selectbox :labeltitle="selectbox[0].labeltitle" :options="selectbox[0].options" :defaultoption="selectbox[0].defaultoption" @selectItem="minZu"></v-selectbox>-->
      <!--idCard end-->
      <!--contact start-->
      <!--<v-tip :content="tipcontent[1]" style="padding: 0.06rem 0.3rem;border-bottom:1px solid #d7d7d7;"></v-tip>
      <div class="switch">
        {{ switchBox[0].lable }}
        <span class="switch-icon">
          <v-switch @showSelectedItem="sameWitchIdCard" :id="switchBox[0].id" :default="switchBox[0].value"></v-switch>
        </span>
      </div>
      <v-inputbox :labeltitle="inputbox[5].labeltitle" :value="contanct_address" class="small-input-box" @showInputText="contactAddress"></v-inputbox>
      <v-inputbox :labeltitle="inputbox[6].labeltitle" :value="person_data.zipcode" class="small-input-box" @showInputText="zipCode"></v-inputbox>-->
      <!--contact end-->
      <!--other start-->
      <v-tip :content="tipcontent[2]" style="padding: 0.06rem 0.3rem;border-bottom:1px solid #d7d7d7;"></v-tip>
      <v-selectbox :labeltitle="selectbox[1].labeltitle" :options="education_data.degree" :defaultoption="selectbox[1].defaultoption" @selectItem="degree"></v-selectbox>
      <v-selectbox :labeltitle="selectbox[2].labeltitle" :options="education_data.industry" :defaultoption="selectbox[2].defaultoption" @selectItem="industry"></v-selectbox>
      <v-selectbox :labeltitle="selectbox[3].labeltitle" :options="education_data.profession" :defaultoption="selectbox[3].defaultoption" @selectItem="profession" ></v-selectbox>
      <v-selectbox :labeltitle="selectbox[4].labeltitle" :options="education_data.position" :defaultoption="selectbox[4].defaultoption" @selectItem="position"></v-selectbox>
      <v-inputbox :labeltitle="inputbox[7].labeltitle" :value="person_data.workUnit" class="small-input-box" :placeholder="inputbox[7].placeholder" @showInputText="workUnit"></v-inputbox>
      <!--other end-->
      <!--account start-->
      <v-tip :content="tipcontent[3]" style="padding: 0.06rem 0.3rem;border-bottom:1px solid #d7d7d7;"></v-tip>
      <v-selectbox :labeltitle="selectbox[5].labeltitle" :options="selectbox[5].options" :defaultoption="selectbox[5].defaultoption" @selectItem="beneficiaryPerson"></v-selectbox>
      <v-selectbox :labeltitle="selectbox[6].labeltitle" :options="selectbox[6].options" :defaultoption="selectbox[6].defaultoption" @selectItem="controlNaturePerson"></v-selectbox>
      <!--<v-selectbox :labeltitle="selectbox[7].labeltitle" :options="selectbox[7].options" :defaultoption="selectbox[7].defaultoption" @selectItem="openCreditRecordPage"></v-selectbox>-->
      <p class="inline" @click="openCreditRecordPage"><span class="inline-title">{{ selectbox[7].labeltitle }}</span><span class="inline-value">{{ textEllipsis || selectbox[7].defaultoption }}</span><span class="right-icon"></span></p> 
      <!--account end-->
      <!--invite start-->
      <!--<v-tip :content="tipcontent[4]" style="padding: 0.06rem 0.3rem;border-bottom:1px solid #d7d7d7;"></v-tip>
      <v-inputbox :labeltitle="inputbox[8].labeltitle" :value="person_data.im_code" class="small-input-box" :placeholder="inputbox[8].placeholder" @showInputText="inviteCode"></v-inputbox>-->
      <!--invite end-->
    </div>
    <v-nextstep :text="nextstep.text" :next="nextstep.next" @goNext="allowNext"></v-nextstep>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <v-reloadbox :content="reloadbox.content" @clickReload="clickReload" @backPage="backPage" v-if="reloadbox.show"></v-reloadbox>
    <v-indicator v-if="is_show_indicator"></v-indicator>
    <!--credit select start-->
    <div class="credit-select" v-if="isShowCreditSelect">
      <p class="credit-select-value">{{ textEllipsis || '无' }} <span v-show="selectbox[7].value.length !== 0" @click="handleClearCredit" class="close-icon"></span></p>
      <p class="credit-select-des">如有请选择以下不良征信记录(可多选)</p>
      <ul>
        <li  v-for="item in selectbox[7].options" v-bind:key="item.index" :class="{selected: item.isSelected}" @click="handleSelectCredit" :data-index="item.index" :data-id="item.id">{{ item.name }}</li>
      </ul>      
    </div>
    <!--credit select end-->
  </div>
</template>
<script>
import router from '../../router'
import Tip from '../component/Tip'
import Inputbox from '../component/InputBox'
import Nextstep from '../component/NextStep'
import Selectbox from '../component/SelectBox'
import Switch from '../component/Switch'
import AlertBox from '../component/AlertBox'
import ReloadBox from '../component/ReloadBox'
import Indicator from '../component/Indicator'
import Mask from '../component/Mask'
import axios from 'axios'

import qs from 'qs'
import config from '../../config'
import bus from '../../bus'
import tools from '../../tools'

export default {
  name: 'updateclientinfo',
  data() {
    return {
      title: '核对并完善资料',//标题
      tipcontent: ['身份证信息', '联系地址', '其他信息', '账户所属及诚信信息', '邀请码信息'],//提示语
      nextstep: {
        next: true,
        text: '下一步'
      },
      person_data: {}, //通过接口拿到的数据（个人信息）
      education_data: [],//三个学历信息选择框的数据
      account_data: [],//三个账户所属及诚信信息选择框的数据
      current_data: {}, //最后提交的数据（个人信息）
      contanct_address: '', // 联系地址
      hasGotEducational: false, // 记录获取学历选项信息是否已经完成
      is_show_indicator: true,
      isShowCreditSelect: false,
      inputbox: [{
        'labeltitle': '姓名',
      },
      {
        'labeltitle': '身份证号',
      },
      {
        'labeltitle': '证件地址',
      },
      {
        'labeltitle': '起始日期',
      },
      {
        'labeltitle': '结束日期',
      },
      {
        'labeltitle': '联系地址'
      },
      {
        'labeltitle': '邮编'
      },
      {
        'labeltitle': '工作单位',
        'placeholder': '必填'
      },
      {
        'labeltitle': '暗号',
        'placeholder': '请填写暗号'
      }
      ],
      switchBox: [
        {
          'lable': '与证件地址一致',
          'id': 'sameWithIdCard',
          'value': true
        }
      ],
      selectbox: [
        {
          labeltitle: '民族',
          options: [{ code: '01', name: '汉族' },
          { code: '02', name: '蒙古族' },
          { code: '03', name: '回族' },
          { code: '04', name: '藏族' },
          { code: '05', name: '维吾尔族' },
          { code: '06', name: '苗族' },
          { code: '07', name: '彝族' },
          { code: '08', name: '壮族' },
          { code: '09', name: '布依族' },
          { code: '10', name: '朝鲜族' },
          { code: '11', name: '满族' },
          { code: '12', name: '侗族' },
          { code: '13', name: '瑶族' },
          { code: '14', name: '白族' },
          { code: '15', name: '土家族' },
          { code: '16', name: '哈尼族' },
          { code: '17', name: '哈萨克族' },
          { code: '18', name: '傣族' },
          { code: '19', name: '黎族' },
          { code: '20', name: '僳僳族' },
          { code: '21', name: '佤族' },
          { code: '22', name: '畲族' },
          { code: '23', name: '高山族' },
          { code: '24', name: '拉祜族' },
          { code: '25', name: '水族' },
          { code: '26', name: '东乡族' },
          { code: '27', name: '纳西族' },
          { code: '28', name: '景颇族' },
          { code: '29', name: '柯尔克孜族' },
          { code: '30', name: '土族' },
          { code: '31', name: '达斡尔族' },
          { code: '32', name: '仫佬族' },
          { code: '33', name: '羌族' },
          { code: '34', name: '布朗族' },
          { code: '35', name: '撒拉族' },
          { code: '36', name: '毛难族' },
          { code: '37', name: '仡佬族' },
          { code: '38', name: '锡伯族' },
          { code: '39', name: '阿昌族' },
          { code: '40', name: '普米族' },
          { code: '41', name: '塔吉克族' },
          { code: '42', name: '怒族' },
          { code: '43', name: '乌孜别克族' },
          { code: '44', name: '俄罗斯族' },
          { code: '45', name: '鄂温克族' },
          { code: '46', name: '崩龙族' },
          { code: '47', name: '保安族' },
          { code: '48', name: '裕固族' },
          { code: '49', name: '京族' },
          { code: '50', name: '塔塔尔族' },
          { code: '51', name: '独龙族' },
          { code: '52', name: '鄂伦春族' },
          { code: '53', name: '赫哲族' },
          { code: '54', name: '门巴族' },
          { code: '55', name: '珞巴族' },
          { code: '56', name: '基诺族' }],
          defaultoption: '请选择',
        },
        {
          labeltitle: '学历',
          options: [],
          defaultoption: '请选择',
        },
        {
          labeltitle: '行业',
          options: [],
          defaultoption: '请选择'
        },
        {
          labeltitle: '职业',
          options: [],
          defaultoption: '请选择'
        },
        {
          labeltitle: '职务',
          options: [],
          defaultoption: '请选择'
        },
        {
          labeltitle: '账户受益人',
          options: [{index: 0, name: '本人'}, {index: 1, name: '其他人'}],
          defaultoption: '本人'
        },
        {
          labeltitle: '实际控制人',
          options: [{index: 0, name: '本人'}, {index: 1, name: '其他人'}],
          defaultoption: '本人'
        },
        {
          labeltitle: '不良诚信记录',
          options: [
            {index: 0, name: '中国人民银行征信中心', isSelected: false},
            {index: 1, name: '最高人民法院失信被执行人名单', isSelected: false},
            {index: 2, name: '工商行政管理机构', isSelected: false},
            {index: 3, name: '税务管理机构', isSelected: false},
            {index: 4, name: '监管机构、自律组织'},
            {index: 5, name: '投资者在证券经营机构从事投资活动时产生的违约等失信行为记录', isSelected: false},
            {index: 6, name: '恶意维权等不当行为信息', isSelected: false},
            {index: 7, name: '其他不良记录', isSelected: false}],
          defaultoption: '无',
          value: [] // 已经选择的选项数组
        }
      ],
      alertbox: {
        show: false,
        content: [],
      },
      reloadbox: {
        show: false,
        content: '',
        getSelect: true,
        getClientInfo: true,
      }
    }
  },
  computed: {
    textEllipsis: function () {
      if(this.selectbox[7].value.length > 0){
        let arr = []
        this.selectbox[7].value.forEach(item => {
          if(item.name){
            arr.push(item.name);
          }
        })
        return arr.join('、').substring(0, 12)+'...'
      }else{
        return false
      }
    }
  },
  components: {
    'v-tip': Tip,
    'v-inputbox': Inputbox,
    'v-nextstep': Nextstep,
    'v-selectbox': Selectbox,
    'v-switch': Switch,
    'v-alertbox': AlertBox,
    'v-reloadbox': ReloadBox,
    'v-mask': Mask,
    'v-indicator': Indicator
  },
  methods: {
    //以下方法是获取输入框的值及对应的校验方法
    name: function (name) {
      this.current_data['name'] = name;
    },
    checkName: function () {
      var strLength = this.current_data['name'].replace(/[^\x00-\xff]/g, '__').length;
      if (strLength == 0) {
        this.alertbox.content = ["您还没有填写姓名哦！"];
        this.alertbox.show = true;
        return false;
      }
      if (strLength > 16) {
        this.alertbox.content = ["中文字符不大于8位,英文字符不大于16位"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    checkIdNumber: function () {
      var str = this.current_data['id_number'];
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      };
      var tip = "";
      var date = new Date();
      var year = date.getFullYear();
      var idCardYear = parseInt(str.substr(6, 4));
      var age = year - idCardYear;
      if (!str) {
        tip = "您还没有填写身份证哦！";
      } else if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(str)) {
        tip = "身份证号码填写有误，请核实";
      } else if (!city[str.substr(0, 2)]) {
        tip = "地址编码错误";
      } else if (age < 18 || age > 70) {
        if (age < 18) {
          tip = '您的年龄未满18岁';
        } else {
          tip = '您的年龄已满70岁';
        }
      } else {
        //18位身份证需要验证最后一位校验位
        if (str.length == 18) {
          str = str.split('');
          //∑(ai×Wi)(mod 11) 加权因子
          var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          //校验位
          var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++) {
            ai = str[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if (last != str[17]) {
            tip = "身份证最后一位有误，请核实";
          }
        }
      }

      if (tip.length > 0) {
        this.alertbox.content = [tip];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    idNumber: function (idnumber) {
      this.current_data['id_number'] = idnumber;
    },
    issuedDepart: function (name) {
      this.current_data['issued_depart'] = name;
    },
    checkIssuedDepart: function () {
      var str = this.current_data['issued_depart'];
      var strLength = str.replace(/[^\x00-\xff]/g, '__').length;
      if (strLength >= 8) {
        return true;
      } else {
        this.alertbox.content = ["签发机关长度不能少于4个汉字"];
        this.alertbox.show = true;
      }
      if (strLength == 0) {
        this.alertbox.content = ["您还没有填写身份证发证机关哦！"];
        this.alertbox.show = true;
        return false;
      }
      return false;
    },
    idAddress: function (address) {
      this.current_data['id_address'] = address;
    },
    checkIdAddress: function () {
      var str = this.current_data['id_address'];
      var strLength = str.replace(/[^\x00-\xff]/g, '__').length;
      if (strLength >= 16) {
        return true;
      } else {
        this.alertbox.content = ["证件地址至少输入8位汉字"];
        this.alertbox.show = true;
        return false;
      }
    },
    contactAddress: function (address) {
      this.current_data['address'] = address;
    },
    checkContactAddress: function () {
      var str = this.current_data['address'];
      var strLength = str.replace(/[^\x00-\xff]/g, '__').length;
      if (strLength >= 16) {
        return true;
      } else {
        this.alertbox.content = ["联系地址至少输入8位汉字"];
        this.alertbox.show = true;
        return false;
      }
    },
    minZu: function (minzu) {
      this.current_data['minzu_code'] = this.switchBox[0].options.some(item => {
        return item.name === minzu;
      }).code;
    },
    checkMinZu: function () {
      if (!this.current_data['minzu_code']) {
        this.alertbox.content = ["请选择民族"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    zipCode: function (zipcode) {
      this.current_data['zipcode'] = zipcode;
    },
    checkZipCode: function () {
      var str = this.current_data['zipcode'];
      var reg = /[1-9]\d{5}(?!\d)/g;
      if (reg.test(str)) {
        return true;
      } else {
        this.alertbox.content = ["请填写正确的邮政编码"];
        this.alertbox.show = true;
        return false;
      }
    },
    checkZipCode: function () {
      var str = this.current_data['zipcode'];
      var reg = /[1-9]\d{5}(?!\d)/g;
      if (reg.test(str)) {
        return true;
      } else {
        this.alertbox.content = ["请填写正确的邮政编码"];
        this.alertbox.show = true;
        return false;
      }
    },
    inviteCode: function (invitecode) {
      this.current_data['invite_code'] = invitecode;
    },
    password: function (password) {
      this.current_data['password'] = password;
    },
    sameWitchIdCard: function (val) {
      this.switchBox[0].value = val;
      if(val){
        this.contanct_address = this.person_data.id_address;
      }else{
        this.contanct_address = '';
      }
    },
    degree: function (item) {
      this.current_data['degree'] = item;
    },
    checkdegree: function () {
      if (!this.current_data['degree'] || this.current_data['degree'] == '请选择') {
        this.alertbox.content = ["请选择您的学历"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    industry: function (item) {
      this.current_data['industry'] = item;
    },
    checkIndustry: function () {
      if (!this.current_data['industry'] || this.current_data['industry'] == '请选择') {
        this.alertbox.content = ["请选择您的行业"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    profession: function (item) {
      this.current_data['profession'] = item;
    },
    checkProfession: function () {
      if (!this.current_data['profession'] || this.current_data['profession'] == '请选择') {
        this.alertbox.content = ["请选择您的职业"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    position: function (item) {
      this.current_data['duty'] = item;
    },
    checkPosition: function () {
      if (!this.current_data['duty'] || this.current_data['duty'] == '请选择') {
        this.alertbox.content = ["请选择您的职务"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    workUnit: function (workunit) {
      this.current_data['workUnit'] = workunit;
    },
    checkWorkUnit: function () {
      if (!this.current_data['workUnit']) {
        this.alertbox.content = ["请填写您的工作单位"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    beneficiaryPerson: function(item){
      this.current_data['beneficiaryPerson'] = item;
      if(item === '其他人'){
        this.alertbox.content = ["证券受益人非您本人，网上无法准确验证该信息，建议您到附近营业部临柜开户。"];
        this.alertbox.show = true;
      }
    },
    checkBeneficiaryPerson: function(){
      if (!this.current_data['beneficiaryPerson'] || this.current_data['beneficiaryPerson'] == '请选择') {
        this.alertbox.content = ["请选择账户受益人"];
        this.alertbox.show = true;
        return false;
      }
      if (this.current_data['beneficiaryPerson'] == '其他人') {
        this.alertbox.content = ["证券受益人非您本人，网上无法准确验证该信息，建议您到附近营业部临柜开户。"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    controlNaturePerson: function(item){
      this.current_data['controlNaturePerson'] = item;
      if(item === '其他人'){
        this.alertbox.content = ["证券实际控制人非您本人，网上无法准确验证该信息，建议您到附近营业部临柜开户。"];
        this.alertbox.show = true;
      }
    },
    checkControlNaturePerson: function(){
      if (!this.current_data['controlNaturePerson'] || this.current_data['controlNaturePerson'] == '请选择') {
        this.alertbox.content = ["请选择账户实际控制人"];
        this.alertbox.show = true;
        return false;
      }
      if (this.current_data['controlNaturePerson'] == '其他人') {
        this.alertbox.content = ["证券实际控制人非您本人，网上无法准确验证该信息，建议您到附近营业部临柜开户。"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    openCreditRecordPage: function(){
      this.isShowCreditSelect = true
      // 通知topbar改变title
      bus.$emit('openCreditRecord', {title: '不良诚信记录', callBackName: 'closeCreditRecord'})
      bus.$on('closeCreditRecord', obj => {
        this.isShowCreditSelect = false
      })
    },
    handleSelectCredit: function(event){
      let self = this
      let index = event.target.dataset.index
      let id = event.target.dataset.id
      // 去重处理
      let isExisted = self.selectbox[7].options.some(item => {
        return item.isSelected && item.index === parseInt(index);
      });
      // 如果当前已经被选中则讲isSelected设置为false，并从value数组中去除该项
      if(!isExisted){
        self.selectbox[7].value.push({id: id, name: self.selectbox[7].options[index].name});
        self.selectbox[7].options[index].isSelected = true;
      }else{
        self.selectbox[7].value = self.selectbox[7].value.filter(item => {return item !== self.selectbox[7].options[index].name});
        self.selectbox[7].options[index].isSelected = false;
      }
    },
    handleClearCredit: function(){
      let self = this;
      self.selectbox[7].value = [];
      self.selectbox[7].options =  self.selectbox[7].options.map(item => {
        item.isSelected = false;
        return item;
      })
    },
    getDatePickStart: function (event) {
      var self = this;
      callNativeHandler('khh5', {
        "action": "showDatePick",
        "reqId": "showDatePickStart",
        "param": {
          "isEndDate": false,
          "initDate": ""
        }
      }, function (data) {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        if (data.param.outDate) {
          self.person_data.id_begindate = data.param.outDate;
          self.current_data['id_begindate'] = self.person_data.id_begindate;
        }
      });
    },
    getDatePickEnd: function () {
      var self = this;
      callNativeHandler('khh5', {
        "action": "showDatePick",
        "reqId": "showDatePickEnd",
        "param": {
          "isEndDate": true,
          "initDate": ""
        }
      }, function (data) {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        if (data.param.outDate) {
          self.person_data.id_enddate = data.param.outDate;
          self.current_data['id_enddate'] = self.person_data.id_enddate;
        }
      });
    },
    checkdate: function () {
      var start = this.person_data.id_begindate;
      var end = this.person_data.id_enddate;
      if (end - start == 100000 || end - start == 200000 || end == '30000101') { } else {
        this.alertbox.content = ['身份证有效期限有误！'];
        this.alertbox.show = true;
        return false;
      }
      if (this.timeRegExp(start) && this.timeRegExp(end)) {
        var start = start.substring(0, 4) + "/" + start.substring(4, 6) + "/" + start.substring(6, 8);
        var end = end.substring(0, 4) + "/" + end.substring(4, 6) + "/" + end.substring(6, 8);
        var d1 = new Date(start);
        var d2 = new Date(end);
        var d3 = new Date();
        if (d1 > d3) {
          this.alertbox.content = ["起始时间不能大于当前时间"];
          this.alertbox.show = true;
          return false;
        }
        if (d2 < d3) {
          this.alertbox.content = ["身份证已过期"];
          this.alertbox.show = true;
          return false;
        }
        if (d1 > d2) {
          this.alertbox.content = ["起始时间不能大于结束时间"];
          this.alertbox.show = true;
          return false;
        }
      } else {
        this.alertbox.content = ["请输入正确的日期格式如20150101"];
        this.alertbox.show = true;
        return false;
      }
      return true;
    },
    timeRegExp: function (str) {
      var reg =
        /((^((1[8-9]\d{2})|([2-9]\d{3}))(10|12|0?[13578])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(11|0?[469])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(0?2)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(0?2)(29)$)|(^([3579][26]00)(0?2)(29)$)|(^([1][89][0][48])(0?2)(29)$)|(^([2-9][0-9][0][48])(0?2)(29)$)|(^([1][89][2468][048])(0?2)(29)$)|(^([2-9][0-9][2468][048])(0?2)(29)$)|(^([1][89][13579][26])(0?2)(29)$)|(^([2-9][0-9][13579][26])(0?2)(29)$))/ig;
      if (!reg.test(str)) {
        return false;
      }
      return true;
    },
    closeAlertBox: function () {//关闭弹出框
      this.alertbox.show = false;
    },
    allowNext: function () {//下一步按钮点击事件
      this.current_data['id_begindate'] = this.person_data.id_begindate;
      this.current_data['id_enddate'] = this.person_data.id_enddate;
      // this.current_data['address'] = this.contanct_address;
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
          self.alertbox.content = ['网络连接失败，请重新连接网络'];
          self.alertbox.show = true;
        } else {
          if (self.checkName()) {
            if (self.checkIdNumber()) {
              if (self.checkdate()) {
                if (self.checkIdAddress()) {
                  if (self.checkdegree()) {
                    if (self.checkIndustry()) {
                      if (self.checkProfession()) {
                        if (self.checkPosition()) {
                          if (self.checkWorkUnit()) {
                            if (self.checkBeneficiaryPerson()) {
                              if (self.checkControlNaturePerson()) {
                                self.is_show_indicator = true;
                                localStorage.setItem('clientInfo' + localStorage.getItem('telKey'), JSON.stringify(
                                self.current_data));
                                self.updateClientInfo();
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        });
    },
    updateClientInfo: function () {//提交身份信息
      let self = this
      // 格式化诚信记录输出
      let creditRecordIds = []
      self.selectbox[7].value.forEach(item => {
        if(item.id){
          creditRecordIds.push(item.id)
        }
      })
      creditRecordIds.sort((id1, id2) => {
        return parseInt(id1) - parseInt(id2);
      })
      let data = qs.stringify({
        client_name: self.current_data.name,
        id_no: self.current_data.id_number,
        id_address: self.current_data.id_address,
        id_begindate: self.current_data.id_begindate,
        id_enddate: self.current_data.id_enddate,
        // minzu_code: self.current_data.minzu_code,
        // issued_depart: self.current_data.issued_depart,
        address: self.current_data.id_address, //与证件地址一致
        degree_code: self.getCode(self.current_data.degree, self.education_data.degree),
        profession_code: self.getCode(self.current_data.profession, self.education_data.profession),
        industry_code: self.getCode(self.current_data.industry, self.education_data.industry),
        position: self.getCode(self.current_data.duty, self.education_data.position),
        workUnit: self.current_data.workUnit,
        beneficiaryPerson: 1, // 非本人不能网上开户
        controlNaturePerson: 1,
        creditRecord: creditRecordIds.join(',') || ''
      });
      axios.post(config.qsInterface + 'updateClientInfo', data).then(function (response) {
        if (response.data.error_no == 0) {
          self.is_show_indicator = false;
          // 上传完成之后直接进入税收页面，税收完成之后跳转
          tools.stepSync('updateClientInfo');
          router.push('/revenue/15')
        } else {
          self.is_show_indicator = false;
          self.alertbox.content = [response.data.error_info];
          self.alertbox.show = true;
        }
      }).catch(function (error) {
        self.is_show_indicator = false;
        self.alertbox.content = ['用户资料录入失败'];
        self.alertbox.show = true;
      });
    },
    getCode: function (name, arr) {//获取选择框选项对应的id
      for (var i = 0; i < arr.length; i++) {
        if (name == arr[i].name) {
          return arr[i].id;
        }
      }
    },
    getName: function (id, arr) {//获取选择框选项对应的name
      for (var i = 0; i < arr.length; i++) {
        if (id == arr[i].id) {
          return arr[i].name;
        }
      }
    },
    backPage: function () {//数据加载失败，点击返回按钮
      this.reloadbox.show = false;
      router.push('/sendpic/2');
      if (localStorage.getItem('rejectedSign') == 'true') {
        tools.exitKaihu();
      }
    },
    clickReload: function () {//数据加载失败，点击重新加载按钮
      if (this.reloadbox.getSelect == false) {
        this.getEducational();
      }
      if (this.reloadbox.getClientInfo == false) {
        this.getClientInfo();
      }
    },
    getClientInfo() {//获取身份信息
      var self = this;
      axios.get(config.qsInterface + 'ClientInfoQuery').then(function (response) {
        if (response.data.error_no == 0) {
          self.person_data = response.data;
          // self.contanct_address = self.person_data.id_address || '';
          //初始化多选框的值
          (function () {
            try{
              let timmer = setInterval(function () {
                if (self.hasGotEducational) {
                    self.selectbox[1].defaultoption = self.getName(self.person_data.degree_code, self.education_data.degree)
                    self.selectbox[2].defaultoption = self.getName(self.person_data.industry_code, self.education_data.industry)
                    self.selectbox[3].defaultoption = self.getName(self.person_data.profession_code, self.education_data.profession)
                    self.selectbox[4].defaultoption = self.getName(self.person_data.duty, self.education_data.position)
                    if (self.person_data.creditRecord) {
                      let recordIds = self.person_data.creditRecord.split(',')
                      let recordNames = recordIds.map(item => {
                        return { id: item, name: self.getName(item, self.selectbox[7].options) }
                      })
                      self.selectbox[7].value = recordNames
                    }
                    clearInterval(timmer);
                  }
                }, 50)
              }catch(err){
              }
          })()
          console.log(self.person_data);
          self.is_show_indicator = false;
        } else {
          self.is_show_indicator = false;
          self.alertbox.content = [response.data.error_info];
          self.alertbox.show = true;
          self.reloadbox.content = '查询用户数据失败，请重新加载！';
          self.reloadbox.show = true;
          self.reloadbox.getClientInfo = false;
        }
      }).catch(function (error) {
        self.is_show_indicator = false;
        self.reloadbox.content = '查询用户数据失败，请重新加载！';
        self.reloadbox.show = true;
        self.reloadbox.getClientInfo = false;
      });
    },
    getEducational() {//获取选择框数据
      var self = this
      self.is_show_indicator = true
      axios.get(config.qsInterface + 'Select').then(function (response) {
        if (response.data.error_no == 0) {
          self.education_data = response.data.resultList
          // 设置诚信记录选项
          let creditRecords = response.data.resultList.creditRecord.sort((credit1, credit2) => {
            return parseInt(credit1.id) - parseInt(credit2.id)
          })
          self.selectbox[7].options = creditRecords.map((item, index) => {
            item.index = index
            return item
          })
          self.hasGotEducational = true
          self.is_show_indicator = false
        } else {
          self.alertbox.content = [response.data.error_info]
          self.alertbox.show = true
          self.reloadbox.content = '获取学历、职业、行业失败，请重新加载!'
          self.reloadbox.show = true
          self.reloadbox.getSelect = false
          self.is_show_indicator = false
        }
      }).catch(function (error) {
        console.log(error);
        self.reloadbox.content = '获取学历、职业、行业失败，请重新加载!'
        self.reloadbox.show = true
        self.reloadbox.getSelect = false
        self.is_show_indicator = false
      });
    }
  },
  created: function () {
    bus.$emit('titleName', this.title, 3);
    if (localStorage.getItem('clientInfo' + localStorage.getItem('telKey'))) {
      this.current_data['degree'] = this.selectbox[0].defaultoption = JSON.parse(localStorage.getItem('clientInfo' +
        localStorage.getItem('telKey'))).degree;
      this.current_data['industry'] = this.selectbox[1].defaultoption = JSON.parse(localStorage.getItem(
        'clientInfo' + localStorage.getItem('telKey'))).industry;
      this.current_data['profession'] = this.selectbox[2].defaultoption = JSON.parse(localStorage.getItem(
        'clientInfo' + localStorage.getItem('telKey'))).profession;
    }
    this.getClientInfo();
    this.getEducational();
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

.double-input-box {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  border-bottom: 1px solid #d7d7d7;
  padding: 0 0.3rem;
  box-sizing: border-box;
  font-size: 0.34rem;
  background-color: #fff;
  position: relative;
  box-sizing: border-box;
}

.double-input-box label {
  width: 1.6rem;
  color: #999;
  display: inline-block;
}

.double-input {
  display: inline-block;
}

.double-input .date-box {
  width: 2rem;
  text-align: center;
  border: none;
  outline: none;
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
  color: #999;
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

.switch-btn label.true {
  background: rgb(65, 159, 248) !important
}

.inline {
  white-space: nowrap;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  border-bottom: 1px solid #d7d7d7;
  padding: 0 0.3rem;
  box-sizing: border-box;
  font-size: 0.34rem;
  background-color: #fff;
  position: relative;
}

.inline-title {
  color: #999;
  display: inline-block;
  width: 2rem;
  white-space: nowrap;
}

.inline-value {
  display: inline-block;
  width: 4.5rem;
  position: relative;
  padding-left: .3rem;
  white-space: nowrap;
}

.inline .right-icon {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  position: absolute;
  top: .34rem;
  right: 0.22rem;
  background: url(../../images/select_arrow.png) no-repeat center center;
  background-size: 0.32rem 0.32rem;
}

.credit-select {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 799;
  padding-top: .96rem;
  box-sizing: border-box;
  font-size: .34rem;
}

.credit-select-value {
  border-bottom: 1px solid #d7d7d7;
  height: .72rem;
  line-height: .72rem;
  padding: 0 .51rem 0 .16rem;
  white-space: nowrap;
  overflow-x: auto;
  color: #333;
  position: relative;
  text-overflow: ellipsis;
}

.credit-select-des {
  background: #eee;
  color: #999;
  padding: .05rem .12rem;
}

.credit-select>ul {
  color: #555;
}

.credit-select ul>li {
  box-sizing: border-box;
  padding: .16rem 1.2rem .16rem .16rem;
  border-bottom: 1px solid #d7d7d7;
  position: relative;
}

.credit-select ul>li.selected::after {
  content: '';
  display: inline-block;
  height: .68rem;
  width: .68rem;
  position: absolute;
  right: .28rem;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: -webkit-translateY(-50%);
  background: url('../../images/success.png');
  background-size: .68rem .68rem;
}

.credit-select .close-icon{
  display: inline-block;
  position: absolute;
  top: .13rem;
  right: .13rem;
  width: .45rem;
  height: .45rem;
  background: url('../../images/close.png');
  background-size: 0.45rem .45rem;
}

</style>
