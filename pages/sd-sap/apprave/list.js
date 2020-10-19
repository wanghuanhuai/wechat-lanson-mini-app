const { default: request } = require("../../../utils/request")
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const config = require('../../../utils/config')
const AUTH = require('../../../utils/auth')
const loginUrl = config.loginUrl;
// pages/sd-sap/apprave/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[],
     appraveStatus: 'A',
     searchValue:'',
     active:"0",
     pageNum: 1,
     pageSize: 10,
     total:0,
     steps: [
      {
        text: '业务主管',

      },
      {
        text: '业务总监',
      },
      {
        text: '财务审核',
      },
      {
        text: '总经理',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    AUTH.checkHasLogined().then(isLogin => {
      //未登录
      if (!isLogin) {
        //返回登录页
        wx.switchTab({
          url: loginUrl,
        })
      }
      if (isLogin) {
        this.setData({
          pageNum: 1,
          list: [],
        });
        this.loadData();
      }
    });
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
    wx.showToast({
      title: '没有更多数据',
    })
    return;
    // if (this.data.list.length >= this.data.total) {
    //   wx.showToast({
    //     title: '没有更多数据',
    //   })
    //   return;
    // }
   // this.data.pageNum += 1;
   // this.loadData();
  },
  loadData(){
    wx.showLoading({
      title: '加载数据中....',
    })
    const data={
    //  pageNum: this.data.pageNum,
    //  pageSize: this.data.pageSize,
      appraveStatus:this.data.appraveStatus,
      itemNo:this.data.searchValue
    }
    console.log(data);
    request(null,'/sap/v1/sd/apprave', data, 'GET').then(data =>{
      if(data && data.result == 'ok'){
        var list = this.data.list;
        if(data.data.list !== null){
          list = list.concat(data.data.list)
        }
       // list.push(data.data.list)
        this.setData({
          list:list,
        })
        if(this.data.appraveStatus == 'A'){
           this.setData({
            total:data.data.total
           })
        }
      }else if(data && data.result == 'not_ok'){
        Toast.fail(data.errors[0].message);

        // wx.showToast({
        //   title: data.errors[0].message,
        //   icon: 'none',
        // })
      }else{
        this.setData({
          list:[]
        })
      }
    })
  },

  apprave(e) {
    var vbeln =e.currentTarget.dataset.vbeln;
    var level =e.currentTarget.dataset.level;
    var index = e.currentTarget.dataset.indexdel;

    const requestUrl="/sap/v1/sd/apprave/appraveStatus/A/orderNo/"+vbeln+"/level/"+level;
    var list = this.data.list;                     //获取内容列表
    var _this = this;
    console.log(index);
    wx.showModal({
      title: '审核提醒',
      content: '确认同意销售订单?',
      success(res) {
        if (res.confirm) {
          request(null,requestUrl, null, 'GET').then(data =>{
            console.log(data)
              if(data && data.result == 'ok' && data.data == '1'){
                list.splice(index, 1);       //截取指定的内容
                _this.setData({               //重新渲染列表
                    list:list
                 })
               //  _this.loadData();
                 wx.showToast({
                   title: '审核成功',
                 })
              }else{
                wx.showToast({
                  icon: 'none',
                  title: '审核失败,请重新尝试',
                })
              }
          })
        }
      }
    })
  },
  back(e) {

    var vbeln =e.currentTarget.dataset.vbeln;
    var level =e.currentTarget.dataset.level;
    var index = e.currentTarget.dataset.indexdel;

    const requestUrl="/sap/v1/sd/apprave/appraveStatus/C/orderNo/"+vbeln+"/level/"+level;
    var _this=this;
    var list = this.data.list;                     //获取内容列表
    wx.showModal({
      title: '取消提醒',
      content: '确认取消销售订单审批?',
      success(res) {
        if (res.confirm) {
          request(null,requestUrl, null, 'GET').then(data =>{
            console.log(data)
              if(data && data.result == 'ok' && data.data == '1'){
                list.splice(index, 1);       //截取指定的内容
                _this.setData({               //重新渲染列表
                    list:list
                 })
                 wx.showToast({
                   icon:'success',
                   title: '取消成功',
                 })
              }else{
                wx.showToast({
                  icon: 'none',
                  title: '取消失败,请重新尝试',
                })
              }
          })
        }
      }
    })
  },
  onChangeTab(event) {
    // console.log(event.detail.name);
    if (event.detail.name == 0) {
      this.setData({
        list: [],
        appraveStatus: 'A',
      });
    } else if (event.detail.name == 1){
      this.setData({
        list: [],
        appraveStatus: 'C',
      });
    } 
    this.setData({
      active: event.detail.name
    });
    this.loadData();
  },

  onChange(e) {
    this.setData({
      searchValue: e.detail,
    });
  },
  onSearch() {
    this.setData({
      list:[],
    })
    this.loadData();

  },
  onClick() {
    this.setData({
      list:[],
    })
    this.loadData();

  },
})