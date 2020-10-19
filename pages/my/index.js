const app = getApp()
const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')
import jwtDecode from '../../miniprogram_npm/jwt-decode/index.js';
const config = require('../../utils/config');
const loginUrl = config.loginUrl;
import request from '../../utils/request.js';


Page({
	data: {
    wxlogin: true,
    myMessage:0,
    myPark:0,
    mobile:null,
    apiUserInfoMap:{}
  },
	onLoad() {
	},	
  onShow() {
    const _this = this
    // const order_hx_uids = wx.getStorageSync('order_hx_uids')
    // this.setData({
    //   version: CONFIG.version,
    //   vipLevel: app.globalData.vipLevel,
    //   order_hx_uids
    // })
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      }) 
      if(isLogined){
        _this.getUserApiInfo();
        _this.getMobile();
      }else{
        AUTH.clearToken();
        _this.setData({
          mobile:null,
          apiUserInfoMap:{}
        })
      }  
    //  _this.getCount();
    })
  },
  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '祝大家使用愉快！',
      showCancel:false
    })
  },
  loginOut(){
    AUTH.loginOut()
    wx.reLaunch({
      url: loginUrl
    })
  },
  getUserApiInfo: function () {
    let _data = {}
    var that = this;
    const token = wx.getStorageSync('token')
    if (token){
      const userInfo = jwtDecode(token).userInfo;
      _data.apiUserInfoMap = userInfo;
      that.setData(_data);
    }else{
      _data.apiUserInfoMap = {};
      that.setData(_data);
    }
  },
  goAsset: function () {
    wx.navigateTo({
      url: "/pages/asset/index"
    })
  },
  goScore: function () {
    wx.navigateTo({
      url: "/pages/score/index"
    })
  },
  goMyCar: function (e) {
    wx.navigateTo({
      url: "/pages/my-park/index?type=" + e.currentTarget.dataset.type
    })
  },
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  goLogin() {
    this.setData({
      wxlogin: false
    })
  },
  processLogin(e) {
    AUTH.register(this);
  },
  getCount() {
    AUTH.checkHasLogined().then(data => {
      if (data) {
        request(null, '/wx/v1/my/count', null, 'GET').then(data => {
          if(data){
            if (data.result == 'ok') {
              this.setData({
                myMessage: data.data.myMessage,
                myPark: data.data.myPark,
              })

            }
          }
          
        })
      }
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    const data={
      encryptedData:e.detail.encryptedData,
      iv:e.detail.iv
    }
      request(null,'/sap/v1/user/mobile',data,'PUT').then(data =>{
        if(data && data.result == 'ok'){
          console.log(data.data.mobile);
          this.setData({
            mobile:data.data.mobile
          })
        }else{
          wx.showModal({
            title: '提示',
            content:'手机绑定失败!',
            showCancel: false
          })
        }
      })
  },
  getMobile(){
    request(null,'/sap/v1/user/mobile',null,'GET').then(data =>{
      if(data && data.result == 'ok' ){
        if(data.data){
          this.setData({
            mobile:data.data.mobile
          })
        }
      }
    })
  }
  
})