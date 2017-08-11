<template>
  <div class="sendpic">
    <v-tip :content="tipcontent" style="padding:0.2rem 0.3rem;"></v-tip>
    <div class="id-card-box"@click="uploadPositive">
      <div class="unupload" v-if="!id_card_box[0].uploadding" >
        <ul class="unupload-content">
          <li><img src="../../images/sendpic/idcard.png"></li>
          <li class="add-icon"></li>
          <li>身份证正面照片</li>
          <li class="statement">照片仅用于股票开户，他用无效</li>
        </ul>
      </div>
      <div class="uploadding" v-show="id_card_box[0].show_bar">
        <div class="progress-bar">
          <div style="overflow:hidden;" class="bar-box" id="barBox1">
            <div class="bar"></div>
          </div>
        </div>
        <p class="upload-status">{{id_card_box[0].upload_status}} {{id_card_box[0].upload_rate}}</p>
      </div>
      <transition name="fade">
        <div class="pop" v-if="id_card_box[0].pop_box.show">
          {{id_card_box[0].pop_box.content}}
        </div>
      </transition>
      <div class="img" v-if="id_card_box[0].img_show">
        <img :src="id_card_box[0].image" alt="">
      </div>
    </div>
    <div class="id-card-box" @click="uploadOpposite">
      <div class="uploadding" v-show="id_card_box[1].show_bar">
        <div class="progress-bar">
          <div style="overflow:hidden;" class="bar-box"  id="barBox2">
            <div class="bar"></div>
          </div>
        </div>
        <p class="upload-status">{{id_card_box[1].upload_status}} {{id_card_box[1].upload_rate}}</p>
      </div>
      <div class="unupload" v-if="!id_card_box[1].uploadding" >
        <ul class="unupload-content">
          <li><img src="../../images/sendpic/idcard.png"></li>
          <li class="add-icon"></li>
          <li>身份证反面照片</li>
          <li class="statement">照片仅用于股票开户，他用无效</li>
        </ul>
      </div>
      <transition name="fade">
        <div class="pop" v-if="id_card_box[1].pop_box.show">
          {{id_card_box[1].pop_box.content}}
        </div>
      </transition>
      <div class="img" v-if="id_card_box[1].img_show">
        <img :src="id_card_box[1].image" alt="">
      </div>
    </div>
    <!--<div class="id-card-box" @click="uploadBig">
      <div class="uploadding" v-if="id_card_box[2].show_bar">
        <div class="progress-bar">
          <div style="overflow:hidden;" class="bar-box" id="barBox3">
            <div class="bar"></div>
          </div>
        </div>
        <p class="upload-status">{{id_card_box[2].upload_status}} {{id_card_box[2].upload_rate}}</p>
      </div>
      <div class="unupload" v-if="!id_card_box[2].uploadding">
        <ul class="unupload-content">
          <li><img src="../../images/Addface/face.png"></li>
          <li class="add-icon"></li>
          <li>本人免冠照片</li>
           <li class="statement">照片仅用于股票开户，他用无效</li>
        </ul>
      </div>
      <transition name="fade">
        <div class="pop" v-if="id_card_box[2].pop_box.show">
          {{id_card_box[2].pop_box.content}}
        </div>
      </transition>
      <div class="img">
        <img :src="id_card_box[2].image" alt="">
      </div>
    </div>-->

    <div class="certificate">
      <input type="checkbox" v-model="checked" style="display: none;" id="agree"><label for="agree" :class="{unchecked:!checked}">我已认真阅读并知晓</label>
      <a href="javascript:void(0);" @click="showAlert">数字证书安装使用协议</a>
    </div>

    <v-alertcontent @closeAlertContent="closeAlertContent" :is_show="alertcontent.show" :content="alertcontent.content"></v-alertcontent>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-nextstep :text="nextstep.text" :next="nextstep.next" @goNext="allowNext"></v-nextstep>
    <v-mask :is_show="upload || alertcontent.show || alertbox.show " @hide="cancelSelect"></v-mask>
    <div>
      <div v-if="is_high">
        <div class="select-photo" v-show="upload">
          <div class="photo_box">
            <div class="takephoto" @click="takePhoto">拍照</div>
            <div class="Photogallery" @click="photoGallery">从相册中选择</div>
          </div>
          <div class="cancel" @click="cancelSelect">取消</div>
        </div>
      </div>
      <div v-else>
        <div class="select-photo" :class="{'select-photo-show':upload,'high':!is_high}">
          <div class="photo_box">
            <div class="takephoto" @click="takePhoto">拍照</div>
            <div class="Photogallery" @click="photoGallery">从相册中选择</div>
          </div>
          <div class="cancel" @click="cancelSelect">取消</div>
        </div>
      </div>
    </div>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>



