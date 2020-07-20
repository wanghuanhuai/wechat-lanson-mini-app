// pages/park/park-add.js
const config = require('../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
const imageUrl = config.imageUrl;
const AUTH = require('../../utils/auth')
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,
    fileList: [
    ],
    rentImage:"",
    isNegotiable:false,
    rentInfo:{},
  },
  onLoad: function (e) {
    AUTH.isLogin();
    if(e && e.id){
     this.setData({
       id:e.id
     });
    }
  },
  onShow: function () {
    const id=this.data.id;
    if (id){
      request(null, "/wx/v1/rentInfo/" + id, null, 'GET').then(data => {
         if(data){
            if(data.result == 'ok'){
              this.setData({
                rentInfo: data.data,
                isNegotiable: data.data.isNegotiable,
              });
              //有图片
              if (data.data.rentImage){
                this.setData({
                  rentImage: data.data.rentImage,
                  fileList: [
                    { url: imageUrl + data.data.rentImage, isImage: true}
                  ]
                })
              }
            }
         }
      })
    }

  },
  // getUserApiInfo: function () {
  //   var that = this;
  //   const token = wx.getStorageSync('token')
  //   const userInfo = jwtDecode(token).userInfo;
  //   let _data = {}
  //   _data.apiUserInfoMap = userInfo;
  //   that.setData(_data);

  // },
  async bindSave(e) {
    wx.showLoading({
      title: '正在保存数据',
    })
    if (e.detail.value.rentNumber == "" ) {
      wx.showToast({
        title: '请填写出租车位名',
        icon: 'none'
      })
      return
    }
    if (!this.rentNumberVali(e.detail.value.rentNumber)){
      wx.showToast({
        title: '出租车位名:输入格式错误,三位数字,例如001',
        icon: 'none'
      })
      return
    }
    if (e.detail.value.rentPrice == "" && e.detail.value.isNegotiable == false) {
      wx.showToast({
        title: '请填写出租价格或者勾选面议',
        icon: 'none'
      })
      return
    }
    if (!this.rentPriceValidator(e.detail.value.rentPrice) && e.detail.value.isNegotiable == false) {
      wx.showToast({
        title: '出租价格:最高9999.9,小数点1位',
        icon: 'none'
      })
      return
    }
    request(null, '/wx/v1/rentInfo', e.detail.value,'POST').then( data => {
        console.log(data);
      if (data){
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
    });
  },
  switchChange: function (event){
    this.setData({
      isNegotiable: event.detail.value
     }
    );
  },
  rentNumberVali(val) {
    return /^\d{3}$/.test(val);
  },
  rentPriceValidator(val) {
    const regex = /(^[0-9]{1,4}$)|(^[0-9]{1,4}[.]{1}[0-9]{1,1}$)/;
    return regex.test(val);
  },
  afterRead(event){
    baseUrl.baseUrl
    var that = this;
     
    const { file } = event.detail;
   // console.log(event);
   // console.log(file);
    wx.uploadFile({
      url: baseUrl+'/image/v1/file/upload',
      filePath: file.path,
      name: 'file',
      success(res) {
        const data = res.data
        var dataObject = JSON.parse(data);
        if (dataObject.success){
          const uploadImageUrl = imageUrl + dataObject.success;
          // 上传完成需要更新 fileList
          const { fileList = [] } = that.data;
          fileList.push({ ...file, url: uploadImageUrl });
          that.setData({ fileList });
          that.setData({
            fileList: fileList,
            rentImage: dataObject.success
          })
        }
      }
    })
  },
})