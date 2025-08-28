App({
  globalData: {
    activeProfileIndex: 0
  },

  onLaunch() {
    try {
      const stored = wx.getStorageSync('profiles');
      if (!stored || !Array.isArray(stored) || stored.length === 0) {
        const defaultProfiles = [
          {
            name: '默认用户',
            gender: 'unknown',
            calendarType: 'lunar',
            city: '北京市',
            trueSolarTime: true,
            date: '2001-12-01',
            time: '12:20'
          }
        ];
        wx.setStorageSync('profiles', defaultProfiles);
        wx.setStorageSync('activeProfileIndex', 0);
      }
    } catch (e) {
      console.error('初始化存储失败', e);
    }
  }
});
import updateManager from './common/updateManager';

App({
  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
