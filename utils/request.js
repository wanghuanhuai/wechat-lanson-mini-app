const config = require('./config');
const AUTH = require('./auth.js');
const app = getApp();
//import loginOut from './auth.js';

const baseUrl = config.baseUrl;    //基准路径
// const request = function (options = {}) {
//   // 用原生对象合并的方法
//   const token =wx.getStorageSync('token');
//   console.log();
//   var header={};
//   if (token){
//     header={
//       'Authorization': 'Bearer ' + token,
//     }
//   }
//   const newOptions = Object.assign({}, options, {
//     url: `${baseUrl}${options.url}`,
//     header: options.header ? options.header : header,
//   })

//   return wx.request(newOptions);
// }
// // get请求
// request.get = function () { }

// // methods: "POST"
// request.post = function () {

// }
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
function storeToken(token, refreshToken) {
  wx.setStorageSync('token', token )
  wx.setStorageSync('refreshToken', refreshToken)
}


const refreshTokenRequest = function refreshToken(){
  return new Promise(function (resolve, reject) {
      const refreshToken = wx.getStorageSync('refreshToken');
      wx.request({
        method: 'POST',
         url: baseUrl + '/wx/token/refresh',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          refresh_token: refreshToken,
          client_id: 'miniWehcat'
        },
        success: function (res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = res.data.data;
            storeToken(data.access_token, data.refresh_token);
            resolve(data);
          } else {
            resolve();
          }
        }
      })
  })
};

const reConnectRequest = function reConnectRequest(options) {
  return new Promise(function (resolve, reject) {
    const token = wx.getStorageSync('token');
    if (token) {
      options.header = {
        'Authorization': 'Bearer ' + token,
      }
    }
    wx.request({
      method: options.method,
      url: options.url,
      data:options.data,
      header: options.header,
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
};
//队列
let requests = [];
let isRefreshing = false;
function refreshToken( options){
  requests.push(options);

  if (!isRefreshing) {
      isRefreshing = true;
    refreshTokenRequest().then(data => {

        if(data){
            requests.forEach(function (item, index) {
              reConnectRequest(item).then(data => {
                item.resolve(data);
              }).catch(err => {
                item.reject(err);
              });
            });
        }else{
          const res = { statusCode : '401'};
          requests.forEach(function (item, index) {
            item.reject(res);
          });

        }

    }).finally(() => {
      isRefreshing = false;
      requests = [];
    })
  }
}





const request = function request(header,url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
      const token = wx.getStorageSync('token');
      var baseHeader = {};
      if (token) {
        baseHeader = {
          'Authorization': 'Bearer ' + token,
        }
      }
     // const header1 = header ? header : baseHeader;
    //  console.log('head1:' + header1.Authorization);
      wx.request({
        url: baseUrl+url,
        data: data,
        method: method,
        header: header ? header : baseHeader,
        success: function (res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else if (res.statusCode == 401){
            const options={
              url: baseUrl + url,
              data: data,
              method: method,
              header: header ? header : baseHeader,
              resolve: resolve,
              reject: reject,
            }

            refreshToken(options);
            //reject(options);
          }else{
            //throw new Error(res) 
           reject(res);
            }
        },
        fail: function (err) {
           reject(err)
          //throw new Error(err) 
          //console.log("failed")
        }
      })
    }).catch(res =>{
      console.warn("catch:"+res)
      if (res.statusCode) { 
        const status = res.statusCode;
        if (status == '401') {
              wx.hideLoading(); 
          //token
         // refreshToken(res); 
          wx.showModal({
            title: '登录错误',
            content: '未登录或登录已过期，请重新登录。',
            success(res) {
              if (res.confirm) {
                clearToken();
                wx.switchTab({
                  url: '/pages/my/index',
                })
              }
            }
          })
          }
        if (status === 403) {
          wx.showToast({
            title: '权限不足',
            icon: 'none'
          })
          return;
        }
        if (status <= 504 && status >= 500) {
          wx.showToast({
            title: '网关超时,请重新尝试',
            icon: 'none'
          })
          return;
        }
        if (status >= 404 && status < 422) {
          wx.showToast({
            title: '您的网络发生异常，无法连接服务器',
            icon: 'none'
          })
          return;
        }
      }else{
        wx.showToast({
          title: '您的网络发生异常，无法连接服务器',
          icon: 'none'
        })
      }
      }).finally(() =>{
        wx.hideLoading(); 
      });
  }


export default request;