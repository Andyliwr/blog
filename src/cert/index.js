import axios from 'axios'

import md5 from '../md5'
import tools from '../tools'
import config from '../config'
import qs from 'qs'

var cert = {
  zhongDengCertApplyState: function (other, page) {
    var self = this;
    axios.get(config.qsInterface + 'ZhongDengCertApplyState').then(function (response) {
      if (response.data.error_no == 0) {
        self.processArr[0] = true;
        self.createPkcs10(other, page);
      } else if (response.data.error_no == 1) {
        if (self.cert_apply_times < 3) {
          setTimeout(self.zhongDengCertApplyState, 2000);
        } else {
          other.is_show_indicator = false;
          other.alertbox.content = [response.data.error_info];
          other.alertbox.show = true;
          self.cert_apply_times = 0;
        }
        self.cert_apply_times++;
      } else {
        other.is_show_indicator = false;
        other.alertbox.content = [response.data.error_info];
        other.alertbox.show = true;
        if (page == 1) {
          other.install_step = 3;
        }
      }
    }).catch(function (error) {
      other.is_show_indicator = false;
      other.alertbox.content = ['网络异常，请重新检查您的网络！'];
      other.alertbox.show = true;
      if (page == 1) {
        other.install_step = 3;
      }
    });
  },
  zhongDengCert: function (pkcs10, other, page) {
    var self = this;
    var obj = qs.stringify({
      'pkcs10': pkcs10
    });
    axios.post(config.qsInterface + 'ZhongDengCert', obj).then(function (response) {
      if (response.data.error_no == 0) {
        self.processArr[2] = true;
        if (config.qsBackground == 'crh') {
          self.p7cert = response.data.csdc_p7cert;
        } else {
          self.p7cert = response.data.p7cert;
        }
        self.installCert(other, page);
      } else {
        other.is_show_indicator = false;
        other.alertbox.content = [response.data.error_info];
        other.alertbox.show = true;
        if (page == 1) {
          other.install_step = 3;
        }
      }
    }).catch(function (error) {
      other.is_show_indicator = false;
      other.alertbox.content = ['网络异常，请重新检查您的网络！'];
      other.alertbox.show = true;
      if (page == 1) {
        other.install_step = 3;
      }
    });
  },
  installCert: function (other, page) {
    var self = this;
    var userId = self.createUserId();
    callNativeHandler('khh5', {
      "action": "certInstall",
      "reqId": "certInstall",
      "param": {
        "p7cert": self.p7cert,
        "userId": userId
      }
    }, function (data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (page == 1) {
        self.zhongDengCertQuery(data.param.flag, other, page);
      }
      if (page == 2) {
        if(data.param.flag == 0){
          other.isCertInstall();
        }
        else{
          other.alertbox.content = ['证书安装失败'];
          other.alertbox.show = true;
          return;
        }
      }
    })
  },
  zhongDengCertQuery: function (flag, other, page) {
    var self = this;
    axios.get(config.qsInterface + 'ZhongDengCertQuery').then(function (response) {
      if (response.data.error_no == 0) {
        if (response.data.csdc_cert_status == 2 && flag == 0) {
          if (page == 1) {
            other.install_step = 2;
          }
          localStorage.setItem("zhongDengCertQuery", JSON.stringify(response.data));
        } else {
          if (page == 1) {
            other.install_step = 3;
          }
          if (page == 3) {
            other.is_show_indicator = false;
            other.alertbox.content = ['证书无效'];
            other.alertbox.show = true;
          }
        }
      } else {
        other.alertbox.content = [response.data.error_info];
        if (page == 1) {
          other.install_step = 3;
        }
      }
    }).catch(function (error) {
      other.is_show_indicator = false;
      other.alertbox.content = ['网络异常，请重新检查您的网络！'];
      other.alertbox.show = true;
      if (page == 1) {
        other.install_step = 3;
      }
    });
  },
  createPkcs10: function (other, page) {
    var self = this;
    var midServer = '';
    if (config.qsBackground == 'crh') {
      midServer = 2;
    } else {
      midServer = 1;
    }
    var userId = self.createUserId();
    callNativeHandler('khh5', {
      "action": "createPKCS10",
      "reqId": "createPKCS102",
      "param": {
        "midServer": midServer,
        "userId": userId
      }
    }, function (data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      self.pkcs10 = data.param.pkcs10;
      if (self.pkcs10) {
        self.processArr[1] = true;
        self.zhongDengCert(self.pkcs10, other, page);
      }
    });
  },
  createUserId: function () {
    var a = tools.getcookie("mobile_tel"),
      b = tools.getcookie("qsid"),
      c = tools.getcookie("client_id"),
      d = a + b + c;
    d = md5.hex_md5(d);
    return d;
  },
  p7cert: '',
  pkcs10: '',
  cert_apply_times: 0,
  processArr: [false, false, false]
}

export default cert;
