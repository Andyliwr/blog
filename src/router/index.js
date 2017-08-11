import Vue from 'vue'
import Router from 'vue-router'
// import MessageCheck from '@/components/page/MessageCheck'
// import SendPic from '@/components/page/SendPic'
// import UpdateClientInfo from '@/components/page/UpdateClientInfo'
// import UpdateOpenBranch from '@/components/page/UpdateOpenBranch'
// import ReqVideo from '@/components/page/ReqVideo'
// import CertInstall from '@/components/page/CertInstall'
// import TestPaper from '@/components/page/TestPaper'
// import TestPaperResult from '@/components/page/TestPaperResult'
// import AgreementSign from '@/components/page/AgreementSign'
// import SetPassword from "@/components/page/SetPassword"
// import OpenThirdPartyAccount from '@/components/page/OpenThirdPartyAccount'
// import OpenStockAccount from '@/components/page/OpenStockAccount'
// import RevisitPaper from '@/components/page/RevisitPaper'
// import OpenAccountResult from '@/components/page/OpenAccountResult'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/1',
      component:resolve=>{require.ensure(['../components/page/MessageCheck'],()=>{
        resolve(require('../components/page/MessageCheck'))
      })}
    },
    {
      path:'/sendpic/2',
      component:resolve=>{require.ensure(['../components/page/SendPic'],()=>{
        resolve(require('../components/page/SendPic'))
      })}
    },
    {
      path:'/updateclientinfo/3',
      component:resolve=>require(['../components/page/UpdateClientInfo'],resolve)
    },
    {
      path:'/updateopenbranch/4',
      component:resolve=>require(['../components/page/UpdateOpenBranch'],resolve)
    },
    {
      path:'/reqvideo/5',
      component:resolve=>require(['../components/page/ReqVideo'],resolve)
    },
    {
      path:'/certinstall/6',
      component:resolve=>require(['../components/page/CertInstall'],resolve)
    },
    {
      path:'/testpaper/7',
      component:resolve=>require(['../components/page/TestPaper'],resolve)
    },
    {
      path:'/testpaperresult/8',
      component:resolve=>require(['../components/page/TestPaperResult'],resolve)
    },
    {
      path:'/agreementsign/9',
      component:resolve=>require(['../components/page/AgreementSign'],resolve)
    },
    {
      path:'/setpassword/11',
      component:resolve=>require(['../components/page/SetPassword'],resolve)
    },
    {
      path:'/openstockaccount/10',
      component:resolve=>require(['../components/page/OpenStockAccount'],resolve)
    },
    {
      path:'/openthirdpartyaccount/12',
      component:resolve=>require(['../components/page/OpenThirdPartyAccount'],resolve)
    },
    {
      path:'/revisitpaper/13',
      component:resolve=>require(['../components/page/RevisitPaper'],resolve)
    },
    {
      path:'/openaccountresult/14',
      component:resolve=>require(['../components/page/OpenAccountResult'],resolve)
    },
    {
      path:'/revenue/15',
      component:resolve=>require(['../components/page/Revenue'],resolve)
    }
  ]
})
