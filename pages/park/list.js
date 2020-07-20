const AUTH = require('../../utils/auth')
const config = require('../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
const imageUrl = config.imageUrl;    //基准路径
const defalutImage = config.defalutImage;    //基准路径
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage:false,
    messageValue:'',
    pageNum: 1,
    pageSize: 10,
    typeValue: 'all',
    sortValue: 'default',
//    listType: 1, // 1为1个商品一行，2为2个商品一行    
    searchName: '', // 搜索关键词
    imageUrl: imageUrl,
   // defalutImage:'../../images/app/car_park.png',
    defalutImage: defalutImage,
    list:[],
    typeOption: [
      { text: '全部', value: 'all' },
      { text: '正在出租', value: 'Y' },
      { text: '已经出租', value: 'N' }
    ],
    sortOption: [
      { text: '默认排序', value: 'default' },
      { text: '最新', value: 'new' },
      { text: '车位号', value: 'carNumber' },
      { text: '价格从低到高', value: 'priceToHigh' },
      { text: '价格从高到低', value: 'priceToLow' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.name){
      this.setData({
        searchName: options.searchName,
      })
    }
  
    this.search();
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
  onTypeValueChange(value){
    this.setData({
      pageNum: 1,
      list: [],
      typeValue: value.detail,
    });
    this.search();
  },
  onSortValueChange(value) {
    this.setData({
      pageNum: 1,
      list: [],
      sortValue: value.detail,
    });
    this.search();
  },

  async search() {
    // 搜索商品
    wx.showLoading({
      title: '加载中',
    })
    const _data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      typeStatus: this.data.typeValue,
      sort: this.data.sortValue,
      searchName:this.data.searchName,
    }
    //const res = await WXAPI.goods(_data)
    request(null, '/wx/v1/rentInfo/page',_data,'GET').then(data =>{
         console.log(data);
      if (data){
            var list = this.data.list;
            list.push(...data.data)
            let pageInfo = data.cursor;
           const total = pageInfo.total;
            this.setData({
              list: list,
              total: total,
      })
      }
    })
  //  wx.hideLoading()
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
    console.log('下拉啦');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.list.length == this.data.total){
      wx.showToast({
        title: '没有更多数据',
      })
      return;
    }
    this.data.pageNum += 1;
    this.search();
  },
  changeShowType() {
    if (this.data.listType == 1) {
      this.setData({
        listType: 2
      })
    } else {
      this.setData({
        listType: 1
      })
    }
  },
  bindconfirm(e) {
    this.setData({
      pageNum: 1,
      list: [],
      searchName: e.detail.value,
    });
    this.search()
  },
  sendMessage(e){
    let value = e.currentTarget.dataset.value
    this.setData({
      userId:value,
      showMessage:true
    });
  },
  onConfirm(e) {
    // 搜索商品
    wx.showLoading({
      title: '提交留言中...',
    })
    let value = e.currentTarget.dataset.value
    const _data={
      toUserId: this.data.userId,
      message: this.data.messageValue.value,
    }
    request(null, '/wx/v1/message', _data, 'POST').then(data =>{
     // console.log(data);
      if (data) {
        if (data.result == 'ok') {
          wx.showToast({
            title: data.success,
            icon: 'none'
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
      this.setData({ close: false });
    });

  },
  getMessageValue(e) {
    this.data.messageValue = e.detail;
  },
  onClose() {
    this.setData({ showMessage: false });
  },

})