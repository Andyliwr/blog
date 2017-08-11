import config from '../config'
import cert from '../cert'
import axios from 'axios'

import router from '../router'
import tools from '../tools'

var agreement = {
  getSignCert: function (agreement, id, other, page) {
    var md5 = agreement.econtract_md5;
    var userId = cert.createUserId();
    var self = this;
    if (config.qsId != '109') {
      callNativeHandler('khh5', {
        "action": "signCert",
        "reqId": 'signCert' + id,
        "param": {
          "md5": md5,
          "userId": userId
        }
      }, function (data) {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        if (data.param.flag == 0) {
          self.agreementSign(other.agreement_list[id], id, data.param.certSign, other, page);
        } else {
          other.is_show_indicator = false;
          other.alertbox.content = ['签名失败'];
          other.alertbox.show = true;
        }
      });
    }
    else{
      //只签署当前协议--告知函
      if(page === 4){
        self.agreementSign(agreement, id, 'NOSN', other, page);
      }else{
        self.agreementSign(other.agreement_list[id], id, 'NOSN', other, page);
      }
    }

  },
  agreementSign: function (agreementList, index, certSign, other, page) {
    // var certSn = certSign?(JSON.parse(localStorage.getItem("zhongDengCertQuery")).csdc_cert_sn) : '';
    var obj = {
      econtract_id: agreementList.econtract_id, //电子合同ID
      econtract_name: agreementList.econtract_name, //电子合同名称
      econtract_md5: agreementList.econtract_md5, //电子合同MD5值
      plain_text: agreementList.econtract_md5, //电子合同MD5值
      cert_sign: certSign, //数字签名（协议签名接口获得,和本地证书相关）
      cert_sn: '', //证书序列号(唯一的通过安装数字证书得到)
      summary: "", //签名摘要信息（建行、农行必填）
      biz_id: "1" //业务标记(1:开户 3：转户 5：简易开户 6：三方存管 7：经纪人 21：中登证书 22：自建证书)
    };
    var self = this;
    axios.get(config.qsInterface + 'AgreementSign', {
      params: obj
    }).then(function (response) {
      if (response.data.error_no == 0) {
        // 签署告知函协议不执行
        if(page !== 4){
          other.is_agreement_success[index] = true;
          for (var i = 0; i < other.is_agreement_success.length; i++) {
            if (!other.is_agreement_success[i]) {
              return;
            }
          }
        }
        if (page == 2) {
           other.is_show_indicator = false;
           tools.stepSync('AgreementSign');
           var nextlist = JSON.parse(localStorage.getItem('nextList'));
           tools.nextpage = nextlist[nextlist.indexOf('AgreementSign')+1];
           tools.afterBackToOpenAccountStep();  
        }
        // 如果是风险测评结果页，在签署完协议之后，调用上传签署结果的方法
        if (page == 4) {
          other.uploadTestPaperResult();
        }
        if(page == 3){
          other.openThirdPartyAccount();
        }
      } else {
        other.is_agreement_success[index] = false;
        other.is_show_indicator = false;
        other.alertbox.content = [response.data.error_info];
        other.alertbox.show = true;
        return;
      }
    }).catch(function (error) {
      console.log(error);
      other.is_show_indicator = false;
      other.alertbox.content = ['签署协议失败！'];
      other.alertbox.show = true;
      return;
    })
  }
}

export default agreement;
