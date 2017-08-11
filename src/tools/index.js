import config from '../config'
import axios from 'axios'

import router from '../router'
var tools = {
  getcookie: function (a) {
    var b = a + "=",
      c = document.cookie.indexOf(b);
    if (-1 == c) return null;
    var d = document.cookie.indexOf(";", c + b.length);
    return -1 == d && (d = document.cookie.length),
      unescape(document.cookie.substring(c + b.length, d))
  },
  setCookie: function (c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
  },
  deletecookie: function (a, b, c) {
    this.getcookie(a) && (document.cookie = a + "=" + (b ? "; path=" + b : "") + (c ? "; domain=" + c : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT")
  },
  clearcookie: function () {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    if (cookies.length > 0) {
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        var domain = location.host.substr(location.host.indexOf('.'));
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + domain;
      }
    }
  },
  clearUserlessCookie: function () {
    var cookies = document.cookie.split(";");
    var thisCount = cookies.length;
    for (var i = 0; i < thisCount; i++) {
      if (cookies[i].split("=")[0] == 'escapename' || cookies[i].split("=")[0] == 'userid' || cookies[i].split("=")[0] == 'deviceid') {
        continue;
      } else {
        var domain = location.host.substr(location.host.indexOf('.'));
        this.deletecookie(cookies[i].split("=")[0], '/', domain);
      }
    }
  },
  stepSync: function (a) {
    var b = this.getcookie("client_id"),
      c = localStorage.getItem("recognizeId") || "";
    callNativeHandler('khh5', {
      "action": "stepSync",
      "reqId": "stepSync",
      "param": {
        "clientId": b,
        "step": a,
        "recognizeId": c
      }
    }, function (data) {});
  },
  exitKaihu: function () {
    callNativeHandler('khh5', {
      "action": "exitKaihu",
      "reqId": "exitKaihu",
      "param": {}
    }, function (data) {});
  },
  afterBackToOpenAccountStep: function () {
    switch (this.nextpage) {
      case 'Sendpic':
        router.push('/sendpic/2');
        break;
      case "updateClientInfo":
        router.push('/updateclientinfo/3');
        break;
      case "updateOpenBranch":
        router.push('/updateopenbranch/4');
        break;
      case "reqVideo":
        router.push('/reqvideo/5');
        break;
      case "certinstall":
        router.push('/certinstall/6');
        break;
      case "Testpaper":
        router.push('/testpaper/7');
        break;
      case "AgreementSign":
        router.push('/agreementsign/9');
        break;
      case "setPassword":
        router.push('/setpassword/11');
        break;
      case "openStockAccount":
        router.push('/openstockaccount/10')
        break;
      case "openThirdPartyAccount":
        router.push('/openthirdpartyaccount/12');
        break;
      case "Revisitpaper":
        router.push('/revisitpaper/13');
        break;
      case "OpenAccountResult":
        router.push('/openaccountresult/14');
        break;
    }
  },
  nextpage: ''
}

export default tools;