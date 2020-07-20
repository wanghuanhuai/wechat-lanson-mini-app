const app = getApp()
const AUTH = require('../../utils/auth')
import request from '../../utils/request.js';
const config = require('../../utils/config');
const baseUrl = config.baseUrl;    //基准路径
const imageUrl = config.imageUrl;    //基准路径
const defalutImage = config.defalutImage;    //基准路径
const loginUrl = config.loginUrl;


Page({
  data: {
    active: 0,
    loading:false,
    imageUrl: imageUrl,
    defalutImage: defalutImage,
    rentStatus: 'all',
    badges: [0, 0, 0, 0],
  },
  changeStatus: function (e) {
    const that = this;
    const toStatus=e.currentTarget.dataset.toStatus;
    const id = e.currentTarget.dataset.id;
    var titile = "确定要取消出租吗？";
    if (toStatus == 'N'){
      titile = "确定标记为已出租吗？";
    } else if (toStatus == 'Y'){
      titile = "确定继续出租吗？";
    }
    const _data = {
      rentStatus: toStatus,
    }
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      title: titile,
      content: '',
      success: function (res) {
        if (res.confirm) {
          request(null, '/wx/v1/rentInfo/'+id, _data,'PUT').then(data => {
            if (data) {
              if (data.result == 'ok') {
                wx.showToast({
                  title: '操作成功',
                  icon: 'none'
                })
                var list = that.data.list;
                var badges = that.data.badges;
                const active = that.data.active;
                badges[active] = badges[active] -1;
                list.splice(index, 1);
                that.setData({
                  list: list,
                  badges: badges,
                });
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
    })
  },
  onLoad: function (options) {
    if (options && options.type) {
      if (options.type == 0) {
        this.setData({
          rentStatus: 'all',
        });
      } else if (options.type == 1) {
        this.setData({
          rentStatus: 'Y',
        });
      } else if (options.type == 2) {
        this.setData({
          rentStatus: 'N',
        });
      } else if (options.type == 3) {
        this.setData({
          rentStatus: 'D',
        });
      }
      this.setData({
        active: options.type
      });
    }

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getCarStatistics() {
    request(null, '/wx/v1/rentInfo/count', null, 'GET').then(data =>{
        if(data){
          const badges = this.data.badges;
         // badges[0] = res.data.allCount
          badges[1] = data.data.statusYCount
          badges[2] = data.data.statusNCount
          badges[3] = data.data.statusDCount
          this.setData({
            badges
          })
        }
    })
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogin => {
      //未登录
      if (!isLogin) {
        //返回登录页
        wx.switchTab({
          url: loginUrl,
        })
      }
      if (isLogin){
        this.doneShow();
      }
    });

  },
  doneShow() {
    this.setData({
      loading:true,
    })
   
    // 获取 我的车位列表
    var that = this;
    this.getCarStatistics();
    const _data={
      rentStatus: this.data.rentStatus
    }
    request(null, '/wx/v1/rentInfo/userId', _data, 'GET').then(data => {
      if (data) {
        var list = data.data;
        const total = data.cursor.total;
        this.setData({
          list: list,
        })
      }
    }).finally(function () {
      that.setData({
        loading: false,
      })
    });
  },
  onChangeTab(event) {
    // console.log(event.detail.name);
    if (event.detail.name == 0) {
      this.setData({
        list: [],
        rentStatus: 'all',
      });
    } else if (event.detail.name == 1){
      this.setData({
        list: [],
        rentStatus: 'Y',
      });
    } else if (event.detail.name == 2) {
      this.setData({
        list: [],
        rentStatus: 'N',
      });
    } else if (event.detail.name == 3) {
      this.setData({
        list: [],
        rentStatus: 'D',
      });
    }
    this.setData({
      active: event.detail.name
    });
    this.doneShow();
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    this.doneShow();
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})