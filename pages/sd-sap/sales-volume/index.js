// pages/sd-sap/sales-volume/index.js
const AUTH = require('../../../utils/auth')
const config = require('../../../utils/config')
const baseUrl = config.baseUrl;    //基准路径
import request from '../../../utils/request.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    list: [
    ],
    onInitChart(F2, config) {
      const chart = new F2.Chart(config);
      const  data=[
        {year: '0',quarter:'柱形图',quarterSales: 0}, 
      ];
      chart.source(data);
      chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
        onChange: function onChange(obj) {
          console.info(obj)
          const legend = chart.get('legendController').legends.top[0];
          const tooltipItems = obj.items;
          const legendItems = legend.items;
          const map = {};
          legendItems.map(item => {
            map[item.name] = Object.assign({}, item);
          });
          tooltipItems.map(item => {
            const { name, value } = item;
            if (map[name]) {
              map[name].value = value;
            }
          });
          legend.setItems(Object.values(map));
        },
        onHide() {
          const legend = chart.get('legendController').legends.top[0];
          legend.setItems(chart.getLegendItems().country);
        }
    });
  
  
      chart.interval()
        .position('quarter*quarterSales')
        .color('year')
        .adjust({
          type: 'dodge',
          marginRatio: 0.05 // 设置分组间柱子的间距
        });
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
  },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
      this.getListData();
  },
  onClick() {
    this.getListData();
  },
  getListData(){
    wx.showLoading({
      title: '加载数据中....',
    })
    const code=this.data.value;
    request(null,'/sap/v1/sd/KUNNR/'+code, null, 'GET').then(data => {
      if(data){
         if(data.result  && data.result == 'ok'){
           this.setData({
              list: data.data.list,
          })
          let wxF2 = this.selectComponent('#wxf2');
           let chart=wxF2.chart;
           chart.changeData(data.data.chartList);
         }
      }
     
    })

  },
})