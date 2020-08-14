const { default: request } = require("../../../../utils/request");

// pages/sap/mater/stock/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materName:'',
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var materName = options.materName;
   // console.log(materName);
    this.setData({
      materName:materName
     //materName:'1MF170178C01'
    })
    this.loadData();
  },
  loadData(){
    const materName=this.data.materName;
    if(materName){
      // 获取数据
      wx.showLoading({
        title: '加载中',
      })
      request(null,'/sap/v1/mater/stock/'+materName, null, 'GET').then(data => {
          if(data.result){
              this.setData({
                list:data.data
            }); 
          }else{
            wx.showToast({
              title:data,
              icon:'none'
            })
          }
      });
    }
   
  },
  materScan(){
    var _this=this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {
        const materName= res.result;
        _this.setData({
          // materName:materName
          materName:materName
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
  }

})