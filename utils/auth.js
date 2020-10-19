import jwtDecode from '../miniprogram_npm/jwt-decode/index.js';
import request from './request.js';
const config = require('./config');
const loginUrl = config.loginUrl;
async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}
async function getUserId(){
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    if (!token) {
      return reject();
    }
    try {
      const userInfo = jwtDecode(token).userInfo;
      if (!userInfo) {
        return reject();
      }
      console.log(userInfo)
      return resolve(userInfo.openId);
    } catch{
      return reject();
    }


  });
  
}
// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  try {
    const userInfo = jwtDecode(token).userInfo;
      if (!userInfo) {
        return false;
      }
  　} catch (error) {
    return false;
  } 
  
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token');
    wx.removeStorageSync('refreshToken');
    return false
  }
  return true
}

// const checkToken= new Promise((resolve, reject) => {
//         const token = wx.getStorageSync('token')
//         if (!token) {
//           reject(false);
//         }
//         const userInfo = jwtDecode(token).userInfo;
//         if (!userInfo) {
//           reject(false);
//         }
//         const loggined =  checkSession()
//         if (!loggined) {
//           wx.removeStorageSync('token')
//           reject(false);
//         }
//     resolve(true);
//   })



async function isLogin(){
  // checkToken.then(isLogin =>{
  //   console.log('pro:'+isLogin);

  // })


  checkHasLogined().then(isLogin => {
    console.log(isLogin)
    //未登录
    if (!isLogin) {
      //返回登录页
      wx.switchTab({
        url: loginUrl,
      })
    }
  });
 // const isLogin = checkLogin();
 
}

async function wxaCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        return resolve(res.code)
      },
      fail() {
        wx.showToast({
          title: '获取code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}

async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        return resolve(res)
      },
      fail: err => {
        console.error(err)
        return resolve()
      }
    })
  })
}

async function login(page){
  const _this = this
  console.log('page');
  console.log(page);
  const _token = wx.getStorageSync('token');
  //const userInfo_ = jwtDecode(_token).userInfo;

 // console.log(userInfo_);
  if (page) {
    page.onShow()
  }
}

async function register(page) {
  let _this = this;
  wx.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      wx.getUserInfo({
        success: function (res) {
          wx.showLoading({
            title: '正在登录中',
          })
          //3.请求自己的服务器，解密用户信息 获取unionId等加密信息  
          const header = {
            'Authorization': 'Basic bWluaVdlaGNhdDpwYXNzd29yZA==',
            'content-type': 'application/x-www-form-urlencoded'
          };
          const data = {
            encryptedData: res.encryptedData,
            iv: res.iv,
            userInfo: res.rawData,
            code: code,
            signature: res.signature
          };
          request(header,'/auth/api/login/mini',data, 'POST').then(data => {
             // console.info(data);
              if(data){
                if (data.result == 'ok') {
                  const accessToken = data.data;
                  console.log(accessToken);
                  const _token = JSON.stringify(accessToken.value);
                  const _refreshToken = JSON.stringify(accessToken.refreshToken.value);
                  //存入本地缓存
                  wx.setStorageSync('token', JSON.parse(_token))
                  wx.setStorageSync('refreshToken', JSON.parse(_refreshToken))
                  //解析获取用户信息
                  const userInfo_ = jwtDecode(_token).userInfo;
                  _this.login(page);
                } else {
                  wx.showModal({
                    title: '登录失败',
                    content: '无法获取服务器密令',
                    showCancel: false
                  })
                  return;
                }
              }
             
          });
          // request({
          //   url: '/auth/api/login/mini',
          //   method: 'POST',
          //   header: {
          //     'Authorization': 'Basic bWluaVdlaGNhdDpwYXNzd29yZA==',
          //     'content-type': 'application/x-www-form-urlencoded'
          //   },
          //   data: {
          //     encryptedData: res.encryptedData,
          //     iv: res.iv,
          //     userInfo: res.rawData,
          //     code: code,
          //     signature: res.signature
          //   },
          //   success: function (data) {
          //   //  console.log(data.data);
          //     //4.解密成功后 获取自己服务器返回的结果  
          //     if (data.data.result == 'ok') {
          //       const _token = JSON.stringify(data.data.success);
          //       //存入本地缓存
          //       wx.setStorageSync('token', JSON.parse(_token))
          //       //解析获取用户信息
          //       const userInfo_ = jwtDecode(_token).userInfo;

          //       //   var userInfo_ = data.data.userInfo;
          //       //app.globalData.userInfo = userInfo_;
          //       // console.log(app.globalData.userInfo)
          //       _this.login(page);
          //     } else {
          //       console.log('解密失败')
          //     }

          //   },
          //   fail: function () {
          //     // 登录错误
          //     wx.showModal({
          //       title: '无法登录',
          //       content: '服务出错,请稍后尝试',
          //       showCancel: false
          //     })
          //     return;
          //   }
          // })
        },
        fail: function () {
          // 登录错误
          wx.showModal({
            title: '获取用户失败',
            content: '服务出错,请稍后尝试',
            showCancel: false
          })
          return;
        }
      })
    }
  })
}

function loginOut(){
  const token = wx.getStorageSync('token');
  wx.removeStorageSync('token');
  wx.removeStorageSync('refreshToken');
  wx.showLoading({
    title: '正在退出',
  })
  request(null, '/auth/user/logout', { token: token}, 'POST').then(data => {
    if (data) {
      
    }
  });
}

async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}
function clearToken() {
  const token = wx.getStorageSync('token');
  wx.removeStorageSync('token');
  wx.removeStorageSync('refreshToken');
  request(null, '/auth/user/logout', { token: token }, 'POST').then(data => {
    console.log(data);
    if (data) {
    }
  });
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  getUserInfo: getUserInfo,
  login: login,
  register: register,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize,
  isLogin: isLogin,
  getUserId: getUserId,
  clearToken:clearToken,
}