</template>
<script>
  import router from '../../router'
  import Topbar from '../component/topbar'
  import Tip from '../component/Tip'
  import Mask from '../component/Mask'
  import Nextstep from '../component/NextStep'
  import AlertContent from '../component/AlertContent'
  import AlertBox from '../component/AlertBox'
  import Indicator from '../component/Indicator'
  import axios from 'axios'
  
  import bus from '../../bus'
  import config from '../../config'
  import qs from 'qs'
  import tools from '../../tools'

  export default {
    name: 'sendpic',
    data() {
      return {
        title: '上传身份照片', //标题
        tipcontent: '', //提示语
        upload: false, //要上传为true时显示底部选择
        checked: true, //是否勾选单选框
        is_high: true, //判断手机版本，确定不同效果
        is_show_indicator: false, //是否显示加载图标

        id_card_box: [{
            upload_rate: '0%',
            upload_status: '正在上传',
            uploadding: false,
            already_upload: false,
            image: '',
            upload_success: true,
            img_show: false,
            show_bar: false,
            pop_box: {
              content: '上传成功',
              show: false,
            }
          },
          {
            upload_rate: '0%',
            upload_status: '正在上传',
            uploadding: false,
            upload_success: true,
            already_upload: false,
            image: '',
            show_bar: false,
            img_show: false,
            pop_box: {
              content: '上传成功',
              show: false,
            }
          },
          {
            upload_rate: '0%',
            upload_status: '正在上传',
            uploadding: false,
            upload_success: true,
            already_upload: false,
            show_bar: false,
            image: '',
            img_show: false,
            pop_box: {
              content: '上传成功',
              show: false,
            }
          }
        ],
        alertcontent: {
          content: '',
          show: false,
        },
        alertbox: {
          content: '',
          show: false,
        }
      }
    },
    components: {
      'v-topbar': Topbar,
      'v-tip': Tip,
      'v-mask': Mask,
      'v-nextstep': Nextstep,
      'v-alertcontent': AlertContent,
      'v-alertbox': AlertBox,
      'v-indicator': Indicator
    },
    methods: {
      uploadPositive: function () { //点击上传身份证正面照片
        if (this.id_card_box[0].upload_success) {
          this.upload = true;
          this.id_card_box[0].already_upload = true;
        }
      },
      uploadOpposite: function () { //点击上传身份证反面照片
        if (this.id_card_box[1].upload_success) {
          this.upload = true;
          this.id_card_box[1].already_upload = true;
        }
      },
      uploadBig: function () { //点击上传大头照
        if (this.id_card_box[2].upload_success) {
          this.upload = true;
          this.id_card_box[2].already_upload = true;
        }
      },
      takePhoto: function () { //点击拍照按钮
        var self = this;
        var imgType = 1; //imgType=1=>身份证正面照片 imgType=2 => 身份证反面照片 imgType=3 => 大头照

        if (this.id_card_box[0].already_upload) {
          imgType = 1;
          this.id_card_box[0].already_upload = false;
        }
        if (this.id_card_box[1].already_upload) {
          imgType = 2;
          this.id_card_box[1].already_upload = false;
        }
        if (this.id_card_box[2].already_upload) {
          imgType = 3;
          this.id_card_box[2].already_upload = false;
        }
        callNativeHandler('khh5', {
          "action": "takePhoto",
          "reqId": "takePhoto",
          "param": {
            "imgType": imgType
          },
        }, function (data) {
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          self.upload = false;
          if (imgType == 1) {
            if (!data.param.imgData) {
              return;
            }
            self.id_card_box[0].upload_success = false;
            self.id_card_box[0].image = 'data:image/jpg;base64,' + data.param.imgData;
            self.id_card_box[0].uploadding = true;
            self.id_card_box[0].img_show = true;
            self.id_card_box[0].already_upload = false;
            self.id_card_box[0].show_bar = true;
            document.querySelector('#barBox1').style.width = '0%';
            (function(){
              var rate = 0;
              var timer = setInterval(function () {
                rate += 1;
                self.id_card_box[0].upload_rate = rate + '%';
                document.querySelector('#barBox1').style.width = rate + '%';
                if (rate >= 99) {
                  clearInterval(timer);
                }
              }, 50);
            })()
            self.isUploadSuccess('6A', data.param.imgData);
          } else if (imgType == 2) {
            if (!data.param.imgData) {
              return;
            }
            self.id_card_box[1].upload_success = false;
            self.id_card_box[1].image = 'data:image/jpg;base64,' + data.param.imgData;
            self.id_card_box[1].uploadding = true;
            self.id_card_box[1].already_upload = false;
            self.id_card_box[1].img_show = true;
            self.id_card_box[1].show_bar = true;
            document.querySelector('#barBox2').style.width = '0%';
            (function(){
              var rate = 0;
              var timer = setInterval(function () {
                rate += 1;
                self.id_card_box[1].upload_rate = rate + '%';
                document.querySelector('#barBox2').style.width = rate + '%';
                if (rate >= 99) {
                  clearInterval(timer);
                }
              }, 50);
            })()
            self.isUploadSuccess('6B', data.param.imgData);
          } else {
            if (!data.param.imgData) {
              return;
            }
            self.id_card_box[2].upload_success = false;
            self.id_card_box[2].image = 'data:image/jpg;base64,' + data.param.imgData;
            self.id_card_box[2].uploadding = true;
            self.id_card_box[2].already_upload = false;
            self.id_card_box[2].img_show = true;
            self.id_card_box[2].show_bar = true;
            document.querySelector('#barBox3').style.width = '0%';
            (function(){
              var rate = 0;
              var timer = setInterval(function () {
                rate += 1;
                self.id_card_box[2].upload_rate = rate + '%';
                document.querySelector('#barBox3').style.width = rate + '%';
                if (rate >= 99) {
                  clearInterval(timer);
                }
              }, 50);
            })()
            self.isUploadSuccess('80', data.param.imgData);
          }
        });
      },
      photoGallery: function () { //在相册中选择同拍照
        var self = this;
        var imgType = 1;
        if (this.id_card_box[0].already_upload) {
          imgType = 1;
          this.id_card_box[0].already_upload = false;
        }
        if (this.id_card_box[1].already_upload) {
          imgType = 2;
          this.id_card_box[1].already_upload = false;
        }
        if (this.id_card_box[2].already_upload) {
          imgType = 3;
          this.id_card_box[2].already_upload = false;
        }
        callNativeHandler('khh5', {
          "action": "pickAlbum",
          "reqId": "pickAlbum",
          "param": {
            "imgType": imgType
          },
        }, function (data) {
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          self.upload = false;
          if (imgType == 1) {
            if (!data.param.imgData) {
              return;
            }
            self.id_card_box[0].upload_success = false;
            self.id_card_box[0].image = 'data:image/jpg;base64,' + data.param.imgData;
            self.id_card_box[0].uploadding = true;
            self.id_card_box[0].already_upload = false;
            self.id_card_box[0].img_show = true;
            self.id_card_box[0].show_bar = true;
            document.querySelector('#barBox1').style.width = '0%';
            (function(){
              var rate = 0;
              var timer = setInterval(function () {
                rate += 1;
                self.id_card_box[0].upload_rate = rate + '%';
                document.querySelector('#barBox1').style.width =rate + '%';
                if (rate >= 99) {
                  clearInterval(timer);
                }
              }, 50);
            })()
            self.isUploadSuccess('6A', data.param.imgData);
          } else if (imgType == 2) {
            if (!data.param.imgData) {
              return;
            }
            self.id_card_box[1].upload_success = false;
            self.id_card_box[1].image = 'data:image/jpg;base64,' + data.param.imgData;
            self.id_card_box[1].uploadding = true;
            self.id_card_box[1].already_upload = false;
            self.id_card_box[1].img_show = true;
            self.id_card_box[1].show_bar = true;
            document.querySelector('#barBox2').style.width = '0%';
            (function(){
              var rate = 0;
              var timer = setInterval(function () {
                rate += 1;
                self.id_card_box[1].upload_rate = rate + '%';
                document.querySelector('#barBox2').style.width = rate + '%';
                if (rate >= 99) {
                  clearInterval(timer);
                }
              }, 50);
            })()
            self.isUploadSuccess('6B', data.param.imgData);
          } else {
            if (!data.param.imgData) {
              return;
            }
            self.id_card_box[2].upload_success = false;
            self.id_card_box[2].image = 'data:image/jpg;base64,' + data.param.imgData;
            self.id_card_box[2].uploadding = true;
            self.id_card_box[2].already_upload = false;
            self.id_card_box[2].img_show = true;
            self.id_card_box[2].show_bar = true;
            document.querySelector('#barBox3').style.width = '0%';
            (function(){
              var rate = 0;
              var timer = setInterval(function () {
                rate += 1;
                self.id_card_box[2].upload_rate = rate + '%';
                document.querySelector('#barBox3').style.width =  rate + '%';
                if (rate >= 99) {
                  clearInterval(timer);
                }
              }, 50);
            })()
            self.isUploadSuccess('80', data.param.imgData);
          }
        });
      },
      closeAlertBox: function () { //关闭弹出框
        this.alertbox.show = false;
      },
      cancelSelect: function () { //点击取消
        this.upload = false;
        this.alertcontent.show = false;
        this.alertbox.show = false;
        this.id_card_box[0].already_upload = false;
        this.id_card_box[1].already_upload = false;
        this.id_card_box[2].already_upload = false;
      },
      allowNext: function () { //下一步按钮点击事件
        var self = this;
        if (this.nextstep.next == true) {
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
              self.is_show_indicator = false;
              tools.stepSync('Sendpic');
              var nextlist = JSON.parse(localStorage.getItem('nextList'));
              if (nextlist.indexOf('Sendpic') > -1) {
                tools.nextpage = nextlist[nextlist.indexOf('Sendpic') + 1];
                tools.afterBackToOpenAccountStep();
              } else {
                router.push('/updateclientinfo/3');
              }
            }
          });
        }
      },
      closeAlertContent: function () { //关闭alertcontent 弹出框
        this.alertcontent.show = false;
      },
      showAlert: function () { //数字证书协议点击事件
        var self = this;
        axios.get(config.qsInterface + 'DigitalAgreement').then(function (response) {
          if (response.data.error_no == 0) {
            self.alertcontent.content = response.data.content;
            self.alertcontent.show = true;
          }
        }).catch(function (error) {
          self.alertbox.content = ['数字证书加载失败'];
          self.alertbox.show = true;
        });
      },
      isUploadSuccess: function (image_no, imgData) { //上传成功处理函数
        var self = this;
        var data = qs.stringify({
          image_no: image_no,
          image_type: ".jpg",
          image_data: imgData
        })
        axios.post(config.qsInterface + 'Sendpic', data).then(function (response) {
          if (response.data != null && response.data.error_no == 0) {
            if (image_no == '6A') {
              self.id_card_box[0].upload_success = true;
              self.id_card_box[0].pop_box.show = true;
              self.id_card_box[0].pop_box.content = "上传成功";
              self.id_card_box[0].show_bar = false;
              setTimeout(function () {
                self.id_card_box[0].pop_box.show = false;
              }, 2000);
            }
            if (image_no == '6B') {
              self.id_card_box[1].upload_success = true;
              self.id_card_box[1].pop_box.show = true;
              self.id_card_box[1].pop_box.content = "上传成功";
              self.id_card_box[1].show_bar = false;
              setTimeout(function () {
                self.id_card_box[1].pop_box.show = false;
              }, 2000);
            }
            if (image_no == '80') {
              self.id_card_box[2].upload_success = true;
              self.id_card_box[2].pop_box.show = true;
              self.id_card_box[2].pop_box.content = "上传成功";
              self.id_card_box[2].show_bar = false;
              setTimeout(function () {
                self.id_card_box[2].pop_box.show = false;
              }, 2000);
            }
          } else {
            if (image_no == '6A') {
              self.id_card_box[0].img_show = false;
              self.id_card_box[0].upload_success = true;
              self.id_card_box[0].uploadding = false;
              self.id_card_box[0].pop_box.show = true;
              self.id_card_box[0].pop_box.content = "上传失败,请重新上传";
              self.id_card_box[0].show_bar = false;
              setTimeout(function () {
                self.id_card_box[0].pop_box.show = false;
              }, 2000)
            }
            if (image_no == '6B') {
              self.id_card_box[1].img_show = false;
              self.id_card_box[1].upload_success = true;
              self.id_card_box[1].uploadding = false;
              self.id_card_box[1].pop_box.show = true;
              self.id_card_box[1].pop_box.content = "上传失败，请重新上传";
              self.id_card_box[1].show_bar = false;
              setTimeout(function () {
                self.id_card_box[1].pop_box.show = false;
              }, 2000);
            }
            if (image_no == '80') {
              self.id_card_box[2].img_show = false;
              self.id_card_box[2].upload_success = true;
              self.id_card_box[2].uploadding = false;
              self.id_card_box[2].pop_box.show = true;
              self.id_card_box[2].pop_box.content = "上传失败，请重新上传";
              self.id_card_box[2].show_bar = false;
              setTimeout(function () {
                self.id_card_box[2].pop_box.show = false;
              }, 2000);
            }
          }
        }).catch(function (error) {
          if (image_no == '6A') {
            self.id_card_box[0].upload_success = true;
            self.id_card_box[0].uploadding = false;
            self.id_card_box[0].pop_box.show = true;
            self.id_card_box[0].pop_box.content = "上传失败,请重新上传";
            self.id_card_box[0].show_bar = false;
            setTimeout(function () {
              self.id_card_box[0].pop_box.show = false;
            }, 2000)
          }
          if (image_no == '6B') {
            self.id_card_box[1].upload_success = true;
            self.id_card_box[1].uploadding = false;
            self.id_card_box[1].pop_box.show = true;
            self.id_card_box[1].pop_box.content = "上传失败，请重新上传";
            self.id_card_box[1].show_bar = false;
            setTimeout(function () {
              self.id_card_box[1].pop_box.show = false;
            }, 2000);
          }
          if (image_no == '80') {
            self.id_card_box[2].upload_success = true;
            self.id_card_box[2].uploadding = false;
            self.id_card_box[2].pop_box.show = true;
            self.id_card_box[2].pop_box.content = "上传失败，请重新上传";
            self.id_card_box[20].show_bar = false;
            setTimeout(function () {
              self.id_card_box[2].pop_box.show = false;
            }, 2000);
          }
        });
      }
    },
    computed: {
      nextstep() { //计算下一步是否可点击
        var next = this.id_card_box[0].image && this.id_card_box[1].image && this.checked;
        return {
          next: next,
          text: '下一步'
        }
      }
    },
    created: function () {
      //判断手机版本，修改效果
      var self = this;
      if ((/iPhone/).test(window.navigator.userAgent)) {
        if ((parseInt(window.navigator.userAgent.match(/iPhone OS \d{0,}_/).join('').split(' ').reverse()[0].replace(
            /_/,
            '')) >= 9)) {
          this.is_high = false;
        }
      }
      if ((/Android/).test(window.navigator.userAgent)) {
        if (!window.navigator.userAgent.match(/Android [2-4].[0-4]/)) {
          this.is_high = false;
        }
      }
      bus.$emit('titleName', this.title, 2);
      axios.get(config.qsInterface + 'comConf').then(function (response) {
        if (response.data.error_no == 0) {
          self.tipcontent = response.data.top_tip;
        } else {
          self.tipcontent = '根据证监部门的规定，为确保安全，需上传有效期内的二代身份证正反面照片。';
        }
      }).catch(function (error) {
        self.tipcontent = '根据证监部门的规定，为确保安全，需上传有效期内的二代身份证正反面照片。';
      });
    }
  }

