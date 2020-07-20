// pages/be-continued/index.js
const config = require('../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc:"后续开发",
    sapImageUrl:"",
    fileList: [
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getQRCode: function () {
    var _this = this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {
        console.log(res);    //输出回调信息
        //console.log(fileList);
        _this.setData({
          qRCodeMsg: res.result
        });

        if( res.result){
          wx.showLoading({
            title: '数据加载中！',
          });
             //下载并打开文件
        wx.downloadFile({
           url: baseUrl +"/sap/excel/downloadFailedUsingJson",
           //url: "https://dl.glzy8.com:9000/upfiles/key/2018/0503/t6.xlsx", //真机测试用的
           success: function (res) {
             console.log(res)
             var filePath = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
             // console.log(postf1)
             if (filePath != null) {
               wx.openDocument({
                 filePath: filePath,
                 fileType: 'xlsx',
                 success: function (res) {
                   console.log(res)
                 },
                 fail: function (res) {
                   console.log(res);
                 },
                 complete:function(){
                  wx.hideLoading();
                }
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
     
     

      // request(null, '/sap/test/sap', null, 'GET').then(data =>{
      //   console.log(data);
      //   _this.setData({
      //     desc: data,
      //     sapImageUrl: baseUrl +"/sap/test/image",
      //      fileList: [
      //       {
      //          url: baseUrl + "/sap/test/image",
      //         name: '图片2',
      //         isImage: true,
      //       },
      //     ],
      //   })
      //   wx.showToast({
      //     title: data,
      //     duration: 2000
      //   })
      //   })
        
       },
      fail: function(){
        wx.showToast({
          title: '扫描失败,条形码错误',
          icon: 'none'
        })
      }
    })
  },
  //预览单个图片
  previewImage: function (e) {
    let that = this;
   // let src = that.data.sapImageUrl;
    let src ="https://img.yzcdn.cn/vant/leaf.jpg"
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // =============重点重点=============
    })
  },



  
})