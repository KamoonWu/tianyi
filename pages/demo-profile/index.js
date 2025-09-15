// pages/demo-profile/index.js
const { computeChartWithIztro } = require('../../utils/iztro-adapter');

Page({
  data: {
    profile: {
      name: '示例用户',
      gender: 'male',
      calendarType: 'solar',
      city: '太原市',
      trueSolarTime: true,
      date: '1991-01-22',
      time: '4:00'
    },
    chartData: null,
    loading: true,
    error: null
  },

  onLoad: function() {
    this.calculateChart();
  },

  calculateChart: function() {
    try {
      this.setData({ loading: true, error: null });
      
      // 使用iztro适配器计算命盘
      const chartData = computeChartWithIztro(this.data.profile);
      
      if (!chartData) {
        this.setData({
          loading: false,
          error: '计算命盘失败，请检查输入信息'
        });
        return;
      }
      
      console.log('命盘数据:', chartData);
      
      this.setData({
        chartData: chartData,
        loading: false
      });
    } catch (error) {
      console.error('计算命盘出错:', error);
      this.setData({
        loading: false,
        error: `计算出错: ${error.message || '未知错误'}`
      });
    }
  }
});