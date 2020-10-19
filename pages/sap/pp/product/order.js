const { default: request } = require("../../../../utils/request");


// pages/sap/pp/product/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confNo:"",
    gmnga:null,
    xmnga:null,
    rmnga:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  loadData(){
    const confNo=this.data.confNo;
   //const confNo=66282;
      // 获取数据
      wx.showLoading({
        title: '加载中',
      })
      request(null,'/sap/v1/pp/prod/'+confNo, null, 'GET').then(data => {
          if(data && data.result == 'ok'){
           //  console.log(data.data);
             this.setData({
              proOrderConf:data.data
             })
          }else{
            this.setData({
              proOrderConf:{}
            })
            if(data.result == 'not_ok'){
              wx.showToast({
                title:data.errors[0].message,
                icon:'none'
              })
            }
            
          }
      });
    },
  barScan(){
    var _this=this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {
        const confNo= res.result;
        _this.setData({
          confNo:confNo
         })
         _this.loadData();
      },
       fail: function (res) {
             wx.showToast({
              title: '扫描失败,请重新尝试',
              icon: 'none'
            })
           },
    })
  },
  onSubmit(){
    var _this =this;
    wx.showModal({
      title: '报工提醒',
      content: '是否确认报工?',
      success(res) {
        if (res.confirm) {
          const data={
            confNo:_this.data.proOrderConf.rueck,
            gmnga:_this.data.gmnga,
            xmnga:_this.data.xmnga,
            rmnga:_this.data.rmnga,
          }
          console.log(data);
          request(null,'/sap/v1/pp/prod', data, 'POST').then(data =>{
            console.log(data)
              if(data && data.result == 'ok'){
               //  _this.loadData();
                 wx.showToast({
                   title: '报工成功',
                 })
              }else{
                if(data){
                  wx.showModal({
                    title: '错误提示',
                    content: data.errors[0].message,
                    showCancel: false,//是否显示取消按钮
                    cancelText:"否",//默认是“取消”
                 })
                }else{
                  wx.showToast({
                    icon: 'none',
                    title: '报工失败,请重新尝试',
                  })
                }
                
              }
          })
        }
      }
    })
  }

  
})