</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }

  .id-card-box {
    width: 6.9rem;
    border: 1px solid #d7d7d7;
    height: 4rem;
    border-radius: 0.1rem;
    color: #999;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 0.4rem;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
  }

  .id-card-box .uploadding {
    position: absolute;
    width: 100%;
    top: 45%;
    z-index: 20;
    border-radius: 0.1rem;
    color: #fff;
  }

  .id-card-box .uploadding .progress-bar {
    width: 80%;
    height: 2px;
    border-radius: 2px;
    background-color: #d7d7d7;
    overflow: hidden;
    margin: 0 auto 0.3rem;
  }

  .id-card-box .uploadding .progress-bar .bar-box {
    height: 2px;
    width: 0%;
    overflow: hidden;
    border-radius: 2px;
  }

  .id-card-box .img {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 19;
    border-radius: 0.1rem;
    overflow: hidden;
  }

  .id-card-box .img:before {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.5;
    background-image: url(../../images/water.png);
    background-position: 90% 45%;
    background-repeat: no-repeat;
    background-size: 2.2rem 2.2rem;
    border-radius: 0.1rem;
  }

  .id-card-box .img img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 0.1rem;
  }

  .id-card-box .uploadding .progress-bar .bar {
    width: 100%;
    height: 100%;
    background-color: #3a83d7;
  }

  .id-card-box .uploadding .upload-status,
  .id-card-box .uploadding .upload-rate {
    font-size: 0.3rem;
    color: #999;
  }

  .id-card-box .unupload {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #fff;
    z-index: 30;
    font-size: 0.3rem;
    color: #999;
  }

  .id-card-box .unupload .unupload-content {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 40;
    width: 100%;
    transform: translate3d(-50%, -50%, 0);
  }

  .id-card-box .unupload .unupload-content .statement {
    color: #ddd;
  }

  .id-card-box .pop {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    transform: translate3d(-50%, -50%, 0);
    z-index: 50;
    border-radius: 3px;
    width: 3rem;
    padding: 0.2rem;
    font-size: 0.3rem;
  }

  .id-card-box .unupload img {
    width: 0.6rem;
    height: 0.52rem;
  }

  .add-icon {
    margin: 0.05rem 0;
    height: 0.5rem;
    position: relative;
  }

  .add-icon:after {
    content: "";
    width: 2px;
    height: 0.5rem;
    background-color: #999;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -0.25rem;
    margin-left: -1px;
  }

  .add-icon:before {
    content: "";
    height: 2px;
    width: 0.5rem;
    background-color: #999;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -0.25rem;
    margin-top: -1px;
  }

  .select-photo {
    height: 3.1rem;
    position: fixed;
    bottom: 0.3rem;
    z-index: 902;
    width: 100%;
    padding: 0 0.3rem;
    box-sizing: border-box;
  }

  .high {
    transition: all 0.5s linear;
    transform: translate3d(0, 400px, 0);
  }

  .select-photo-show {
    transform: translate3d(0, 0, 0);
  }

  .photo_box {
    width: 6.9rem;
    height: 2rem;
    border-radius: 0.2rem;
    bottom: 1.4rem;
    overflow: hidden;
  }

  .takephoto,
  .Photogallery {
    width: 6.9rem;
    background-color: #fff;
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    color: #3a83d7;
    font-size: 0.4rem;
  }

  .cancel {
    width: 6.9rem;
    background-color: #fff;
    text-align: center;
    border-radius: 0.2rem;
    height: 1rem;
    line-height: 1rem;
    color: #3a83d7;
    font-size: 0.4rem;
    margin-top: 0.1rem;
  }

  .takephoto {
    border-bottom: 1px solid #d7d7d7;
  }

  .certificate {
    font-size: 0.32rem;
    display: block;
    color: #333;
    box-sizing: border-box;
    margin: 0.2rem 0.3rem 0 0.3rem;
  }

  .certificate input {
    width: 0.34rem;
    height: 0.34rem;
    position: relative;
    top: 1px;
    margin-right: 0.05rem;
  }

  .certificate label {
    line-height: 0.42rem;
    display: inline-block;
    height: 0.42rem;
    background: url(../../images/openThirdPartyAccount/agree_icon_check.png) no-repeat left center;
    background-size: 0.4rem 0.4rem;
    padding-left: 0.5rem;
  }

  .certificate label.unchecked {
    background: url(../../images/openThirdPartyAccount/agree_icon_nocheck.png) no-repeat left center;
    background-size: 0.4rem 0.4rem;
  }

  .certificate a {
    color: #3a83d7;
    text-decoration: underline;
  }

</style>
