<template>
  <div class="reqvideo">
    <div class="reqvideo-content" v-if="!show_wait_page">
      <v-tip :content="tipcontent" style="padding:0.2rem 0.3rem;"></v-tip>
      <div class="img-box">
        <ul class="clearfix">
          <li><img src="../../images/reqVideo/sunShine.png" />
            <p>光线充足的位置</p>
          </li>
          <li><img src="../../images/reqVideo/roundQuiet.png" />
            <p>周边环境安静</p>
          </li>
          <li><img src="../../images/reqVideo/maskFace.png" />
            <p>视频录制时请<br/>显示全脸</p>
          </li>
          <li><img src="../../images/reqVideo/attestTime.png" />
            <p>视频认证时间</p>
            <span v-html="reqvideo_time"></span>
          </li>
        </ul>
      </div>
      <v-nextstep :text="nextstep.text" :next="nextstep.next" @goNext="allowNext"></v-nextstep>
    </div>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <div class="loadding-video" v-if="show_wait_page">
      <div><img src="../../images/reqVideo/video.png" /></div>
      <div><span>{{wait_text}}</span></div>
    </div>
  </div>
</template>
<script>
  import router from '../../router'
  import Inputbox from '../component/InputBox'
  import Tip from '../component/Tip'
  import Alertbox from '../component/AlertBox'
  import Nextstep from '../component/NextStep'
  import Mask from '../component/Mask'
  import bus from '../../bus'
  import config from '../../config'
  import tools from '../../tools'
  import axios from 'axios'
  

  export default {
    name: 'reqvideo',
    data() {
      return {
        title: '视频见证', //标题
        tipcontent: '接下来由我司工作人员与您进行简短的视频确认，请您做好以下准备', //提示语
        nextstep: {
          next: true,
          text: '我准备好了'
        },
        show_wait_page: false, //是否显示等待接入视频页
        req_video_url: '', //视频请求地址
        video_resource_url: '', //视频资源地址
        cancel_video_url: '',
        wait_num: '', //等待人数
        wait_text: '正在发起视频请求，请稍候...', //等待时显示的文案
        timer: '',
        alertbox: {
          content: [],
          show: false
        }
      }
    },
    components: {
      'v-inputbox': Inputbox,
      'v-tip': Tip,
      'v-nextstep': Nextstep,
      'v-alertbox': Alertbox,
      'v-mask': Mask
    },
    computed: {
      reqvideo_time() { //视频见证事件
        var kaihuTime = JSON.parse(localStorage.getItem("qsDetail")).qs_kaihu_time.replace(/ /g, '');
        return kaihuTime.indexOf("周一至周日") > -1 ? '周一至周日</br>' + kaihuTime.substr(5) : kaihuTime;
      }
    },
    methods: {
      closeAlertBox: function () { //关闭弹出框
        this.alertbox.show = false;
        if (this.alertbox.content[0] == '身份证上传有误，请重新上传照片！') {
          router.push('/sendpic/2');
        }
        if (this.alertbox.content[0] == '基本资料有误，请重新核对！') {
          router.push('/updateclientinfo/3')
        }
      },
      rejectionTreatment() {
        var self = this;
        axios.get(config.qsInterface + 'openaccountstate').then(function (response) {
          if (response.data.error_no == 0) {
            var status_arr = response.data.open_status.split("");
            if (status_arr[0] != 1) {
              self.alertbox.content = ['身份证上传有误，请重新上传照片！'];
              self.alertbox.show = true;
            } else if (status_arr[1] != 1) {
              self.alertbox.content = ['基本资料有误，请重新核对！'];
              self.alertbox.show = true;
            } else {
              self.alertbox.content = ['视频见证失败'];
              self.alertbox.show = true;
            }
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.alertbox.content = ['获取用户进度失败'];
          self.alertbox.show = true;
        });
      },
      allowNext: function () { //下一步按钮点击事件
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
            if (config.qsBackground == "crh") { //财人会
              self.getVideoUrl()
            } else { //思迪
              self.loginQueue();
            }
            self.show_wait_page = true;
          }
        });
      },
      getVideoUrl: function () { //财人会获取视频请求地址
        var self = this;
        axios.get(config.qsInterface + 'reqvideo', {
          params: {
            qsid: config.qsId
          }
        }).then(function (response) {
          self.req_video_url = response.data.reqVideo_url ? response.data.reqVideo_url : '';
          self.video_resource_url = response.data.videoResource_url ? response.data.videoResource_url : '';
          self.cancel_video_url = response.data.cancelVideo_url;
          self.reqVideoUrl();
        }).catch(function (error) {
          self.alertbox.content = ['获取视频请求地址失败！'];
          self.alertbox.show = true;
        });
      },
      reqVideoUrl: function () { //将视频地址传给后台
        var self = this;
        axios.get(config.qsInterface + 'requestagent', {
          params: {
            url: self.req_video_url
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            self.getVideoResource();
          }
        }).catch(function (error) {
          self.alertbox.content = ['发起视频见证请求失败！'];
          self.alertbox.show = true;
        });
      },
      getVideoResource: function () { //获取视频资源发起视频
        var self = this;
        axios.get(config.qsInterface + 'requestagent', {
          params: {
            url: self.video_resource_url
          }
        }).then(function (response) {
          if (response.data.error_no == 0) {
            if (config.qsId == '109') {
              self.wait_num = response.data.waitPosition;
            } else {
              if (response.data.waitPositionInSelfOrg) {
                self.wait_num = response.data.waitPositionInSelfOrg;
              } else if (response.data.waitPosition) {
                self.wait_num = response.data.waitPosition;
              } else {
                self.wait_num = response.data.waitNum;
              }
            }
            self.wait_text = '您前面还有' + self.wait_num + '人排队等候，请稍候...';
            if (response.data.status == 1) {
              callNativeHandler('khh5', {
                "action": "videoWitness",
                "reqId": "videoWitness",
                "param": {
                  "showTips": "0",
                  "loginName": response.data.userName,
                  "loginPwd": response.data.loginPwd,
                  "roomId": response.data.roomId,
                  "roomPwd": response.data.roomPwd,
                  "anychatIp": response.data.anyChatStreamIpOut,
                  "anychatPort": response.data.anyChatStreamPort
                }
              }, function (data) {
                if (typeof data == 'string') {
                  data = JSON.parse(data);
                }
                if (data.param.videoResult == 1) {
                  tools.stepSync('videoResult');
                  var nextlist = JSON.parse(localStorage.getItem('nextList'));
                  tools.nextpage = nextlist[nextlist.indexOf('reqVideo') + 1];
                  tools.afterBackToOpenAccountStep();
                } else {
                  self.rejectionTreatment();
                  self.show_wait_page = false;
                }
              })
            } else {
              self.timer = setTimeout(function () {
                self.getVideoResource();
              }, 3000);
            }
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.show_wait_page = false;
          }
        }).catch(function (error) {
          self.alertbox.content = ['获取视频见证资源失败！'];
          self.alertbox.show = true;
        })
      },
      loginQueue: function () { //思迪登录视频队列
        var self = this;
        axios.get(config.qsInterface + 'loginQueue').then(function (response) {
          if (response.data.error_no == 0) {
            self.queryQueue();
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.alertbox.content = ['登录视频队列失败！'];
          self.alertbox.show = true;
        })
      },
      queryQueue: function () { //接通视频
        var self = this;
        axios.get(config.qsInterface + 'queryQueue').then(function (response) {
          if (response.data.error_no == 0) {
            if (response.data.status == 1) {
              callNativeHandler('khh5', {
                "action": "videoWitness",
                "reqId": "videoWitness",
                "param": {
                  "showTips": '0',
                  "loginName": response.data.userName,
                  "roomName": response.data.roomName,
                  "roomPwd": "",
                  "anychatIp": response.data.anyChatStreamIpOut,
                  "anychatPort": response.data.anyChatStreamPort
                }
              }, function (data) {
                if (typeof data == 'string') {
                  data = JSON.parse(data);
                }
                if (data.param.videoResult == 1) {
                  tools.stepSync('videoResult');
                  var nextlist = JSON.parse(localStorage.getItem('nextList'));
                  tools.nextpage = nextlist[nextlist.indexOf('reqVideo') + 1];
                  tools.afterBackToOpenAccountStep();
                } else {
                  self.alertbox.content = ['视频见证失败'];
                  self.alertbox.show = true;
                  self.show_wait_page = false;
                }
              });
            } else {
              self.timer = setTimeout(function () {
                self.queryQueue();
              }, parseInt(response.data.waitMsec));
              self.wait_text = "您前面还有" + response.data.waitPosition + "人排队等候，请稍候...";
            }
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
            self.show_wait_page = false;
          }
        }).catch(function (error) {
          self.alertbox.content = ['查询队列失败！'];
          self.alertbox.show = true;
        });
      },
      cancelquery() {
        var self = this;
        clearTimeout(self.timer);
        if (config.qsBackground == 'sd') {
          axios.get(config.qsInterface + 'cancelqueue').then(function (response) {
            if (response.data.error_no == 0) {

            } else {
              self.alertbox.content = [response.data.error_info];
              self.alertbox.show = true;
            }
          }).catch(function () {
            self.alertbox.content = ['离开视频队列失败！'];
            self.alertbox.show = true;
          });
        } else {
          axios.get(config.qsInterface + 'requestagent', {
            params: {
              url: self.cancel_video_url
            }
          }).then(function (response) {
            if (response.data.error_no == 0) {
            } else {
              self.alertbox.content = [response.data.error_info];
              self.alertbox.show = true;
            }
          }).catch(function (error) {
            self.alertbox.content = ['离开视频队列失败！'];
            self.alertbox.show = true;
          });
        }
      }
    },
    created: function () {
      bus.$emit('titleName', this.title, 5, this);
    }
  }

</script>
<style>
  .reqvideo .img-box ul li {
    width: 50%;
    margin-top: 0.4rem;
    color: #333;
    float: left;
    text-align: center;
    font-size: 0.32rem;
  }

  .reqvideo .img-box ul li img {
    height: 1rem;
  }

  .reqvideo .img-box ul li p {
    margin-top: 0.3rem;
  }

  .reqvideo .img-box ul li p.liSpan {
    margin-top: 0;
  }

  .loadding-video {
    width: 100%;
    text-align: center;
    margin-top: 3.46rem;
    color: #333;
    font-size: 0.32rem;
  }

  .loadding-video div {
    margin-top: 0.45rem;
  }

  .loadding-video div img {
    height: 1rem;
  }

</style>
