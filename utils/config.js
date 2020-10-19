//const baseRequestHttp ='https://www.carafashion.cn';
//const baseRequestHttp = 'http://116.62.6.120';
const baseRequestHttp = 'http://localhost:8860';
const config = {
  baseUrl: baseRequestHttp,
  imageUrl: baseRequestHttp+'/image/v1/file/view/',
  defalutImage: baseRequestHttp +'/image/static/default/car_park.png',
  loginUrl: '/pages/my/index',
}

module.exports = config;
