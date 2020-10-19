const { default: request } = require("../../../utils/request");

// pages/sap/order/report.js
const columns = [];
var defualtYearIndex=0;
for (let i = 2016; i <= new Date().getFullYear(); i++) {
  columns.push(i);
}
defualtYearIndex=columns.length-1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    itemTitle: '查询条件',
    option1: [
      { text: '按公司统计', value: 0 },
      { text: '按部门统计', value: 1 },
  //    { text: '按客户统计', value: 2 },
    ],
    defaultValue: 0,
    deptName:"ALL",
    deptValue:"",
    show: false,
    yearshow:false,
    year:2000,
    actions: [
      {
        name: 'ALL',
        value: ''
      },
      {
        name: '业务二部',
        value: '0010'
      },
      {
        name: '业务三部',
        value: '0003'
      },
      {
        name: '业务五部',
        value: '0005'
      },
      {
        name: '业务七部',
        value: '0007'
      },
      {
        name: '业务八部',
        value: '0008'
      },
    ],
    columns,
    defualtYearIndex,
  },

   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const curyear=new Date().getFullYear();
    const defualtYearIndex=this.data.columns.indexOf(curyear);
    console.log(defualtYearIndex);
    console.log( curyear);
    this.setData({
      year:curyear,
      defualtYearIndex:defualtYearIndex
    })
      this.getListData();


  },

  getListData(){
    wx.showLoading({
      title: '加载数据中....',
    })
    const year=this.data.year;
    const dept=this.data.deptValue;
    const reportType=this.data.defaultValue;
    const data={
      year:year,
      dept:dept
    };

    request(null,'/sap/v1/order/gx/report/'+reportType, data, 'GET').then(data => {
      if(data){
         if(data.result  && data.result == 'ok'){
           this.setData({
              list: data.data,
          })
       }else{
          this.setData({
            list:[]
          })
       }
     }
    })

  },
  onOpenSheet(){
    this.setData({ show: true });
  },
  onOpenYear(){
    this.setData({yearshow:true});
  },
  onClose() {
    this.setData({ show: false });
  },
  onYearClose(){
    this.setData({ yearshow: false });
  },
  onSelect(event) {
    console.log(event.detail);
    this.setData({
      deptName:event.detail.name,
      deptValue:event.detail.value
    })
  },
  onYearConfirm(event){
    const { picker, value, index } = event.detail;
    this.setData({
      year:value,
      yearshow: false
    })
  },
  onYearCancel(event){
    this.setData({
      yearshow: false
    })
  },
  onSearch(){
    this.selectComponent('#item').toggle();
    this.getListData();
  },
  onChangeType(event){
   this.setData({
    defaultValue:event.detail
   })
   this.getListData();
  }


})