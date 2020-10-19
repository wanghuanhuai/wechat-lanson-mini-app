// pages/sap/po/gxpo.js
const config = require('../../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    type:'code',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    console.log(type);
    this.setData({
      type:type
    })
  },

  onChange(event) {
    // event.detail 为当前输入的值
    this.setData({
      value:event.detail
    });
  },


  poSearch(){
      wx.showLoading({
        title: '数据加载中！',
      });
      const poName= this.data.value;
      const type =  this.data.type;
      var url='';
      if(type == 'gx'){
        url="/sap/v1/order/gx/";
      }
      if(type == 'lh'){
        url="/sap/v1/order/lh/";
      }
         //下载并打开文件
    wx.downloadFile({
      // url: baseUrl +"/sap/mater/"+res.result,
      // url: baseUrl +"/sap/v1/order/gx/"+res.result, //真机测试用的
      url: baseUrl +url+poName,
       success: function (res) {
         if(res.statusCode == '200'){
          var filePath = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
          // console.log(postf1)
          if (filePath != null) {
            wx.openDocument({
              filePath: filePath,
              fileType: 'xlsx',
              success: function (res) {
              },
              fail: function (res) {
              },
              complete:function(){
               wx.hideLoading();
             }
            })
          }
         }else{
          wx.showToast({
            title: '查询失败:'+poName,
            icon: 'none'
          })
         }
       },
       fail: function (res) {
         console.log(res)
         wx.showToast({
          title: '打开失败,请重新尝试',
          icon: 'none'
        })
       },
     })
       
  }


})