const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth.js')
const config = require('../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
import request from '../../utils/request.js';

//获取应用实例
var app = getApp()
Page({
  data: {
    loadingHidden: false, // loading
    parkCount:0,
    myMessageCount:0,
    //开发
    // imageList:[{
    //   imageId:'5ea25200231721299ccd5ac6',
    //   imageMaxId:'5ea2525f231721299ccd5acb'
    // },{
    //   imageId: '5ea2526d231721299ccd5ada',
    //   imageMaxId: '5ea2527a231721299ccd5ae0',
    // }],
    //正式
    imageList: [{
      imageId: 'company.png',
      imageMaxId: 'company.jpg'
      }
    ],
    imageUrl: baseUrl + '/sapSerive/static/image/',
  },
  tapBanner: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  adClick: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onShow: function () {
     // this.getCount();
  },
  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true
    })    
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onReachBottom: function() {
  },
  onPullDownRefresh: function() {
    //this.getCount();

  },
  bindinput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail.value
    })
    // wx.navigateTo({
    //   url: '/pages/park/list?searchName=' + this.data.inputVal,
    // })
  },
  goSearch() {
    // wx.navigateTo({
    //   url: '/pages/park/list?searchName=' + this.data.inputVal,
    // })
  },
  getCount(){
    AUTH.checkHasLogined().then(data => {
      if (data){
        request(null, '/wx/v1/index/count', null, 'GET').then(data=>{
          if(data){
            if (data.result == 'ok') {
              this.setData({
                parkCount: data.data.parkCount,
                myMessageCount: data.data.myMessageCount,
              })

            }
          }
        })
      }
    })

  },
  onNotice(e){
    wx.navigateTo({
      url: '../notice/show',
    })
  },
  codeSearch(){
    var _this = this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {
       // console.log(res);    //输出回调信息
        //console.log(fileList);
        // _this.setData({
        //   qRCodeMsg: res.result
        // });

        if( res.result){
          wx.showLoading({
            title: '数据加载中！',
          });
          const codeMsg= res.result;
             //下载并打开文件
        wx.downloadFile({
          // url: baseUrl +"/sap/mater/"+res.result,
         //  url: baseUrl +"/sap/v1/mater/1AF130928A01", //真机测试用的
           url: baseUrl +"/sap/v1/mater/"+codeMsg, //真机测试用的
           success: function (res) {
            console.log(res)
             if(res.statusCode == '200'){
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
             }else{
              wx.showToast({
                title: '查询失败或者物料不存在:'+codeMsg,
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
       },
      fail: function(err){
        console.log(err)
        wx.showToast({
          title: '扫描失败,条形码错误',
          icon: 'none'
        })
      }
    })
  },
  materStockSearch(){

    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {
        const codeMsg= res.result;
        wx.navigateTo({
          url: '/pages/sap/mater/stock/list?materName='+codeMsg,
        })
      },
       fail: function (res) {
             wx.showToast({
              title: '扫描失败,请重新尝试',
              icon: 'none'
            })
           },
    })
 
  },
  //光学采购单
  GXPOSearch(){
    var _this = this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {

        if( res.result){
          wx.showLoading({
            title: '数据加载中！',
          });
          const codeMsg= res.result;
             //下载并打开文件
        wx.downloadFile({
          // url: baseUrl +"/sap/mater/"+res.result,
          // url: baseUrl +"/sap/v1/order/gx/"+res.result, //真机测试用的
          url: baseUrl +"/sap/v1/order/gx/"+res.result,
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
                title: '查询失败:'+codeMsg,
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
       },
      fail: function(err){
        console.log(err)
        wx.showToast({
          title: '扫描失败,条形码错误',
          icon: 'none'
        })
      }
    })
  },
  LHPOSearch(){
    var _this = this;
    wx.scanCode({
      scanType: ['barCode'],        //扫描API
      success: function (res) {

        if( res.result){
          wx.showLoading({
            title: '数据加载中！',
          });
          const codeMsg= res.result;
             //下载并打开文件
        wx.downloadFile({
          // url: baseUrl +"/sap/mater/"+res.result,
          // url: baseUrl +"/sap/v1/order/lh/7000044586", //真机测试用的
          url: baseUrl +"/sap/v1/order/lh/"+res.result,
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
                title: '查询失败:'+codeMsg,
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
       },
      fail: function(err){
        console.log(err)
        wx.showToast({
          title: '扫描失败,条形码错误',
          icon: 'none'
        })
      }
    })
  }
})