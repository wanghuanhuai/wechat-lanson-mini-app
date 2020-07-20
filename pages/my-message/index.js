// pages/message/index.js
const AUTH = require('../../utils/auth')
const config = require('../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
import request from '../../utils/request.js';
const loginUrl = config.loginUrl;
import jwtDecode from '../../miniprogram_npm/jwt-decode/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    msgList: [],
    loading: true,  //是否正在加载
    active: 0,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getData();
    this.getUserApiInfo();
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
          msgList: [],
        });
        this.getData();
      }
    });
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
    this.setData({
      pageNum: 1,
      msgList: [],
    });
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.msgList.length == this.data.total) {
      wx.showToast({
        title: '没有更多数据',
      })
      return;
    }
    this.data.pageNum += 1;
    this.getData();
  },
  // 页面刷新获取数据
  getData: function (e) {
    // 获取数据
    wx.showLoading({
      title: '加载中',
    })
    const _data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      isMy: 'my',
    }
    request(null, '/wx/v1/message/page', _data, 'GET').then(data => {
      if (data) {
        var list = this.data.msgList;
        list.push(...data.data)
        let pageInfo = data.cursor;
        const total = pageInfo.total;
        this.setData({
          msgList: list,
          total: total,
          loading: false
        })
      }
    })
  },
  //删除
  delete: function (e) {
    var that = this;
    const _data = {
      isDelete: true,
    }
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success(res) {
        if (res.confirm) {
          const id = e.currentTarget.dataset.msgid;
          request(null, '/wx/v1/message/' + id, _data, "DELETE").then(data => {
            if (data) {
              if (data.result == 'ok') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
                var msgList = that.data.msgList;
                msgList.splice(index, 1);
                that.setData({
                  msgList: msgList
                });
                // this.data.msgList.
              } else if (data.result == 'not_ok') {
                wx.showToast({
                  title: data.errors[0].message,
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '服务器连接失败，请稍后在尝试!',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    });

  },
  getUserApiInfo: function () {
    let _data = {}
    var that = this;
    const token = wx.getStorageSync('token')
    if (token) {
      const userInfo = jwtDecode(token).userInfo;
      _data.apiUserInfoMap = userInfo;
      that.setData(_data);
    } else {
      _data.apiUserInfoMap = {};
      that.setData(_data);
    }
  },
  modify: function (e) {
    const id = e.currentTarget.dataset.msgid;
    const messageValue = e.currentTarget.dataset.msgvalue;
    const nickName = e.currentTarget.dataset.nickname;
    const index = e.currentTarget.dataset.index;

    this.setData({
      messageValue: messageValue,
      nickName: nickName,
      msgId: id,
      index: index,
      showMessage: true
    });
  },
  onClose() {
    this.setData({ showMessage: false });
  },
  onConfirm(e) {
    // 搜索商品
    wx.showLoading({
      title: '提交留言中...',
    })
    const index =this.data.index;
    console.log(index);
    const _data = {
      message: e.detail.value.message,
    }
    request(null, '/wx/v1/message/' + this.data.msgId, _data, "PUT").then(data => {
      // console.log(data);
      if (data) {
        if (data.result == 'ok') {
          wx.showToast({
            title: data.success,
            icon: 'none'
          })
          var changeMessage = "msgList[" + index+"].message";
          this.setData({
            [changeMessage]: e.detail.value.message,// 
          })
        } else if (data.result == 'not_ok') {
          wx.showToast({
            title: data.errors[0].message,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '服务器连接失败，请稍后在尝试!',
            icon: 'none'
          })
        }
      }
    }).finally(() => {
      wx.hideLoading();
      this.setData({ showMessage: false });
    });

  },

})