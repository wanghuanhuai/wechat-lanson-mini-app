const { default: request } = require("../../utils/request");

// pages/code/super-code.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     soketId:null,
     isConnect:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const soketId= options.soketId;
      this.setData({
        soketId:soketId
      })
      this.initConnectSoket();

      console.log(this.data.isConnect);
  },

  initConnectSoket(){
    const soketId=this.data.soketId;
    const data={
      id:soketId,
      message:'connect success！'
    }
    request(null,'/sap/v1/ws/send/one', data, 'GET').then(data => {
        if(data){
          if(data.result && data.result == 'ok'){
            this.setData({
              isConnect:true
            })
           // this.data.isConnect =true
          }else{
            wx.showToast({
              title: '连接桌面应用失败,请返回主页重新扫描二维码。',
              icon: 'none'
            })
          }
        }else{
          wx.showToast({
            title: '连接桌面应用失败,请返回主页重新扫描二维码。',
            icon: 'none'
          })
        }
    })
  },
  barScan(){
    var _this=this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {
        const codeMsg= res.result;
        const soketId=_this.data.soketId;
        const requestData={
            id:soketId,
            message:codeMsg
          }
          console.log(requestData)
        request(null,"/sap/v1/ws/send/one",requestData,'GET').then(data=>{
            // console.log(data);
            if(data && data.result == 'ok'){
            }else{
              this.setData({
                isConnect:false
              })
              wx.showToast({
                title: '连接桌面应用失败,请返回主页重新扫描二维码。',
                icon: 'none'
              })
            }
        })
      },
       fail: function (res) {
             wx.showToast({
              title: '扫描失败,请重新尝试',
              icon: 'none'
            })
           },
    })
  }

})