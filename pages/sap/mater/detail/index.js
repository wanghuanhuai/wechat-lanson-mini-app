const { default: request } = require("../../../../utils/request");

// pages/sap/mater/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mater:{},
    materName:'',
    type:'code',
    value: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var materName = options.materName;
    var type = options.type;
    console.log(type);
    this.setData({
      materName:materName,
      type:type
    })
    this.loadData();
  },
  loadData(){
    const materName=this.data.materName;
    if(materName){
      wx.setNavigationBarTitle({
        title: materName,
      })
      // 获取数据
      wx.showLoading({
        title: '加载中',
      })
      request(null,'/sap/v1/mater/'+materName, null, 'GET').then(data => {
          if(data.result){
           //  console.log(data.data);
             this.setData({
               mater:data.data
             })
          }else{
            this.setData({
              mater:{}
            })
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
  },
  onChange(e) {
    this.setData({
      value: e.detail.toUpperCase(),
    });
  },
  onSearch() {
    console.log('search');
    this.setData({
      // materName:materName
      materName:this.data.value
     })
     this.loadData();
  },
  onClick() {
    console.log('click');
    this.setData({
      // materName:materName
      materName:this.data.value
     })
     this.loadData();
  },
  
})